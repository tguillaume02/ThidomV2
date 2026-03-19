# ThiDom â€” Guide d'installation et d'exÃ©cution

> **Guides specifiques par plateforme :**
> - [Installation Windows](INSTALL_WINDOWS.md)
> - [Installation Linux](INSTALL_LINUX.md)

---

## PrÃ©requis

| Outil                  | Version minimale | VÃ©rification       |
|------------------------|------------------|---------------------|
| Python                 | 3.11+            | `python --version`  |
| Node.js                | 20+              | `node --version`    |
| npm                    | 10+              | `npm --version`     |
| Docker *(optionnel)*   | 24+              | `docker --version`  |
| MySQL *(optionnel)*    | 8.0+             | `mysql --version`   |

> **Note :** Le frontend Ã©coute sur le **port 80** (HTTP) et le **port 443** (HTTPS).
> Sous Windows, lancez votre terminal en **Administrateur** si ces ports sont restreints.

---

## 1. Backend (Python / FastAPI)

### Installation (une seule fois)

```powershell
cd backend

# CrÃ©er l'environnement virtuel
python -m venv venv

# Activer l'environnement
.\venv\Scripts\activate

# Installer les dÃ©pendances
# (les flags --trusted-host sont nÃ©cessaires derriÃ¨re un proxy d'entreprise avec certificat auto-signÃ©)
pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org --trusted-host pypi.python.org -r requirements.txt
```

### Lancement

```powershell
cd backend
.\venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

| URL                         | Description                  |
|-----------------------------|------------------------------|
| http://localhost:8000       | API REST                     |
| http://localhost:8000/docs  | Documentation Swagger (auto) |
| http://localhost:8000/redoc | Documentation ReDoc (auto)   |

---

## 2. Frontend (Angular 17)

### Installation (une seule fois)

```powershell
cd frontend
npm install
```

### Lancement en HTTP (port 80)

```powershell
cd frontend
npm start
```

| URL                | Description                |
|--------------------|----------------------------|
| http://localhost    | Application ThiDom (HTTP)  |

### Lancement en HTTPS (port 443)

Pour servir en HTTPS, gÃ©nÃ©rez d'abord un certificat auto-signÃ© puis lancez avec l'option `--ssl` :

```powershell
cd frontend

# GÃ©nÃ©rer le certificat auto-signÃ© (une seule fois)
# Option A : avec openssl
openssl req -x509 -nodes -days 3650 -newkey rsa:2048 -keyout ssl/server.key -out ssl/server.crt -subj "/CN=localhost/O=ThiDom/C=FR"

# Option B : avec PowerShell (si openssl n'est pas disponible)
$cert = New-SelfSignedCertificate -DnsName "localhost" -CertStoreLocation "Cert:\CurrentUser\My" -FriendlyName "ThiDom Dev" -NotAfter (Get-Date).AddYears(10) -KeyExportPolicy Exportable
Export-PfxCertificate -Cert $cert -FilePath "ssl\server.pfx" -Password (ConvertTo-SecureString "thidom" -Force -AsPlainText)

# Lancer en HTTPS
npx ng serve --port 443 --ssl --ssl-cert ssl/server.crt --ssl-key ssl/server.key
```

| URL                 | Description                |
|---------------------|----------------------------|
| https://localhost    | Application ThiDom (HTTPS) |

> Le proxy Angular (`proxy.conf.json`) redirige automatiquement les appels `/api/*` et `/ws/*` vers le backend sur le port 8000.

---

## 3. Alternative : Docker Compose (tout-en-un)

### PrÃ©parer les certificats SSL

```powershell
# Depuis la racine du projet â€” placer les certificats dans frontend/ssl/
cd frontend
mkdir ssl
openssl req -x509 -nodes -days 3650 -newkey rsa:2048 -keyout ssl/server.key -out ssl/server.crt -subj "/CN=localhost/O=ThiDom/C=FR"
```

### Lancer

```powershell
cd ..
docker-compose up --build
```

| Service  | URL                   | Description        |
|----------|-----------------------|--------------------|
| Frontend | https://localhost     | Application (HTTPS)|
| Frontend | http://localhost      | Redirige vers HTTPS|
| Backend  | http://localhost:8000 | API REST           |

Pour arrÃªter :

```powershell
docker-compose down
```

---

## 4. PremiÃ¨re utilisation

1. Ouvrir **https://localhost** (accepter le certificat auto-signÃ© dans le navigateur)
2. Cliquer sur **Â« CrÃ©er un compte Â»** et remplir le formulaire d'inscription
3. Se connecter avec les identifiants crÃ©Ã©s
4. Aller dans **Plugins** ? cliquer **Synchroniser** pour charger les plugins intÃ©grÃ©s (MQTT, ZigBee, Weather, Virtual)
5. CrÃ©er des **PiÃ¨ces** (Salon, Chambre, Cuisineâ€¦)
6. CrÃ©er des **Appareils** en les liant Ã  une piÃ¨ce et un plugin
7. Les appareils apparaissent sur le **Tableau de bord** avec leurs Ã©tats en temps rÃ©el

---

## 5. Build de production

### Frontend

```powershell
cd frontend
npx ng build --configuration production
```

Les fichiers compilÃ©s sont gÃ©nÃ©rÃ©s dans `frontend/dist/thidom/browser/`.

### Backend

```powershell
cd backend
.\venv\Scripts\activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

> En production, remplacez `SECRET_KEY` dans `backend/.env` par une clÃ© alÃ©atoire sÃ©curisÃ©e et changez `DATABASE_URL` pour pointer vers PostgreSQL.
> Utilisez de vrais certificats SSL (Let's Encrypt) au lieu des certificats auto-signÃ©s.

---

## 6. Structure des commandes (rÃ©sumÃ© rapide)

```powershell
# Terminal 1 â€” Backend
cd backend
.\venv\Scripts\activate
uvicorn app.main:app --reload --port 8000

# Terminal 2 â€” Frontend HTTP (port 80)
cd frontend
npm start

# OU Terminal 2 â€” Frontend HTTPS (port 443)
cd frontend
npx ng serve --port 443 --ssl --ssl-cert ssl/server.crt --ssl-key ssl/server.key
```

? Ouvrir **https://localhost** ou **http://localhost**

---

## 7. Variables d'environnement (backend/.env)

| Variable                      | Description                              | Valeur par dÃ©faut                        |
|-------------------------------|------------------------------------------|------------------------------------------|
| `DATABASE_URL`                | URL de connexion Ã  la base de donnÃ©es    | `sqlite+aiosqlite:///./thidomv2.db`        |
| `SECRET_KEY`                  | ClÃ© secrÃ¨te JWT                          | `thidom-secret-key-change-in-production` |
| `ALGORITHM`                   | Algorithme JWT                           | `HS256`                                  |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | DurÃ©e de validitÃ© du token (minutes)     | `1440` (24h)                             |
| `INFLUXDB_URL`                | URL InfluxDB (historisation)             | `http://localhost:8086`                  |
| `INFLUXDB_TOKEN`              | Token InfluxDB                           | `thidom-influx-token`                    |
| `INFLUXDB_ORG`                | Organisation InfluxDB                    | `thidom`                                 |
| `INFLUXDB_BUCKET`             | Bucket InfluxDB                          | `thidom_history`                         |
| `MQTT_BROKER`                 | Adresse du broker MQTT                   | `localhost`                              |
| `MQTT_PORT`                   | Port du broker MQTT                      | `1883`                                   |
| `TELEGRAM_BOT_TOKEN`          | Token bot Telegram                       | *(vide)*                                 |
| `TELEGRAM_CHAT_ID`            | Chat ID Telegram                         | *(vide)*                                 |
| `TIMEZONE`                    | Fuseau horaire                           | `Europe/Paris`                           |

### Exemples de DATABASE_URL

| Base       | URL                                                    | Driver a installer |
|------------|--------------------------------------------------------|--------------------|
| SQLite     | `sqlite+aiosqlite:///./thidomv2.db`                      | aiosqlite (inclus) |
| MySQL      | `mysql+aiomysql://user:pass@localhost:3306/thidom`     | `pip install aiomysql` |
| PostgreSQL | `postgresql+asyncpg://user:pass@localhost:5432/thidom` | `pip install asyncpg`  |

---

## 8. DÃ©pannage

### Erreur SSL lors de `pip install` (proxy d'entreprise)

```powershell
pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org --trusted-host pypi.python.org -r requirements.txt
```

### Port 80 ou 443 dÃ©jÃ  utilisÃ© ou accÃ¨s refusÃ©

```powershell
# VÃ©rifier quel processus utilise le port
netstat -ano | findstr :80
netstat -ano | findstr :443

# Tuer le processus (remplacer <PID>)
taskkill /PID <PID> /F

# Si accÃ¨s refusÃ© : relancer le terminal en Administrateur
```

### Port 8000 dÃ©jÃ  utilisÃ©

```powershell
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Certificat auto-signÃ© rejetÃ© par le navigateur

- Chrome : cliquer sur Â« AvancÃ© Â» ? Â« Continuer vers localhost (non sÃ©curisÃ©) Â»
- Firefox : cliquer sur Â« AvancÃ©â€¦ Â» ? Â« Accepter le risque et continuer Â»
- Edge : cliquer sur Â« AvancÃ© Â» ? Â« Continuer vers localhost (non sÃ©curisÃ©) Â»

### RÃ©initialiser la base de donnÃ©es

```powershell
cd backend
del thidomv2.db
# Relancer le backend â€” la base sera recrÃ©Ã©e automatiquement
uvicorn app.main:app --reload --port 8000

