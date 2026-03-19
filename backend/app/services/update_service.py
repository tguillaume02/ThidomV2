"""
Application update service — checks GitHub for new versions and applies updates via git pull.
"""
import asyncio
import subprocess
import logging
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from pathlib import Path

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)

# Resolve the project root (two levels up from this file: services/ -> app/ -> backend/)
_PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent


class UpdateService:
    """Checks the remote GitHub repository for newer commits and can apply updates."""

    GITHUB_API = "https://api.github.com"
    CHECK_INTERVAL = 3600  # seconds between automatic checks

    def __init__(self):
        self._owner: str = ""
        self._repo: str = ""
        self._branch: str = "master"
        self._latest_remote: Optional[Dict[str, Any]] = None
        self._last_check: Optional[str] = None
        self._update_available: bool = False
        self._task: Optional[asyncio.Task] = None

    # ------------------------------------------------------------------
    # Initialisation (parse origin URL)
    # ------------------------------------------------------------------

    def _detect_repo_info(self) -> bool:
        """Extract owner/repo/branch from the local git config."""
        try:
            origin = subprocess.check_output(
                ["git", "remote", "get-url", "origin"],
                cwd=str(_PROJECT_ROOT),
                text=True,
                timeout=5,
            ).strip()

            # Handle both https and git@ URLs
            # https://github.com/owner/repo.git
            # git@github.com:owner/repo.git
            if "github.com" not in origin:
                logger.warning("Origin is not a GitHub URL: %s", origin)
                return False

            if origin.startswith("git@"):
                path = origin.split(":")[-1]
            else:
                path = origin.split("github.com/")[-1]
            path = path.removesuffix(".git")
            parts = path.split("/")
            if len(parts) >= 2:
                self._owner = parts[0]
                self._repo = parts[1]
            else:
                return False

            # Current branch
            self._branch = subprocess.check_output(
                ["git", "rev-parse", "--abbrev-ref", "HEAD"],
                cwd=str(_PROJECT_ROOT),
                text=True,
                timeout=5,
            ).strip()

            logger.info(
                "Update service: repo=%s/%s branch=%s",
                self._owner, self._repo, self._branch,
            )
            return True
        except Exception as exc:
            logger.warning("Could not detect git repo info: %s", exc)
            return False

    def _get_local_commit(self) -> Optional[str]:
        try:
            return subprocess.check_output(
                ["git", "rev-parse", "HEAD"],
                cwd=str(_PROJECT_ROOT),
                text=True,
                timeout=5,
            ).strip()
        except Exception:
            return None

    # ------------------------------------------------------------------
    # Check for updates
    # ------------------------------------------------------------------

    async def check_for_update(self) -> Dict[str, Any]:
        """Query GitHub API to compare local HEAD with remote branch HEAD."""
        if not self._owner:
            if not self._detect_repo_info():
                return {"update_available": False, "error": "Impossible de detecter le depot Git"}

        local_sha = self._get_local_commit()
        if not local_sha:
            return {"update_available": False, "error": "Impossible de lire le commit local"}

        url = f"{self.GITHUB_API}/repos/{self._owner}/{self._repo}/commits/{self._branch}"
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                r = await client.get(url)
            if r.status_code != 200:
                return {"update_available": False, "error": f"GitHub API: {r.status_code}"}

            data = r.json()
            remote_sha = data.get("sha", "")
            commit_info = data.get("commit", {})
            message = commit_info.get("message", "")
            author = commit_info.get("author", {}).get("name", "")
            date = commit_info.get("author", {}).get("date", "")

            self._latest_remote = {
                "sha": remote_sha,
                "message": message,
                "author": author,
                "date": date,
            }
            self._last_check = datetime.now(timezone.utc).isoformat()
            self._update_available = remote_sha != local_sha

            return {
                "update_available": self._update_available,
                "local_sha": local_sha[:8],
                "remote_sha": remote_sha[:8],
                "remote_message": message.split("\n")[0][:120],
                "remote_author": author,
                "remote_date": date,
                "last_check": self._last_check,
            }
        except Exception as exc:
            logger.warning("Update check failed: %s", exc)
            return {"update_available": False, "error": str(exc)}

    # ------------------------------------------------------------------
    # Apply update
    # ------------------------------------------------------------------

    async def apply_update(self) -> Dict[str, Any]:
        """Run git pull to apply the update, then return result."""
        try:
            result = await asyncio.to_thread(
                subprocess.run,
                ["git", "pull", "--ff-only"],
                cwd=str(_PROJECT_ROOT),
                capture_output=True,
                text=True,
                timeout=60,
            )
            success = result.returncode == 0
            output = result.stdout.strip() or result.stderr.strip()

            if success:
                self._update_available = False
                logger.info("Update applied: %s", output)

                # Install any new Python dependencies
                await self._pip_install()
                # Install any new frontend dependencies
                await self._npm_install()
            else:
                logger.error("Update failed: %s", output)

            return {
                "success": success,
                "output": output,
                "restart_required": success,
            }
        except Exception as exc:
            logger.error("Update apply error: %s", exc)
            return {"success": False, "output": str(exc), "restart_required": False}

    async def _pip_install(self):
        """Re-install Python deps if requirements.txt changed."""
        req_file = _PROJECT_ROOT / "requirements.txt"
        if not req_file.exists():
            return
        try:
            import sys
            await asyncio.to_thread(
                subprocess.run,
                [sys.executable, "-m", "pip", "install", "-r", str(req_file), "-q"],
                cwd=str(_PROJECT_ROOT),
                timeout=120,
            )
            logger.info("pip install -r requirements.txt completed")
        except Exception as exc:
            logger.warning("pip install failed: %s", exc)

    async def _npm_install(self):
        """Re-install Node deps if package.json changed."""
        pkg_file = _PROJECT_ROOT.parent / "frontend" / "package.json"
        if not pkg_file.exists():
            return
        try:
            await asyncio.to_thread(
                subprocess.run,
                ["npm", "install", "--prefix", str(pkg_file.parent)],
                cwd=str(pkg_file.parent),
                timeout=120,
            )
            logger.info("npm install completed")
        except Exception as exc:
            logger.warning("npm install failed: %s", exc)

    # ------------------------------------------------------------------
    # Background periodic check
    # ------------------------------------------------------------------

    def start_periodic_check(self):
        if self._task is not None:
            return
        self._task = asyncio.create_task(self._periodic_loop())
        logger.info("Update periodic check started (every %ds)", self.CHECK_INTERVAL)

    async def stop_periodic_check(self):
        if self._task:
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass
            self._task = None

    async def _periodic_loop(self):
        try:
            while True:
                result = await self.check_for_update()
                if result.get("update_available"):
                    logger.info(
                        "New version available: %s (%s)",
                        result.get("remote_sha"),
                        result.get("remote_message"),
                    )
                    # Broadcast to connected WebSocket clients
                    try:
                        from app.core.websocket import manager
                        await manager.broadcast({
                            "type": "update_available",
                            "remote_sha": result.get("remote_sha"),
                            "remote_message": result.get("remote_message"),
                            "remote_author": result.get("remote_author"),
                            "remote_date": result.get("remote_date"),
                        })
                    except Exception:
                        pass
                await asyncio.sleep(self.CHECK_INTERVAL)
        except asyncio.CancelledError:
            pass

    # ------------------------------------------------------------------
    # Status
    # ------------------------------------------------------------------

    def get_status(self) -> Dict[str, Any]:
        return {
            "update_available": self._update_available,
            "last_check": self._last_check,
            "latest_remote": self._latest_remote,
            "repo": f"{self._owner}/{self._repo}" if self._owner else None,
            "branch": self._branch,
        }


update_service = UpdateService()
