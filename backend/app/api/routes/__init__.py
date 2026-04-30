from fastapi import APIRouter
from app.api.routes import auth, rooms, devices, plugins, scenarios, logs, schedules, history, websocket, camera, system, alexa

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(rooms.router, prefix="/rooms", tags=["Rooms"])
api_router.include_router(devices.router, prefix="/devices", tags=["Devices"])
api_router.include_router(plugins.router, prefix="/plugins", tags=["Plugins"])
api_router.include_router(scenarios.router, prefix="/scenarios", tags=["Scenarios"])
api_router.include_router(logs.router, prefix="/logs", tags=["Logs"])
api_router.include_router(schedules.router, prefix="/schedules", tags=["Schedules"])
api_router.include_router(history.router, prefix="/history", tags=["History"])
api_router.include_router(websocket.router, prefix="/ws", tags=["WebSocket"])
api_router.include_router(camera.router, prefix="/cameras", tags=["Cameras"])
api_router.include_router(system.router, prefix="/system", tags=["System"])
api_router.include_router(alexa.router, prefix="/alexa", tags=["Alexa"])
