from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.core.websocket import manager

router = APIRouter()


@router.websocket("/live")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            # Handle incoming WebSocket messages
            msg_type = data.get("type", "")
            if msg_type == "ping":
                await manager.send_personal_message({"type": "pong"}, websocket)
            elif msg_type == "subscribe":
                # Client can subscribe to specific device updates
                await manager.send_personal_message({
                    "type": "subscribed",
                    "device_id": data.get("device_id")
                }, websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
