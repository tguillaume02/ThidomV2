"""
Camera proxy routes - streams video from local cameras through the ThiDom server.
Cameras never need to be exposed to the internet; the frontend only talks to this proxy.
"""
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.device import Device
import httpx
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


def _build_auth(config: dict):
    username = config.get("username")
    password = config.get("password")
    if username and password:
        return (username, password)
    return None


@router.get("/{device_id}/stream")
async def proxy_camera_stream(device_id: int, db: AsyncSession = Depends(get_db)):
    """
    Proxy an MJPEG stream from a local camera.
    The frontend points its img src to /api/cameras/{id}/stream
    and never touches the camera directly.
    """
    device = await _get_camera_device(device_id, db)
    stream_url = (device.config or {}).get("stream_url", "")
    if not stream_url:
        raise HTTPException(status_code=400, detail="Aucune URL de flux configuree pour cette camera")

    auth = _build_auth(device.config or {})

    async def _stream():
        async with httpx.AsyncClient(timeout=None) as client:
            async with client.stream("GET", stream_url, auth=auth) as resp:
                async for chunk in resp.aiter_bytes(chunk_size=4096):
                    yield chunk

    try:
        # Peek to get content-type from the camera
        async with httpx.AsyncClient(timeout=10.0) as client:
            head = await client.head(stream_url, auth=auth)
            content_type = head.headers.get("content-type", "multipart/x-mixed-replace; boundary=frame")
    except Exception:
        content_type = "multipart/x-mixed-replace; boundary=frame"

    return StreamingResponse(_stream(), media_type=content_type)


@router.get("/{device_id}/snapshot")
async def proxy_camera_snapshot(device_id: int, db: AsyncSession = Depends(get_db)):
    """Proxy a single JPEG snapshot from a local camera."""
    device = await _get_camera_device(device_id, db)
    config = device.config or {}
    snapshot_url = config.get("snapshot_url") or config.get("stream_url", "")
    if not snapshot_url:
        raise HTTPException(status_code=400, detail="Aucune URL de snapshot configuree")

    auth = _build_auth(config)
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(snapshot_url, auth=auth)
            if resp.status_code == 200:
                content_type = resp.headers.get("content-type", "image/jpeg")
                return Response(content=resp.content, media_type=content_type)
            raise HTTPException(status_code=502, detail=f"Camera a retourne le code {resp.status_code}")
    except httpx.RequestError as e:
        logger.warning(f"Camera snapshot proxy failed for device {device_id}: {e}")
        raise HTTPException(status_code=502, detail="Camera injoignable sur le reseau local")


async def _get_camera_device(device_id: int, db: AsyncSession) -> Device:
    result = await db.execute(select(Device).where(Device.id == device_id))
    device = result.scalar_one_or_none()
    if not device:
        raise HTTPException(status_code=404, detail="Appareil introuvable")
    if device.device_type != "camera":
        raise HTTPException(status_code=400, detail="Cet appareil n'est pas une camera")
    return device
