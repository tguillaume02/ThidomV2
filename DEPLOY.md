# Déploiement en production — ThiDomV2

À chaque `git push` sur la branche `master`, GitHub Actions **build automatiquement** les images Docker (backend + frontend) et les publie sur **GitHub Container Registry** (`ghcr.io`).

L'utilisateur final n'a **jamais besoin de compiler** la solution lui-même : il lance simplement un script de mise à jour qui télécharge les images pré-construites et redémarre les conteneurs.

---

## 0. Première installation — bootstrap automatique

Sur une machine vierge (Linux ou Windows), un seul script installe **tout ce qui manque** : Python, Apache, Docker (si demandé) et **MariaDB** (avec création de la base, de l'utilisateur, et import du schéma initial).

### Linux

```bash
git clone https://github.com/tguillaume02/ThidomV2.git
cd ThidomV2
chmod +x install.sh
sudo ./install.sh                    # mode no-docker + MariaDB (par défaut)
# ou
sudo ./install.sh --mode docker      # mode Docker + MariaDB
sudo ./install.sh --db sqlite        # garde SQLite (aucun SGBD à installer)
```

Le script :
1. détecte la distribution (`apt`, `dnf`, `yum`, `pacman`, `apk`),
2. installe Python, Apache (+ modules), curl/unzip/jq/rsync/openssl,
3. installe et démarre **MariaDB** si absent,
4. **si MariaDB vient d'être installé**, demande aussi le mot de passe à donner au compte `root` de MariaDB (sinon, le `root` existant n'est pas modifié),
5. **demande interactivement** le mot de passe à attribuer à l'utilisateur applicatif `thidom`,
6. crée la base `thidomv2`, l'utilisateur `thidom`, et importe `backend/thidomv2_mysql_dump.sql` si la base est vide,
7. écrit `backend/.env` avec la bonne `DATABASE_URL` (`mysql+aiomysql://thidom:...@localhost/thidomv2`) et un `SECRET_KEY` aléatoire,
8. enchaîne sur `update.sh` (Docker) ou `update-no-docker.sh` (classique).

Mode non-interactif (CI / Ansible) :
```bash
sudo DB_PASSWORD='S3cret!' DB_ROOT_PASSWORD='R00tP@ss' ./install.sh --noninteractive
```
> `DB_ROOT_PASSWORD` n'est requis que si MariaDB n'était pas déjà installé.

### Windows (PowerShell **Administrateur**)

```powershell
git clone https://github.com/tguillaume02/ThidomV2.git
cd ThidomV2
.\install.ps1                        # MariaDB + mode no-docker
.\install.ps1 -Mode docker
.\install.ps1 -Db sqlite
.\install.ps1 -NonInteractive -DbPassword "S3cret!" -DbRootPassword "R00tP@ss"
```

Le script utilise `winget` pour installer Python, Git, MariaDB Server, et Docker Desktop si nécessaire.

> Les scripts `install.*` sont **idempotents** : s'ils trouvent un composant déjà installé, ils l'ignorent. Vous pouvez les relancer sans crainte.

---

## 1. Côté développeur — Configuration unique

### 1.1. Activer GitHub Actions
Le workflow est déjà présent : `.github/workflows/docker-publish.yml`. Il s'exécute automatiquement à chaque push sur `master`/`main` ou tag `v*.*.*`.

### 1.2. Rendre les paquets publics (recommandé)
Au premier build, les images apparaissent dans l'onglet **Packages** du dépôt GitHub. Pour qu'elles soient téléchargeables sans authentification :

1. GitHub → onglet **Packages** du dépôt → cliquer sur `thidomv2-backend`
2. **Package settings** → **Change visibility** → **Public**
3. Répéter pour `thidomv2-frontend`

> Si vous préférez les laisser privées, l'utilisateur devra exécuter une seule fois :
> ```bash
> echo <PERSONAL_ACCESS_TOKEN> | docker login ghcr.io -u <github_user> --password-stdin
> ```

### 1.3. Workflow de release
- **Push sur `master`** → tag `latest` mis à jour automatiquement.
- **Tag `v1.2.3`** (`git tag v1.2.3 && git push --tags`) → publie aussi `1.2.3` et `1.2`.

---

## 2. Côté utilisateur final — Mise à jour en 1 commande

### Pré-requis (une seule fois)
- Docker + Docker Compose v2 installés
- Cloner le dépôt (uniquement pour récupérer `docker-compose.prod.yml` + `update.sh`)
  ```bash
  git clone https://github.com/tguillaume02/ThidomV2.git
  cd ThidomV2
  ```

### Premier démarrage
```bash
chmod +x update.sh
./update.sh
```

### Mises à jour suivantes
```bash
cd ThidomV2
git pull          # facultatif : récupère les éventuelles évolutions du compose
./update.sh       # télécharge les dernières images et redémarre
```

Sur Windows :
```powershell
.\update.ps1
```

### Déployer une version précise
```bash
./update.sh v1.2.3
```

---

## 3. Comment ça fonctionne

```
 Développeur                 GitHub                         Serveur de l'utilisateur
 ───────────                 ──────                         ────────────────────────
 git push master  ───▶  GitHub Actions
                        ├── docker build backend
                        ├── docker build frontend
                        └── docker push ghcr.io/<owner>/thidomv2-*

                                                ./update.sh
                                                ├── docker compose pull   ◀── ghcr.io
                                                └── docker compose up -d
```

Fichiers clés :
- `.github/workflows/docker-publish.yml` — build & push des images
- `docker-compose.prod.yml` — utilise les images `ghcr.io/...` (aucun build local)
- `update.sh` / `update.ps1` — script de déploiement utilisateur

---

## 4. Variables disponibles

| Variable | Défaut | Description |
|---|---|---|
| `GHCR_OWNER` | `tguillaume02` | Propriétaire du dépôt GitHub |
| `IMAGE_TAG`  | `latest`       | Tag d'image à déployer (`latest`, `master`, `v1.2.3`, `sha-abcdef0`) |

Exemple :
```bash
GHCR_OWNER=tguillaume02 IMAGE_TAG=v1.2.3 ./update.sh
```

---

## 5. Alternative — Déploiement **sans Docker**

Si le serveur ne peut/ne doit pas exécuter Docker, un second workflow GitHub Actions (`.github/workflows/release-artifacts.yml`) fait **le build du frontend Angular dans le cloud** et publie une **GitHub Release** contenant :

- `thidomv2-release.zip` — frontend déjà compilé + sources backend + `apache.conf` + `requirements.txt`
- `frontend-dist.zip` — frontend seul
- `backend.zip` — backend seul

L'utilisateur déploie via `update-no-docker.sh` (Linux) ou `update-no-docker.ps1` (Windows). **Aucun build local** n'est requis : ni Node, ni `npm`, ni Docker.

### 5.1. Déclencheurs

| Évènement | Tag de la release | Stable ? |
|---|---|---|
| `git push origin master` | `latest-master` (rolling, recréée à chaque push) | non (prerelease) |
| `git push --tags` (`vX.Y.Z`) | `vX.Y.Z` | oui |

### 5.2. Pré-requis sur la machine de production

**Linux**
- `python3` ≥ 3.11 + `python3-venv`
- `apache2` avec `mod_proxy`, `mod_proxy_http`, `mod_proxy_wstunnel`, `mod_ssl`, `mod_rewrite`
- `curl`, `unzip`, `jq`
- un service `systemd` pour le backend (voir 5.4)

**Windows**
- Python 3.11+ dans le `PATH`
- Apache pour Windows (ou IIS) avec config équivalente à `frontend/apache.conf`
- Optionnel : [NSSM](https://nssm.cc/) pour faire d'`uvicorn` un service Windows

### 5.3. Mise à jour en 1 commande

Linux :
```bash
chmod +x update-no-docker.sh

# derniere version stable (tag v*)
./update-no-docker.sh

# derniere build de master (rolling)
./update-no-docker.sh latest-master

# version precise
./update-no-docker.sh v1.2.3
```

Windows :
```powershell
.\update-no-docker.ps1
.\update-no-docker.ps1 -Tag latest-master
.\update-no-docker.ps1 -Tag v1.2.3
```

Variables d'environnement reconnues :

| Variable | Défaut Linux | Défaut Windows | Description |
|---|---|---|---|
| `GH_REPO` | `tguillaume02/ThidomV2` | idem | Dépôt source |
| `INSTALL_DIR` | `/opt/thidomv2` | `C:\ThiDomV2` | Racine de l'install backend |
| `WEB_DIR` | `/var/www/ThiDom/browser` | `C:\ThiDom\www\browser` | Dossier servi par Apache |
| `SERVICE_NAME` | `thidomv2-backend` | `ThiDomV2Backend` | Service backend à redémarrer |
| `APACHE_SVC` | `apache2` | `Apache2.4` | Service Apache à recharger |
| `GH_TOKEN` | — | — | Token GitHub si dépôt **privé** |

Le script préserve automatiquement la base de données (`*.db`), le fichier `.env` et le `venv` existants.

### 5.4. Service systemd backend (Linux, à créer une seule fois)

`/etc/systemd/system/thidomv2-backend.service` :

```ini
[Unit]
Description=ThiDomV2 backend (FastAPI/uvicorn)
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/thidomv2/backend
Environment="PATH=/opt/thidomv2/backend/venv/bin"
EnvironmentFile=-/opt/thidomv2/backend/.env
ExecStart=/opt/thidomv2/backend/venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now thidomv2-backend
```

### 5.5. Récapitulatif des deux modes

|   | Docker (§ 1-4) | Sans Docker (§ 5) |
|---|---|---|
| Build côté GitHub | Images `ghcr.io/...` | Release ZIP + frontend pré-build |
| Pré-requis serveur | Docker + Compose | Python, Apache, curl, unzip, jq |
| Commande update | `./update.sh` | `./update-no-docker.sh` |
| Isolation | Conteneurs | Service systemd + venv |

