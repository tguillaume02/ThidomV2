"""
ThiDomV2 - Initialisation idempotente de la base de donnees.

A executer une fois apres l'installation initiale :
  - cree la structure (Base.metadata.create_all) si les tables n'existent pas,
  - cree un compte admin par defaut (admin / admin) si aucun admin n'existe.

Reexecutable sans risque : ne touche rien si la base est deja peuplee.

Usage :
    python init_default_admin.py
    DEFAULT_ADMIN_USERNAME=root DEFAULT_ADMIN_PASSWORD=changeme python init_default_admin.py
"""
import asyncio
import os
import sys

# Permet d'executer le script depuis n'importe quel cwd
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import select  # noqa: E402

from app.core.database import async_session, init_db  # noqa: E402
from app.core.security import get_password_hash  # noqa: E402
from app.models.user import User  # noqa: E402


DEFAULT_USERNAME = os.environ.get("DEFAULT_ADMIN_USERNAME", "admin")
DEFAULT_PASSWORD = os.environ.get("DEFAULT_ADMIN_PASSWORD", "admin")
DEFAULT_EMAIL = os.environ.get("DEFAULT_ADMIN_EMAIL", "admin@thidom.local")
DEFAULT_FULLNAME = os.environ.get("DEFAULT_ADMIN_FULLNAME", "Administrateur")


async def main() -> None:
    print("[init] Creation de la structure de la base (si necessaire)...")
    await init_db()

    async with async_session() as db:
        # Y a-t-il deja un admin ?
        result = await db.execute(select(User).where(User.is_admin.is_(True)))
        existing = result.scalars().first()
        if existing:
            print(f"[init] Admin deja present (username='{existing.username}'). Rien a faire.")
            return

        admin = User(
            username=DEFAULT_USERNAME,
            email=DEFAULT_EMAIL,
            hashed_password=get_password_hash(DEFAULT_PASSWORD),
            full_name=DEFAULT_FULLNAME,
            is_admin=True,
        )
        db.add(admin)
        await db.commit()
        print(f"[init] Compte admin cree : {DEFAULT_USERNAME} / {DEFAULT_PASSWORD}")
        print("[init] >>> WARNING : changez ce mot de passe des la premiere connexion. <<<")


if __name__ == "__main__":
    asyncio.run(main())
