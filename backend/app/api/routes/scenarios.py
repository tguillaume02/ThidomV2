from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timezone
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.scenario import Scenario
from app.models.device import Device
from app.models.user import User
from app.schemas.scenario import ScenarioCreate, ScenarioUpdate, ScenarioResponse
from app.services.scenario_engine import scenario_engine
from app.services.log_service import create_log

router = APIRouter()


@router.get("/", response_model=List[ScenarioResponse])
async def get_scenarios(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Scenario).order_by(Scenario.name))
    return result.scalars().all()


@router.get("/{scenario_id}", response_model=ScenarioResponse)
async def get_scenario(scenario_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Scenario).where(Scenario.id == scenario_id))
    scenario = result.scalar_one_or_none()
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found")
    return scenario


@router.post("/", response_model=ScenarioResponse)
async def create_scenario(
    scenario_data: ScenarioCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    scenario = Scenario(**scenario_data.model_dump())
    db.add(scenario)
    await db.commit()
    await db.refresh(scenario)
    await create_log(db, "INFO", "user_action", f"Scenario '{scenario.name}' created", user_id=current_user.id, scenario_id=scenario.id)
    return scenario


@router.put("/{scenario_id}", response_model=ScenarioResponse)
async def update_scenario(
    scenario_id: int,
    scenario_data: ScenarioUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Scenario).where(Scenario.id == scenario_id))
    scenario = result.scalar_one_or_none()
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found")

    for key, value in scenario_data.model_dump(exclude_unset=True).items():
        setattr(scenario, key, value)

    await db.commit()
    await db.refresh(scenario)
    await create_log(db, "INFO", "user_action", f"Scenario '{scenario.name}' updated", user_id=current_user.id, scenario_id=scenario.id)
    return scenario


@router.delete("/{scenario_id}")
async def delete_scenario(
    scenario_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Scenario).where(Scenario.id == scenario_id))
    scenario = result.scalar_one_or_none()
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found")

    name = scenario.name
    await db.delete(scenario)
    await db.commit()
    await create_log(db, "INFO", "user_action", f"Scenario '{name}' deleted", user_id=current_user.id)
    return {"message": f"Scenario '{name}' deleted"}


@router.post("/{scenario_id}/test")
async def test_scenario(
    scenario_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Manually trigger a scenario for testing (skip trigger/condition evaluation)."""
    result = await db.execute(select(Scenario).where(Scenario.id == scenario_id))
    scenario = result.scalar_one_or_none()
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found")

    actions = scenario.actions or []
    if not actions:
        return {"message": f"Scenario '{scenario.name}' has no actions", "status": "empty", "results": []}

    context = await scenario_engine.build_context(db)
    results = await scenario_engine.execute_actions(actions, db, context)

    scenario.last_triggered = datetime.now(timezone.utc)
    scenario.trigger_count = (scenario.trigger_count or 0) + 1
    await db.commit()

    await create_log(
        db, "INFO", "scenario",
        f"Scenario '{scenario.name}' manually triggered",
        user_id=current_user.id, scenario_id=scenario.id,
        details={"results": results},
    )
    return {"message": f"Scenario '{scenario.name}' executed", "status": "ok", "results": results}
