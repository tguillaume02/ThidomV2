#  ThiDom  --  Application de Gestion Domotique

<p align="center">
  <strong>ThiDom</strong> est une application Web complète de gestion domotique avec une interface moderne, intuitive et responsive.
</p>

---

##  Architecture Globale

```
+-----------------------------------------------------+
|                   Frontend (Angular 17)              |
|  +----------+ +----------+ +----------+ +--------+  |
|  |Dashboard | | Devices  | |Scenarios | |  Logs  |  |
|  | (rooms)  | | (CRUD)   | |(Blockly) | |(filter)|  |
|  +----------+ +----------+ +----------+ +--------+  |
|  +----------+ +----------+ +----------+              |
|  |  Rooms   | | Plugins  | | History  |              |
|  |  (tree)  | | (config) | | (charts) |              |
|  +----------+ +----------+ +----------+              |
|              Angular Material + SCSS                 |
|              WebSocket (temps reel)                   |
+-----------------------------------------------------+
                     | HTTP REST + WebSocket
+-----------------------------------------------------+
|                  Backend (Python FastAPI)             |
|  +----------+ +----------+ +----------+              |
|  | API REST | |WebSocket | |Scheduler |              |
|  | (routes) | |  (live)  | |(APSched) |              |
|  +----------+ +----------+ +----------+              |
|  +----------+ +----------+ +----------+              |
|  | Scenario | |  Plugin  | |   Log    |              |
|  |  Engine  | | Registry | | Service  |              |
|  +----------+ +----------+ +----------+              |
|         SQLAlchemy (Async) + Pydantic                |
+-----------------------------------------------------+
                     |
+-----------------------------------------------------+
|                    Bases de donnees                   |
|  +--------------+         +-------------------+      |
|  |   SQLite /   |         |     InfluxDB      |      |
|  |  PostgreSQL  |         |  (series temp.)   |      |
|  |  (entites)   |         |  (historisation)  |      |
|  +--------------+         +-------------------+      |
+-----------------------------------------------------+
```

---

##  Stack Technique

| Couche       | Technologie                                        |
|-------------|---------------------------------------------------|
| **Frontend** | Angular 17 (Standalone) + Angular Material + SCSS |
| **Backend**  | Python 3.11 + FastAPI + SQLAlchemy (async)        |
| **Auth**     | JWT (PyJWT) + bcrypt                              |
| **BDD**      | SQLite (dev) / MySQL ou PostgreSQL (prod)     |
| **Time Series** | InfluxDB (historisation)                       |
| **Temps réel** | WebSocket natif                                 |
| **Scheduler** | APScheduler                                      |
| **Scénarios** | JSON engine (compatible Blockly) + champs dynamiques |
| **Conteneurs** | Docker + Docker Compose                         |

---

##  Schéma de Données (Entités & Relations)

```
+----------+       +----------+       +------------+
|   User   |       |   Room   |--+    |  Plugin    |
+----------+       +----------+  |    +------------+
| id       |       | id       |  |    | id         |
| username |       | name     |  |    | slug       |
| email    |       | icon     |  |    | category   |
| password |       | color    |  |    | config_    |
| is_admin |       | parent_id|--+    |  schema    |
+----------+       | order    |       |  historize |
                   +----------+       +------------+
                        | 1:N              | 1:N
                   +-------------------------------+
                   |         Device                 |
                   +-------------------------------+
                   | id        | room_id           |
                   | name      | plugin_id         |
                   | type      | config (JSON)     |
                   | state     | historize         |
                   | is_visible| order             |
                   +-------------------------------+
                               |
              +----------------+----------------+
              |                |                |
        +-----------+  +-------------+  +--------------+
        |  Scenario |  |     Log     |  |  Schedule    |
        +-----------+  +-------------+  +--------------+
        | triggers   |  | level      |  | type         |
        | conditions |  | category   |  | cron_expr    |
        | actions    |  | message    |  | time         |
        | blockly_xml|  | device_id  |  | days_of_wk   |
        +-----------+   | scenario_id|  | action       |
                        +-------------+  +--------------+
```

---

##  Système de Plugins

### Architecture

```python
BasePlugin (ABC)           # Classe abstraite
â"œâ"€â"€ MQTTPlugin             # Contrôle via MQTT
â"œâ"€â"€ ZigBeePlugin           # Contrôle ZigBee (Zigbee2MQTT/deCONZ)
â"œâ"€â"€ RF24NetworkPlugin      # Appareils sans-fil nRF24L01+ via dongle USB
â"œâ"€â"€ WeatherPlugin          # Météo (OpenWeatherMap + Météo France + Vigilance)
â"œâ"€â"€ TelegramPlugin         # Notifications Telegram
â"œâ"€â"€ VirtualPlugin          # Appareils virtuels (tests/logique)
â""â"€â"€ ... (extensible)       # Ajouter un fichier = ajouter un plugin
```

### Ajouter un nouveau plugin

1. Créer `backend/app/plugins/mon_plugin.py`
2. Hériter de `BasePlugin`
3. Décorer avec `@register_plugin`
4. Implémenter : `initialize()`, `get_state()`, `set_state()`, `execute_action()`
5. Définir `get_config_schema()` (JSON Schema pour l'UI dynamique)

```python
from app.plugins.base_plugin import BasePlugin
from app.plugins.registry import register_plugin

@register_plugin
class MonPlugin(BasePlugin):
    name = "Mon Plugin"
    slug = "mon_plugin"
    category = "control"

    @classmethod
    def get_config_schema(cls):
        return {
            "type": "object",
            "properties": {
                "host": {"type": "string", "title": "Adresse IP"},
            }
        }

    async def initialize(self, config): ...
    async def get_state(self, device_config): ...
    async def set_state(self, device_config, state): ...
    async def execute_action(self, device_config, action, params): ...
```

### Plugin Météo France (Vigilance)

Le plugin Weather intègre nativement l'API Météo France avec :
- **Observations** et **prévisions** via l'API rpcache
- **Alertes vigilance** (vent, pluie, orages, crues, neige, canicule, grand froid, avalanches, vagues)
- Support du **code INSEE** et du **numéro de département**

---

##  Système de Scénarios

### Modèle Trigger â†' Condition â†' Action

```
DÃ‰CLENCHEUR (trigger)         CONDITION               ACTION
â"Œâ"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"    â"Œâ"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"    â"Œâ"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"
â"‚ â€¢ device_state  â"œâ"€â"€â"€â"€â - º â€¢ device_state   â"œâ"€â"€â"€â"€â - º â€¢ set_device_state  â"‚
â"‚ â€¢ time          â"‚    â"‚ â€¢ time_range     â"‚    â"‚ â€¢ delay             â"‚
â"‚ â€¢ event         â"‚    â"‚ â€¢ value_compare  â"‚    â"‚ â€¢ send_notification â"‚
â"‚ â€¢ cron          â"‚    â"‚ â€¢ AND / OR logic â"‚    â"‚ â€¢ execute_scenario  â"‚
â""â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"˜    â""â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"˜    â""â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"˜
```

### Champs dynamiques

Les champs disponibles dans les triggers et conditions sont **dynamiques** :
lorsqu'un appareil est sélectionné dans l'éditeur Blockly, seuls les champs
réellement présents dans son state sont proposés.

Exemples pour un capteur météo : `temperature`, `humidity`, `wind_speed`,
`vigilance > color`, `vigilance > level`, `season`, `is_weekend`...

Les sous-champs sont accessibles en notation pointée (`vigilance.color`).

### Templates de messages

Les actions de notification supportent des variables dynamiques :
```
{{ device.state.temperature }}        â†' valeur du trigger device
{{ device.state.vigilance.color }}    â†' sous-champ nested
{{ device.name }}                     â†' nom de l'appareil
{{ devices.5.state.humidity }}        â†' n'importe quel appareil par ID
```

### Exemple JSON

```json
{
  "triggers": [
    {"type": "time", "config": {"time": "08:00"}}
  ],
  "conditions": [
    {"type": "device_state", "config": {"device_id": 5, "field": "power", "operator": "==", "value": "off"}, "operator": "and"}
  ],
  "actions": [
    {"type": "set_device_state", "config": {"device_id": 5, "state": {"power": "on"}}},
    {"type": "delay", "config": {"seconds": 10}},
    {"type": "send_notification", "config": {"message": "Lumière allumée !"}}
  ]
}
```

---

##  Démarrage Rapide

### Guides d'installation détaillés

- **[Installation Windows](INSTALL_WINDOWS.md)**  --  PowerShell, certificats, MySQL
- **[Installation Linux](INSTALL_LINUX.md)**  --  Ubuntu/Debian, systemd, apache

### Prérequis

- Python 3.11+
- Node.js 20+
- (Optionnel) Docker & Docker Compose

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # ou venv\Scripts\activate sur Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

L'API est accessible sur `http://localhost:8000`
Documentation Swagger : `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm start
```

L'application est accessible sur :
- **HTTP** : `http://localhost` (port 80)
- **HTTPS** : `https://localhost` (port 443, nécessite un certificat SSL)

Voir [HOW_INSTALL_AND_EXECUTE.md](HOW_INSTALL_AND_EXECUTE.md) pour les instructions détaillées de configuration HTTPS.

### Docker Compose

```bash
docker-compose up --build
```

- Frontend HTTPS : `https://localhost` (port 443)
- Frontend HTTP : `http://localhost` (redirige vers HTTPS)
- Backend API : `http://localhost:8000`

---

##  Structure du Projet

```
thidom/
+-- backend/
|   +-- app/
|   |   +-- api/routes/         # Routes REST (auth, rooms, devices, ...)
|   |   +-- core/               # Config, DB, Security, WebSocket
|   |   +-- models/             # SQLAlchemy models
|   |   +-- schemas/            # Pydantic schemas
|   |   +-- services/           # Business logic (logs, scheduler, scenario engine)
|   |   +-- plugins/            # Plugin system (base, registry, implementations)
|   |   +-- main.py             # Point d'entree FastAPI
|   +-- requirements.txt
|   +-- Dockerfile
|   +-- .env
|
+-- frontend/
|   +-- src/
|   |   +-- app/
|   |   |   +-- core/           # Services, models, guards, interceptors
|   |   |   +-- features/       # Modules fonctionnels
|   |   |   |   +-- auth/       # Login / Register
|   |   |   |   +-- dashboard/  # Tableau de bord principal
|   |   |   |   +-- rooms/      # Gestion des pieces
|   |   |   |   +-- devices/    # Gestion des appareils
|   |   |   |   +-- plugins/    # Gestion des plugins
|   |   |   |   +-- scenarios/  # Editeur de scenarios
|   |   |   |   +-- schedules/  # Planification
|   |   |   |   +-- history/    # Historique & graphiques
|   |   |   |   +-- logs/       # Consultation des logs
|   |   |   +-- layout/         # Sidebar + Toolbar
|   |   +-- assets/             # Logo, images
|   |   +-- environments/       # Config dev/prod
|   |   +-- styles.scss         # Theme global (dark, vert ThiDom)
|   +-- angular.json
|   +-- package.json
|   +-- Dockerfile
|   +-- apache.conf
|
+-- docker-compose.yml
+-- README.md
```

---

##  Sécurité & Scalabilité

### Sécurité
- **HTTPS / TLS** avec certificat SSL (auto-signé en dev, Let's Encrypt en prod)
- **Authentification JWT** avec expiration configurable
- **Hachage bcrypt** des mots de passe
- **CORS** configuré (origines autorisées)
- **Validation Pydantic** sur toutes les entrées API
- **Guards Angular** pour la protection des routes frontend
- **Intercepteur HTTP** pour injection automatique du token

### Scalabilité
- **Architecture modulaire** : chaque plugin est indépendant
- **Async/await** sur tout le backend (FastAPI + SQLAlchemy async)
- **WebSocket** pour les mises à jour temps réel (pas de polling)
- **SQLite â†' MySQL / PostgreSQL** : changement d'une ligne de config
- **InfluxDB** pour les données de séries temporelles (historisation)
- **Docker Compose** pour le déploiement conteneurisé
- **Lazy loading Angular** pour des performances frontend optimales

---

##  Recommandations UX/UI

- **Thème sombre** avec accent vert (#00E676)  --  identité ThiDom
- **Navigation latérale** toujours visible avec icônes + labels
- **Dashboard room-based** : vue par pièce avec filtres
- **Actions rapides** : toggle ON/OFF en un clic sur les appareils
- **Ã‰tat temps réel** : indicateur WebSocket dans le sidebar
- **Formulaires dynamiques** : config plugin auto-générée depuis le JSON Schema
- **Responsive** : grilles CSS auto-adaptatives
- **Animations** : transitions douces (fade-in, hover, transform)

---

##  Licence

Projet privé  --  ThiDom © 2025

