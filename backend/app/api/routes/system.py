from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.core.security import get_current_user
from app.models.user import User
from app.services.update_service import update_service
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if not getattr(current_user, "is_admin", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Reserve aux administrateurs",
        )
    return current_user


@router.get("/serial-ports")
async def list_serial_ports():
    """List available serial/COM ports with their descriptions."""
    try:
        from serial.tools.list_ports import comports
        ports = []
        for port_info in sorted(comports(), key=lambda p: p.device):
            ports.append({
                "port": port_info.device,
                "description": port_info.description or port_info.device,
                "hwid": port_info.hwid or "",
                "manufacturer": port_info.manufacturer or "",
            })
        return ports
    except ImportError:
        logger.warning("pyserial not installed - cannot list serial ports")
        return []
    except Exception as exc:
        logger.error("Error listing serial ports: %s", exc)
        return []


@router.get("/version")
async def get_version():
    """Return the installed version metadata (read from backend/VERSION)."""
    return update_service.get_version()


@router.get("/check-update")
async def check_update():
    """Check GitHub for a newer version."""
    return await update_service.check_for_update()


@router.post("/apply-update")
async def apply_update(_: User = Depends(require_admin)):
    """Apply the available update. Admin only."""
    return await update_service.apply_update()


@router.get("/update-status")
async def update_status():
    """Return cached update status without querying GitHub."""
    return update_service.get_status()


@router.post("/auto-update")
async def set_auto_update(body: dict, _: User = Depends(require_admin)):
    """Enable or disable automatic updates. Admin only."""
    enabled = body.get("enabled", False)
    update_service.set_auto_update(bool(enabled))
    return {"auto_update": update_service.auto_update_enabled}


@router.get("/auto-update")
async def get_auto_update():
    """Return current auto-update setting."""
    return {"auto_update": update_service.auto_update_enabled}


@router.get("/update-log")
async def get_update_log(lines: int = Query(50, ge=1, le=500)):
    """Return the tail of the update log and the current update status.

    The status file (update.status) is written by the update script:
      - 'running' at the start
      - 'done' on success
      - 'failed' on error
    """
    backend_dir = Path(__file__).resolve().parent.parent.parent
    log_file = backend_dir / "update.log"
    status_file = backend_dir / "update.status"

    log_lines: list[str] = []
    if log_file.exists():
        try:
            all_lines = log_file.read_text(encoding="utf-8", errors="replace").splitlines()
            log_lines = all_lines[-lines:]
        except Exception:
            pass

    update_status_value = "idle"
    if status_file.exists():
        try:
            update_status_value = status_file.read_text(encoding="utf-8").strip()
        except Exception:
            pass

    return {
        "status": update_status_value,
        "log": log_lines,
    }


@router.post("/serial-test")
async def serial_test(_: User = Depends(require_admin)):
    """Send a fake serial_monitor message via WebSocket (for testing without hardware)."""
    from app.core.websocket import manager as ws_manager
    from datetime import datetime, timezone
    sample_lines = [
        "1025191933_0_0@22.50:0/01",
        "1025191933_6_0@45.2:0/01",
        "1025191933_9_0@3.87:0/01",
    ]
    import random
    raw = random.choice(sample_lines)
    await ws_manager.broadcast({
        "type": "serial_monitor",
        "plugin": "rf24network",
        "direction": "RX",
        "raw": raw,
    })
    return {"sent": raw}

