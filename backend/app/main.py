from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from app.core.config import settings
from app.core.database import init_db, async_session
from app.api.routes import api_router
from app.services.scheduler_service import scheduler_service
from app.services.device_refresh_service import device_refresh_service
from app.services.scenario_engine import scenario_engine
from app.plugins.registry import load_builtin_plugins, PluginRegistry
from app.models.plugin import Plugin
from app.models.scenario import Scenario
from app.services.update_service import update_service
import logging

# Configure logging
logging.basicConfig(
    level=logging.DEBUG if settings.debug else logging.INFO,
    format="%(asctime)s %(levelname)-7s [%(name)s] %(message)s",
    datefmt="%H:%M:%S",
)
# Quiet noisy libraries
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)
logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
logging.getLogger("apscheduler").setLevel(logging.WARNING)

logger = logging.getLogger(__name__)


async def _setup_enabled_plugins():
    """Setup all enabled plugins that have a stored hub_config."""
    async with async_session() as db:
        result = await db.execute(select(Plugin).where(Plugin.enabled == True))
        for plugin in result.scalars().all():
            instance = await PluginRegistry.get_instance(plugin.slug)
            if instance and plugin.hub_config:
                try:
                    await instance.setup(plugin.hub_config)
                    logger.info(f"Plugin '{plugin.name}' hub setup OK")
                except Exception as exc:
                    logger.error(f"Plugin '{plugin.name}' hub setup failed: {exc}")


async def _register_scenario_schedules():
    """Register APScheduler jobs for scenarios with time-based triggers."""
    async with async_session() as db:
        result = await db.execute(
            select(Scenario).where(Scenario.enabled == True)
        )
        count = 0
        for scenario in result.scalars().all():
            for trigger in (scenario.triggers or []):
                if trigger.get("type") == "time":
                    time_str = trigger.get("config", {}).get("time", "")
                    if not time_str or ":" not in time_str:
                        continue
                    parts = time_str.split(":")
                    hour, minute = parts[0], parts[1]
                    cron_expr = f"{minute} {hour} * * *"
                    job_id = f"scenario_{scenario.id}_time_{time_str}"
                    scheduler_service.add_cron_job(
                        job_id,
                        scenario_engine.on_time_trigger,
                        cron_expr,
                        args=[scenario.id],
                    )
                    count += 1
                    logger.info(f"Scheduled scenario '{scenario.name}' at {time_str}")
        if count:
            logger.info(f"Registered {count} time-based scenario trigger(s)")

    # Register a periodic job to evaluate scenarios without explicit triggers
    scheduler_service.add_interval_job(
        "scenario_periodic_eval",
        _evaluate_triggerless_scenarios,
        seconds=60,
    )
    logger.info("Registered periodic scenario evaluation (every 60s)")


async def _evaluate_triggerless_scenarios():
    """Evaluate enabled scenarios that have no triggers but have conditions (time/day-based)."""
    async with async_session() as db:
        result = await db.execute(
            select(Scenario).where(Scenario.enabled == True)
        )
        for scenario in result.scalars().all():
            triggers = scenario.triggers or []
            conditions = scenario.conditions or []
            actions = scenario.actions or []
            if len(triggers) > 0 or len(conditions) == 0 or len(actions) == 0:
                continue
            try:
                context = await scenario_engine.build_context(db)
                await scenario_engine.run_scenario(scenario, db, context)
            except Exception as e:
                logger.error(f"Error evaluating triggerless scenario '{scenario.name}': {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    load_builtin_plugins()
    await init_db()
    await _setup_enabled_plugins()
    scheduler_service.start()
    await _register_scenario_schedules()
    device_refresh_service.start()
    update_service.start_periodic_check()
    yield
    # Shutdown
    await update_service.stop_periodic_check()
    await device_refresh_service.stop()
    scheduler_service.shutdown()
    await PluginRegistry.cleanup_all()


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    lifespan=lifespan,
    redirect_slashes=False,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")
