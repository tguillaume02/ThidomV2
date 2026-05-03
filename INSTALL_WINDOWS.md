# ThiDom  --  Installation sur Windows

---

## Prerequis

| Outil       | Version | Verification          | Telechargement                                     |
|-------------|---------|-----------------------|-----------------------------------------------------|
| Python      | 3.11+   | `python --version`    | https://www.python.org/downloads/                   |
| Node.js     | 20+     | `node --version`      | https://nodejs.org/                                 |
| npm         | 10+     | `npm --version`       | Inclus avec Node.js                                 |
| Git         | 2.40+   | `git --version`       | https://git-scm.com/download/win                    |
| MySQL *(optionnel)* | 8.0+ | `mysql --version` | https://dev.mysql.com/downloads/installer/           |

> **Note :** Lancez PowerShell en **Administrateur** si les ports 80/443 sont restreints.

---

## 1. Cloner le projet

```powershell
git clone <url-du-depot> thidom
cd thidom
```

---

## 2. Backend (Python / FastAPI)

### Installation

```powershell
cd backend

# Creer l'environnement virtuel
python -m venv venv

# Activer l'environnement
.\venv\Scripts\activate

# Installer les dependances
pip install -r requirements.txt

# Si vous etes derriere un proxy d'entreprise avec certificat auto-signe :
pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org --trusted-host pypi.python.org -r requirements.txt
```

### Configuration de la base de donnees

Editez `backend/.env` :

**SQLite (par defaut, aucune installation necessaire) :**
```
DATABASE_URL=sqlite+aiosqlite:///./thidom.db
```

**MySQL :**
```powershell
# Installer le driver MySQL
pip install aiomysql
```
```
DATABASE_URL=mysql+aiomysql://thidom:motdepasse@localhost:3306/thidom
```

Puis creer la base dans MySQL :
```sql
CREATE DATABASE thidomv2 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'thidom'@'localhost' IDENTIFIED BY 'motdepasse';
GRANT ALL PRIVILEGES ON thidom.* TO 'thidom'@'localhost';
FLUSH PRIVILEGES;
```

### Lancement

```powershell
cd backend
.\venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

| URL                        | Description         |
|----------------------------|---------------------|
| http://localhost:8000      | API REST            |
| http://localhost:8000/docs | Swagger (auto)      |

---

## 3. Frontend (Angular)

### Installation

```powershell
cd frontend
npm install
```

### Lancement (HTTP, port 80)

```powershell
npm start
```

| URL              | Description        |
|------------------|--------------------|
| http://localhost  | Application ThiDom |

### Lancement (HTTPS, port 443)

```powershell
# Generer un certificat auto-signe (une seule fois)
mkdir ssl
openssl req -x509 -nodes -days 3650 -newkey rsa:2048 -keyout ssl/server.key -out ssl/server.crt -subj "/CN=localhost/O=ThiDom/C=FR"

# Ou avec PowerShell si openssl n'est pas disponible :
$cert = New-SelfSignedCertificate -DnsName "localhost" -CertStoreLocation "Cert:\CurrentUser\My" -FriendlyName "ThiDom Dev" -NotAfter (Get-Date).AddYears(10) -KeyExportPolicy Exportable

# Lancer en HTTPS
npx ng serve --port 443 --ssl --ssl-cert ssl/server.crt --ssl-key ssl/server.key
```

---

## 4. Docker Compose (tout-en-un)

```powershell
# Certificats SSL
cd frontend
mkdir ssl
openssl req -x509 -nodes -days 3650 -newkey rsa:2048 -keyout ssl/server.key -out ssl/server.crt -subj "/CN=localhost/O=ThiDom/C=FR"
cd ..

# Lancer
docker-compose up --build
```

| Service  | URL                    |
|----------|------------------------|
| Frontend | https://localhost      |
| Backend  | http://localhost:8000  |

Arreter : `docker-compose down`

---

## 5. Premiere utilisation

1. Ouvrir **http://localhost** (ou **https://localhost**)
2. Creer un compte et se connecter
3. Aller dans **Plugins** > **Synchroniser**
4. Creer des **Pieces** puis des **Appareils**
5. Les appareils apparaissent sur le **Tableau de bord** en temps reel

---

## 6. Variables d'environnement (backend/.env)

| Variable                      | Description                          | Defaut                                   |
|-------------------------------|--------------------------------------|------------------------------------------|
| `DATABASE_URL`                | URL de connexion BDD                 | `sqlite+aiosqlite:///./thidom.db`        |
| `SECRET_KEY`                  | Cle secrete JWT                      | `thidom-secret-key-change-in-production` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Duree token (minutes)                | `1440`                                   |
| `INFLUXDB_URL`                | URL InfluxDB                         | `http://localhost:8086`                  |
| `INFLUXDB_TOKEN`              | Token InfluxDB                       | `thidom-influx-token`                    |
| `INFLUXDB_ORG`                | Organisation InfluxDB                | `thidom`                                 |
| `INFLUXDB_BUCKET`             | Bucket InfluxDB                      | `thidom_history`                         |
| `MQTT_BROKER`                 | Broker MQTT                          | `localhost`                              |
| `MQTT_PORT`                   | Port MQTT                            | `1883`                                   |
| `TELEGRAM_BOT_TOKEN`          | Token bot Telegram                   | *(vide)*                                 |
| `TELEGRAM_CHAT_ID`            | Chat ID Telegram                     | *(vide)*                                 |
| `TIMEZONE`                    | Fuseau horaire                       | `Europe/Paris`                           |

---

## 7. Depannage

### Port deja utilise
```powershell
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Certificat SSL refuse par le navigateur
Cliquer sur **Avance** > **Continuer vers localhost (non securise)**

### Reinitialiser la base SQLite
```powershell
cd backend
del thidom.db
# Relancer le backend
```

### Erreur SSL lors de pip install (proxy entreprise)
```powershell
pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org -r requirements.txt
```

