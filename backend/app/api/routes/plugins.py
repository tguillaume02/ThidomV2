from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.plugin import Plugin
from app.models.device import Device
from app.models.scenario import Scenario
from app.models.schedule import Schedule
from app.models.user import User
from app.schemas.plugin import PluginCreate, PluginUpdate, PluginResponse, PluginHubConfigUpdate
from app.plugins.registry import PluginRegistry, load_builtin_plugins
from app.services.log_service import create_log
from app.core.websocket import manager as ws_manager
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


# ------------------------------------------------------------------
# CRUD
# ------------------------------------------------------------------

@router.get("/", response_model=List[PluginResponse])
async def get_plugins(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Plugin).order_by(Plugin.name))
    plugins = result.scalars().all()
    enriched = []
    for plugin in plugins:
        data = PluginResponse.model_validate(plugin).model_dump()
        plugin_class = PluginRegistry.get_plugin_class(plugin.slug)
        data["needs_polling"] = plugin_class.needs_polling if plugin_class else False
        data["needs_hub_config"] = bool(plugin_class and plugin_class.get_hub_config_schema())
        # Always inject live config_schema / default_config from the plugin class
        if plugin_class:
            data["config_schema"] = plugin_class.get_config_schema() or data.get("config_schema")
            data["default_config"] = plugin_class.get_default_config() or data.get("default_config")
        enriched.append(data)
    return enriched


@router.get("/available")
async def get_available_plugins():
    """List all registered plugins from the registry (includes hub_config_schema + connection_status)."""
    return PluginRegistry.list_plugins()


@router.get("/{plugin_id}", response_model=PluginResponse)
async def get_plugin(plugin_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Plugin).where(Plugin.id == plugin_id))
    plugin = result.scalar_one_or_none()
    if not plugin:
        raise HTTPException(status_code=404, detail="Plugin not found")
    return plugin


@router.post("/", response_model=PluginResponse)
async def create_plugin(
    plugin_data: PluginCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    plugin = Plugin(**plugin_data.model_dump())
    db.add(plugin)
    await db.commit()
    await db.refresh(plugin)
    await ws_manager.broadcast({"type": "plugin_changed", "action": "created", "plugin_id": plugin.id})
    return plugin


@router.put("/{plugin_id}", response_model=PluginResponse)
async def update_plugin(
    plugin_id: int,
    plugin_data: PluginUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Plugin).where(Plugin.id == plugin_id))
    plugin = result.scalar_one_or_none()
    if not plugin:
        raise HTTPException(status_code=404, detail="Plugin not found")

    was_enabled = plugin.enabled

    for key, value in plugin_data.model_dump(exclude_unset=True).items():
        setattr(plugin, key, value)

    await db.commit()
    await db.refresh(plugin)

    # On enable: setup plugin with stored hub_config
    if not was_enabled and plugin.enabled and plugin.hub_config:
        instance = await PluginRegistry.get_instance(plugin.slug)
        if instance:
            await instance.setup(plugin.hub_config)

    # On disable: teardown + cascade
    if was_enabled and not plugin.enabled:
        instance = await PluginRegistry.get_instance(plugin.slug)
        if instance:
            await instance.teardown()
        await _cascade_disable_plugin(plugin, db, current_user)

    await ws_manager.broadcast({"type": "plugin_changed", "action": "updated", "plugin_id": plugin.id})
    return plugin


# ------------------------------------------------------------------
# Hub setup endpoints
# ------------------------------------------------------------------

@router.get("/{plugin_id}/hub-schema")
async def get_plugin_hub_schema(plugin_id: int, db: AsyncSession = Depends(get_db)):
    """Return hub config schema, defaults, and current stored config."""
    result = await db.execute(select(Plugin).where(Plugin.id == plugin_id))
    plugin = result.scalar_one_or_none()
    if not plugin:
        raise HTTPException(status_code=404, detail="Plugin not found")
    plugin_class = PluginRegistry.get_plugin_class(plugin.slug)
    if not plugin_class:
        raise HTTPException(status_code=404, detail="Plugin not found in registry")
    return {
        "hub_config_schema": plugin_class.get_hub_config_schema(),
        "default_hub_config": plugin_class.get_default_hub_config(),
        "current_hub_config": plugin.hub_config or {},
    }


@router.put("/{plugin_id}/hub-config")
async def save_plugin_hub_config(
    plugin_id: int,
    data: PluginHubConfigUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Save hub config and re-setup the plugin."""
    result = await db.execute(select(Plugin).where(Plugin.id == plugin_id))
    plugin = result.scalar_one_or_none()
    if not plugin:
        raise HTTPException(status_code=404, detail="Plugin not found")

    plugin.hub_config = data.hub_config
    await db.commit()
    await db.refresh(plugin)

    status = {"connected": False, "message": "Plugin desactive"}
    if plugin.enabled:
        instance = await PluginRegistry.get_instance(plugin.slug)
        if instance:
            await instance.teardown()
            success = await instance.setup(data.hub_config)
            status = instance.connection_status

    await create_log(
        db, "INFO", "user_action",
        f"Configuration hub du plugin '{plugin.name}' mise a jour",
        user_id=current_user.id,
    )
    await ws_manager.broadcast({"type": "plugin_changed", "action": "hub_config", "plugin_id": plugin.id})
    return {"status": "ok", "connection_status": status}


@router.post("/{plugin_id}/test-connection")
async def test_plugin_connection(
    plugin_id: int,
    data: PluginHubConfigUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Test hub connection without saving."""
    result = await db.execute(select(Plugin).where(Plugin.id == plugin_id))
    plugin = result.scalar_one_or_none()
    if not plugin:
        raise HTTPException(status_code=404, detail="Plugin not found")
    instance = await PluginRegistry.get_instance(plugin.slug)
    if not instance:
        raise HTTPException(status_code=400, detail="Plugin not instantiated")
    return await instance.test_connection(data.hub_config)


@router.get("/{plugin_id}/status")
async def get_plugin_status(plugin_id: int, db: AsyncSession = Depends(get_db)):
    """Get the live connection status of a plugin."""
    result = await db.execute(select(Plugin).where(Plugin.id == plugin_id))
    plugin = result.scalar_one_or_none()
    if not plugin:
        raise HTTPException(status_code=404, detail="Plugin not found")
    instance = await PluginRegistry.get_instance(plugin.slug)
    if not instance:
        return {"connected": False, "message": "Plugin non instancie"}
    return instance.connection_status


# ------------------------------------------------------------------
# Sync
# ------------------------------------------------------------------

@router.post("/sync")
async def sync_plugins(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Sync registry plugins to the database."""
    load_builtin_plugins()
    registered = PluginRegistry.list_plugins()
    synced = []

    for info in registered:
        result = await db.execute(select(Plugin).where(Plugin.slug == info["slug"]))
        existing = result.scalar_one_or_none()
        if not existing:
            plugin = Plugin(
                name=info["name"],
                slug=info["slug"],
                description=info["description"],
                version=info["version"],
                category=info["category"],
                icon=info["icon"],
                config_schema=info["config_schema"],
                default_config=info["default_config"],
            )
            db.add(plugin)
            synced.append(info["slug"])

    await db.commit()
    if synced:
        await ws_manager.broadcast({"type": "plugin_changed", "action": "synced", "synced": synced})
    return {"synced": synced, "total_registered": len(registered)}


# ------------------------------------------------------------------
# Helpers
# ------------------------------------------------------------------

async def _cascade_disable_plugin(plugin: Plugin, db: AsyncSession, user: User):
    result = await db.execute(select(Device).where(Device.plugin_id == plugin.id))
    devices = result.scalars().all()
    device_ids = {d.id for d in devices}

    if not device_ids:
        await db.commit()
        return

    logger.info(f"Plugin '{plugin.name}' disabled - cascading to {len(device_ids)} device(s)")

    sched_result = await db.execute(select(Schedule).where(Schedule.enabled == True))
    disabled_schedules = 0
    for schedule in sched_result.scalars().all():
        if _action_references_devices(schedule.action, device_ids):
            schedule.enabled = False
            disabled_schedules += 1

    scen_result = await db.execute(select(Scenario).where(Scenario.enabled == True))
    disabled_scenarios = 0
    for scenario in scen_result.scalars().all():
        if _scenario_references_devices(scenario, device_ids):
            scenario.enabled = False
            disabled_scenarios += 1

    await db.commit()
    await create_log(
        db, "WARNING", "system",
        f"Plugin '{plugin.name}' desactive - {len(device_ids)} appareil(s), "
        f"{disabled_schedules} planification(s), {disabled_scenarios} scenario(s)",
        user_id=user.id,
    )


def _action_references_devices(action: dict, device_ids: set) -> bool:
    if not action:
        return False
    for target in action.get("targets", []):
        if target.get("device_id") in device_ids:
            return True
    if action.get("config", {}).get("device_id") in device_ids:
        return True
    return False


def _scenario_references_devices(scenario: Scenario, device_ids: set) -> bool:
    for section in [scenario.triggers or [], scenario.conditions or [], scenario.actions or []]:
        for item in section:
            if item.get("config", {}).get("device_id") in device_ids:
                return True
    return False
