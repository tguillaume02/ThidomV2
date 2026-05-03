# ThiDomV2  --  Installation sur Linux (Ubuntu/Debian)

---

## Prerequis

```bash
# Python 3.11+
sudo apt update
sudo apt install -y python3 python3-venv python3-pip

# Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Git
sudo apt install -y git

# Apache2 + modules (production)
sudo apt install -y apache2 openssl
sudo a2enmod rewrite proxy proxy_http proxy_wstunnel ssl headers

# MySQL (optionnel)
sudo apt install -y mysql-server
```

Verifier :
```bash
python3 --version    # 3.11+
node --version       # 20+
npm --version        # 10+
```

---

## 1. Cloner le projet

```bash
# Cloner dans le home ou /opt (PAS dans /var/www/)
cd ~
git clone <url-du-depot> ThiDomV2
cd ThiDomV2
```

> **Important :** Le code source doit etre dans un dossier utilisateur (`~/ThiDomV2` ou `/opt/ThiDomV2`).
> Le dossier `/var/www/ThiDom/browser/` ne contient que le **build de production** copie par Apache.

---

## 2. Backend (Python / FastAPI)

### Installation

```bash
cd backend

# Creer l'environnement virtuel
python3 -m venv venv

# Activer l'environnement
source venv/bin/activate

# Installer les dependances
pip install -r requirements.txt
```

### Configuration de la base de donnees

Editer `backend/.env` :

**SQLite (par defaut) :**
```
DATABASE_URL=sqlite+aiosqlite:///./thidomv2.db
```

**MySQL :**
```bash
pip install aiomysql
```
```
DATABASE_URL=mysql+aiomysql://thidomv2_user:motdepasse@localhost:3306/thidom
```

Creer la base dans MySQL :
```bash
sudo mysql -u root -p
```
```sql
CREATE DATABASE thidomv2 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'thidomv2_user'@'localhost' IDENTIFIED BY 'motdepasse';
GRANT ALL PRIVILEGES ON thidomv2.* TO 'thidomv2_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**PostgreSQL :**
```bash
pip install asyncpg
```
```
DATABASE_URL=postgresql+asyncpg://thidomv2_user:motdepasse@localhost:5432/thidom
```

### Lancement

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

| URL                        | Description    |
|----------------------------|----------------|
| http://localhost:8000      | API REST       |
| http://localhost:8000/docs | Swagger (auto) |

### Service systemd (optionnel)

```bash
sudo tee /etc/systemd/system/ThiDomV2-backend.service << 'EOF'
[Unit]
Description=ThiDomV2 Backend
After=network.target mysql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/ThiDomV2/backend
Environment=PATH=/opt/ThiDomV2/backend/venv/bin
ExecStart=/opt/ThiDomV2/backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
Restart=always

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl enable ThiDomV2-backend
sudo systemctl start ThiDomV2-backend
```

---

## 3. Frontend (Angular)

### Installation

```bash
cd frontend
npm install
```

### Lancement (developpement)

```bash
npm start
```

### Build de production

```bash
npx ng build --configuration production
```

Les fichiers sont generes dans `frontend/dist/thidom/browser/`.

### Apache (production)

```bash
# Installer Apache et les modules necessaires
sudo apt install -y apache2
sudo a2enmod rewrite proxy proxy_http proxy_wstunnel ssl headers

# Installer Certbot (Let's Encrypt)
sudo apt install -y certbot python3-certbot-apache

# Obtenir le certificat SSL (remplacer VOTRE_DOMAINE)
sudo certbot certonly --apache -d VOTRE_DOMAINE

# Copier les fichiers du build Angular
sudo mkdir -p /var/www/ThiDom/browser
sudo cp -r dist/thidom/browser/* /var/www/ThiDom/browser/
sudo chown -R www-data:www-data /var/www/ThiDom

# Copier la config Apache (s'ajoute au site existant, ne cree pas de VirtualHost)
sudo cp apache.conf /etc/apache2/conf-available/ThiDomV2.conf
sudo a2enconf ThiDomV2
sudo apachectl configtest && sudo systemctl reload apache2
```

> ThiDomV2 s'integre au VirtualHost existant via un Alias `/ThiDom`.
> Les autres applications sur le port 80/443 ne sont pas affectees.

---

## 4. Docker Compose (tout-en-un)

```bash
# Certificats SSL
cd frontend
mkdir -p ssl
openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
  -keyout ssl/server.key -out ssl/server.crt \
  -subj "/CN=localhost/O=ThiDom/C=FR"
cd ..

# Lancer
docker-compose up --build -d
```

| Service  | URL                   |
|----------|-----------------------|
| Frontend | https://localhost     |
| Backend  | http://localhost:8000 |

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
| `DATABASE_URL`                | URL de connexion BDD                 | `sqlite+aiosqlite:///./thidomv2.db`        |
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
```bash
sudo lsof -i :8000
sudo kill -9 <PID>
```

### Permissions pour ports 80/443
```bash
# Apache gere les ports 80/443 nativement via systemd
sudo systemctl restart apache2
```

### Reinitialiser la base SQLite
```bash
cd backend
rm thidomv2.db
# Relancer le backend
```

### MySQL : erreur de connexion
```bash
sudo systemctl status mysql
sudo mysql -u thidomv2_user -p -e "SELECT 1"
```

