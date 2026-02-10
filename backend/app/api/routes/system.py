from fastapi import APIRouter
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
