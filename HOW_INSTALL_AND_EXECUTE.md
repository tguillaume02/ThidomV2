# ThiDom — Guide d'installation et d'exécution

---

## Prérequis

| Outil                  | Version minimale | Vérification       |
|------------------------|------------------|---------------------|
| Python                 | 3.11+            | `python --version`  |
| Node.js                | 20+              | `node --version`    |
| npm                    | 10+              | `npm --version`     |
| Docker *(optionnel)*   | 24+              | `docker --version`  |

> **Note :** Le frontend écoute sur le **port 80** (HTTP) et le **port 443** (HTTPS).
> Sous Windows, lancez votre terminal en **Administrateur** si ces ports sont restreints.

---

## 1. Backend (Python / FastAPI)

### Installation (une seule fois)

```powershell
cd backend

# Créer l'environnement virtuel
python -m venv venv

# Activer l'environnement
.\venv\Scripts\activate

# Installer les dépendances
# (les flags --trusted-host sont nécessaires derrière un proxy d'entreprise avec certificat auto-signé)
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

Pour servir en HTTPS, générez d'abord un certificat auto-signé puis lancez avec l'option `--ssl` :

```powershell
cd frontend

# Générer le certificat auto-signé (une seule fois)
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

### Préparer les certificats SSL

```powershell
# Depuis la racine du projet — placer les certificats dans frontend/ssl/
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

Pour arrêter :

```powershell
docker-compose down
```

---

## 4. Première utilisation

1. Ouvrir **https://localhost** (accepter le certificat auto-signé dans le navigateur)
2. Cliquer sur **« Créer un compte »** et remplir le formulaire d'inscription
3. Se connecter avec les identifiants créés
4. Aller dans **Plugins** ? cliquer **Synchroniser** pour charger les plugins intégrés (MQTT, ZigBee, Weather, Virtual)
5. Créer des **Pièces** (Salon, Chambre, Cuisine…)
6. Créer des **Appareils** en les liant à une pièce et un plugin
7. Les appareils apparaissent sur le **Tableau de bord** avec leurs états en temps réel

---

## 5. Build de production

### Frontend

```powershell
cd frontend
npx ng build --configuration production
```

Les fichiers compilés sont générés dans `frontend/dist/thidom/browser/`.

### Backend

```powershell
cd backend
.\venv\Scripts\activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

> En production, remplacez `SECRET_KEY` dans `backend/.env` par une clé aléatoire sécurisée et changez `DATABASE_URL` pour pointer vers PostgreSQL.
> Utilisez de vrais certificats SSL (Let's Encrypt) au lieu des certificats auto-signés.

---

## 6. Structure des commandes (résumé rapide)

```powershell
# Terminal 1 — Backend
cd backend
.\venv\Scripts\activate
uvicorn app.main:app --reload --port 8000

# Terminal 2 — Frontend HTTP (port 80)
cd frontend
npm start

# OU Terminal 2 — Frontend HTTPS (port 443)
cd frontend
npx ng serve --port 443 --ssl --ssl-cert ssl/server.crt --ssl-key ssl/server.key
```

? Ouvrir **https://localhost** ou **http://localhost**

---

## 7. Variables d'environnement (backend/.env)

| Variable                      | Description                              | Valeur par défaut                        |
|-------------------------------|------------------------------------------|------------------------------------------|
| `DATABASE_URL`                | URL de connexion à la base de données    | `sqlite+aiosqlite:///./thidom.db`        |
| `SECRET_KEY`                  | Clé secrète JWT                          | `thidom-secret-key-change-in-production` |
| `ALGORITHM`                   | Algorithme JWT                           | `HS256`                                  |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Durée de validité du token (minutes)     | `1440` (24h)                             |
| `INFLUXDB_URL`                | URL InfluxDB (historisation)             | `http://localhost:8086`                  |
| `INFLUXDB_TOKEN`              | Token InfluxDB                           | `thidom-influx-token`                    |
| `INFLUXDB_ORG`                | Organisation InfluxDB                    | `thidom`                                 |
| `INFLUXDB_BUCKET`             | Bucket InfluxDB                          | `thidom_history`                         |
| `MQTT_BROKER`                 | Adresse du broker MQTT                   | `localhost`                              |
| `MQTT_PORT`                   | Port du broker MQTT                      | `1883`                                   |
| `TIMEZONE`                    | Fuseau horaire                           | `Europe/Paris`                           |

---

## 8. Dépannage

### Erreur SSL lors de `pip install` (proxy d'entreprise)

```powershell
pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org --trusted-host pypi.python.org -r requirements.txt
```

### Port 80 ou 443 déjà utilisé ou accès refusé

```powershell
# Vérifier quel processus utilise le port
netstat -ano | findstr :80
netstat -ano | findstr :443

# Tuer le processus (remplacer <PID>)
taskkill /PID <PID> /F

# Si accès refusé : relancer le terminal en Administrateur
```

### Port 8000 déjà utilisé

```powershell
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Certificat auto-signé rejeté par le navigateur

- Chrome : cliquer sur « Avancé » ? « Continuer vers localhost (non sécurisé) »
- Firefox : cliquer sur « Avancé… » ? « Accepter le risque et continuer »
- Edge : cliquer sur « Avancé » ? « Continuer vers localhost (non sécurisé) »

### Réinitialiser la base de données

```powershell
cd backend
del thidom.db
# Relancer le backend — la base sera recréée automatiquement
uvicorn app.main:app --reload --port 8000
