from typing import List, Dict, Any
from fastapi import WebSocket
import json
import asyncio


class ConnectionManager:
    """Manages WebSocket connections for real-time device state updates."""

    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: Dict[str, Any], websocket: WebSocket):
        await websocket.send_json(message)

    async def broadcast(self, message: Dict[str, Any]):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                self.active_connections.remove(connection)

    async def broadcast_device_state(self, device_id: int, state: Dict[str, Any]):
        await self.broadcast({
            "type": "device_state_update",
            "device_id": device_id,
            "state": state
        })

    async def broadcast_scenario_event(self, scenario_id: int, event: str, details: Dict[str, Any] = None):
        await self.broadcast({
            "type": "scenario_event",
            "scenario_id": scenario_id,
            "event": event,
            "details": details or {}
        })


manager = ConnectionManager()
