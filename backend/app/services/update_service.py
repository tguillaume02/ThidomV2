"""
Application update service.

Strategy
--------
- Versioning : the deployment scripts (update.sh / update-no-docker.sh /
  update.ps1 / update-no-docker.ps1) write the file ``backend/VERSION`` after
  every successful deployment. It contains key=value lines, e.g. ::

      tag=latest-master
      sha=8d3f1c2
      built=2026-04-15T12:34:56Z
      mode=no-docker

- Check    : the service queries the GitHub Releases API. It first tries the
             stable ``/releases/latest`` endpoint, then falls back to the
             rolling ``/releases/tags/latest-master`` prerelease so the user is
             always notified of the freshest build available.
- Apply    : runs the appropriate update script in the background using
             ``nohup``. The script is expected to pull the latest release,
             redeploy and restart the backend service itself; this endpoint
             therefore returns immediately with ``restart_required=true``.
"""
import asyncio
import logging
import os
import shlex
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Optional

import httpx

logger = logging.getLogger(__name__)

# .../backend/app/services/update_service.py -> .../
_BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
_PROJECT_ROOT = _BACKEND_DIR.parent
_VERSION_FILE = _BACKEND_DIR / "VERSION"

DEFAULT_REPO = os.environ.get("THIDOM_GH_REPO", "tguillaume02/ThidomV2")


class UpdateService:
    GITHUB_API = "https://api.github.com"
    CHECK_INTERVAL = 3600  # seconds

    def __init__(self) -> None:
        self._repo: str = DEFAULT_REPO
        self._latest_remote: Optional[Dict[str, Any]] = None
        self._last_check: Optional[str] = None
        self._update_available: bool = False
        self._task: Optional[asyncio.Task] = None

    # ------------------------------------------------------------------
    # Local version
    # ------------------------------------------------------------------

    def _read_local_version(self) -> Dict[str, str]:
        """Read backend/VERSION (key=value lines). Returns {} if absent."""
        info: Dict[str, str] = {}
        if _VERSION_FILE.exists():
            try:
                for line in _VERSION_FILE.read_text(encoding="utf-8").splitlines():
                    line = line.strip()
                    if not line or line.startswith("#") or "=" not in line:
                        continue
                    k, v = line.split("=", 1)
                    info[k.strip()] = v.strip()
            except Exception as exc:
                logger.warning("Could not read VERSION file: %s", exc)
        return info

    def _detect_mode(self) -> str:
        """Detect deployment mode: 'docker' or 'no-docker'."""
        env_mode = os.environ.get("THIDOM_DEPLOY_MODE", "").lower()
        if env_mode in ("docker", "no-docker"):
            return env_mode
        local = self._read_local_version()
        if local.get("mode") in ("docker", "no-docker"):
            return local["mode"]
        # Fallback heuristic: a docker-compose file *and* a /.dockerenv marker
        if Path("/.dockerenv").exists():
            return "docker"
        return "no-docker"

    # ------------------------------------------------------------------
    # Remote release lookup
    # ------------------------------------------------------------------

    async def _fetch_release(self, client: httpx.AsyncClient, path: str) -> Optional[Dict[str, Any]]:
        try:
            r = await client.get(f"{self.GITHUB_API}/repos/{self._repo}/{path}")
        except Exception as exc:
            logger.warning("Release lookup %s failed: %s", path, exc)
            return None
        if r.status_code == 200:
            return r.json()
        return None

    async def check_for_update(self) -> Dict[str, Any]:
        """Compare backend/VERSION with the latest GitHub Release.

        Returns a payload compatible with the existing `update-banner` component:
        ``update_available``, ``remote_sha``, ``remote_message``,
        ``remote_author``, ``remote_date``, ``last_check``.
        """
        local = self._read_local_version()
        local_tag = local.get("tag", "")
        local_sha = local.get("sha", "")

        async with httpx.AsyncClient(timeout=10.0) as client:
            release = await self._fetch_release(client, "releases/latest")
            if release is None:
                # No stable release yet -> try the rolling prerelease
                release = await self._fetch_release(client, "releases/tags/latest-master")

        if release is None:
            return {"update_available": False, "error": "Aucune release disponible sur GitHub."}

        remote_tag = release.get("tag_name", "")
        remote_name = release.get("name") or remote_tag
        remote_date = release.get("published_at") or release.get("created_at") or ""
        remote_author = (release.get("author") or {}).get("login", "")
        body = (release.get("body") or "").strip()
        # Try to extract sha from the body ("Build automatique depuis ... (1234567)")
        remote_sha = ""
        if "(" in body and ")" in body:
            try:
                remote_sha = body.rsplit("(", 1)[1].split(")", 1)[0]
            except Exception:
                pass

        # An update is "available" when:
        # 1. The remote tag differs from the local one (new stable release), OR
        # 2. Same tag but different SHA (rolling release with new commit), OR
        # 3. Local version is unknown (fresh install).
        if not remote_tag:
            self._update_available = False
        elif not local_tag:
            # Fresh install, never updated — always offer the remote version
            self._update_available = True
        elif remote_tag != local_tag:
            # Different tag (e.g. v1.0 -> v1.1)
            self._update_available = True
        elif remote_sha and local_sha:
            # Same tag (rolling release) — compare commit SHAs
            self._update_available = remote_sha != local_sha
        else:
            self._update_available = False

        self._latest_remote = {
            "tag": remote_tag,
            "name": remote_name,
            "sha": remote_sha,
            "date": remote_date,
            "author": remote_author,
        }
        self._last_check = datetime.now(timezone.utc).isoformat()

        return {
            "update_available": self._update_available,
            "local_tag": local_tag,
            "local_sha": local_sha,
            "remote_sha": remote_sha or remote_tag,
            "remote_message": remote_name,
            "remote_author": remote_author,
            "remote_date": remote_date,
            "last_check": self._last_check,
        }

    # ------------------------------------------------------------------
    # Apply update
    # ------------------------------------------------------------------

    def _resolve_script(self) -> Optional[Path]:
        mode = self._detect_mode()
        candidates = []
        if mode == "docker":
            candidates = ["update.sh", "update.ps1"]
        else:
            candidates = ["update-no-docker.sh", "update-no-docker.ps1"]

        roots = [
            Path(os.environ.get("THIDOM_INSTALL_DIR", "")) if os.environ.get("THIDOM_INSTALL_DIR") else None,
            _PROJECT_ROOT,                       # development repo layout
            Path("/opt/thidom"),                # standard Linux install dir
        ]
        for root in roots:
            if root is None:
                continue
            for name in candidates:
                p = root / name
                if p.exists():
                    return p
        return None

    async def apply_update(self) -> Dict[str, Any]:
        """Trigger the deployment script in the background and return immediately."""
        script = self._resolve_script()
        if script is None:
            return {
                "success": False,
                "output": "Aucun script de mise a jour trouve (update.sh / update-no-docker.sh).",
                "restart_required": False,
            }

        try:
            log_path = _BACKEND_DIR / "update.log"
            status_path = _BACKEND_DIR / "update.status"
            # Clear previous log and set status to 'running'
            # Try direct write first, fall back to sudo if permission denied
            for fpath, content in [(log_path, ""), (status_path, "running")]:
                try:
                    fpath.write_text(content, encoding="utf-8")
                except PermissionError:
                    await asyncio.to_thread(
                        subprocess.run,
                        ["sudo", "-n", "chown",
                         f"{os.getuid()}:{os.getgid()}", str(fpath)],
                        check=False,
                    )
                    try:
                        fpath.write_text(content, encoding="utf-8")
                    except Exception:
                        pass

            if script.suffix == ".ps1":
                cmd = ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", str(script)]
            else:
                # Launch the update script directly via sudo with output
                # redirected to the log file. nohup + start_new_session
                # ensure the script survives the backend restart it triggers.
                cmd = [
                    "sudo", "-n", str(script),
                ]

            log_fd = open(str(log_path), "a")
            await asyncio.to_thread(
                subprocess.Popen,
                cmd,
                cwd=str(script.parent),
                stdout=log_fd,
                stderr=log_fd,
                start_new_session=True,
            )
            logger.info("Update script launched: %s (logs: %s)", script, log_path)
            return {
                "success": True,
                "output": f"Script lance en arriere-plan ({script.name}). Voir {log_path}.",
                "restart_required": True,
            }
        except Exception as exc:
            logger.error("Failed to launch update script: %s", exc)
            return {"success": False, "output": str(exc), "restart_required": False}

    # ------------------------------------------------------------------
    # Status
    # ------------------------------------------------------------------

    def get_status(self) -> Dict[str, Any]:
        local = self._read_local_version()
        return {
            "update_available": self._update_available,
            "last_check": self._last_check,
            "latest_remote": self._latest_remote,
            "local": local,
            "repo": self._repo,
            "mode": self._detect_mode(),
        }

    def get_version(self) -> Dict[str, Any]:
        local = self._read_local_version()
        return {
            "tag": local.get("tag", "unknown"),
            "sha": local.get("sha", ""),
            "built": local.get("built", ""),
            "mode": self._detect_mode(),
        }

    # ------------------------------------------------------------------
    # Periodic background check
    # ------------------------------------------------------------------

    def start_periodic_check(self) -> None:
        if self._task is not None:
            return
        self._task = asyncio.create_task(self._periodic_loop())
        logger.info("Update periodic check started (every %ds)", self.CHECK_INTERVAL)

    async def stop_periodic_check(self) -> None:
        if self._task:
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass
            self._task = None

    async def _periodic_loop(self) -> None:
        try:
            while True:
                result = await self.check_for_update()
                if result.get("update_available"):
                    logger.info(
                        "New version available: %s",
                        result.get("remote_message"),
                    )
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


update_service = UpdateService()

