from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.models.user import User
from app.services.update_service import update_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


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


@router.get("/check-update")
async def check_update():
    """Check GitHub for a newer version."""
    return await update_service.check_for_update()


@router.post("/apply-update")
async def apply_update(current_user: User = Depends(get_current_user)):
    """Apply the available update (git pull). Requires authentication."""
    return await update_service.apply_update()


@router.get("/update-status")
async def update_status():
    """Return cached update status without querying GitHub."""
    return update_service.get_status()
