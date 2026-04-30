# Skill Alexa – ThiDom

Skill Alexa en français pour contrôler le système domotique ThiDom par la voix.

## Fonctionnalités

| Commande vocale | Intent | Action API |
|---|---|---|
| « Alexa, demande à maison ThiDom d'allumer la lumière salon » |
| « Alexa, demande à maison ThiDom d'éteindre la lumière salon » |
| « Alexa, demande à maison ThiDom de basculer la lumière salon » |
| « Alexa, demande à maison ThiDom de mettre le thermostat à 21 degrés » |
| « Alexa, demande à maison ThiDom quel est l'état du thermostat » |
| « Alexa, demande à maison ThiDom quels appareils dans le salon » |
| « Alexa, demande à maison ThiDom de lancer le scénario bonne nuit » |
| « Alexa, demande à maison ThiDom d'allumer tout dans le salon » |
| « Alexa, demande à maison ThiDom d'éteindre tout dans le salon » |

## Structure

```
alexa-skill/
├── interactionModels/
│   └── custom/
│       └── fr-FR.json          # Modèle d'interaction Alexa (statique, exemples)
├── lambda/
│   ├── lambda_function.py      # Handler AWS Lambda (ask-sdk) — Option B
│   └── requirements.txt        # Dépendances Python Lambda
└── README.md

backend/app/api/routes/
└── alexa.py                    # Webhook Alexa self-hosted + endpoints dynamiques — Option A
```

## Architecture — Deux options

### Option A — Self-hosted (recommandé, même appareil que ThiDom)

Le handler Alexa est **intégré directement dans le backend FastAPI**. Aucun AWS Lambda nécessaire.

```
Alexa Cloud  ──HTTPS POST──▶  https://votre-domaine.com/api/alexa/
                                       │
                                 FastAPI (alexa.py)
                                       │
                              ┌────────┴────────┐
                              │  Base de données │
                              │  + Plugins       │
                              └─────────────────┘
```

### Endpoints

| Méthode | Endpoint | Description |
|---|---|---|
| `POST` | `/api/alexa/` | **Webhook Alexa** — reçoit les requêtes vocales et retourne les réponses JSON |
| `GET` | `/api/alexa/slots` | Slot values dynamiques (appareils, pièces, scénarios) |
| `GET` | `/api/alexa/interaction-model` | Modèle d'interaction complet prêt à coller dans la console Alexa |

### Option B — AWS Lambda

Le handler `alexa-skill/lambda/lambda_function.py` peut être déployé sur AWS Lambda. Il appelle l'API ThiDom via HTTP (nécessite `THIDOM_API_URL` et `THIDOM_TOKEN`).

```
Alexa Cloud  ──▶  AWS Lambda (lambda_function.py)  ──HTTP──▶  ThiDom API
```

## Installation

### 1. Exposer ThiDom en HTTPS

Alexa **exige un endpoint HTTPS** avec un certificat SSL valide (pour l'option A self-hosted, et aussi pour que Lambda puisse appeler l'API ThiDom dans l'option B).

- **Reverse proxy nginx + Let's Encrypt** (recommandé) :
  ```nginx
  server {
      listen 443 ssl;
      server_name maison.mondomaine.com;

      ssl_certificate     /etc/letsencrypt/live/maison.mondomaine.com/fullchain.pem;
      ssl_certificate_key /etc/letsencrypt/live/maison.mondomaine.com/privkey.pem;

      location / {
          proxy_pass http://127.0.0.1:8000;
          proxy_set_header Host $host;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
      }
  }
  ```

- **Tunnel ngrok** (pour tester rapidement) :
  ```bash
  ngrok http 8000
  # Copier l'URL https://xxxx.ngrok-free.app
  ```

### 2. Créer le skill sur la console Alexa

1. Aller sur <https://developer.amazon.com/alexa/console/ask>
2. **Create Skill** → Nom : `Maison ThiDom`, Langue : `French (FR)`, Modèle : **Custom**, Backend : **Provision your own**
3. Dans **JSON Editor**, coller le résultat de `GET /api/alexa/interaction-model` (ou le fichier `fr-FR.json` statique)
4. Cliquer **Save Model** puis **Build Model**
5. Onglet **Endpoint** :
   - **Option A (self-hosted)** → choisir **HTTPS** → coller :
     ```
     https://maison.mondomaine.com/api/alexa/
     ```
     Certificat : « My development endpoint has a certificate from a trusted CA »
   - **Option B (AWS Lambda)** → choisir **AWS Lambda ARN** → coller l'ARN de votre fonction

### 3a. Option A — Self-hosted (même appareil que ThiDom)

Rien à déployer. Le backend FastAPI gère tout via `backend/app/api/routes/alexa.py`.

### 3b. Option B — AWS Lambda

```bash
cd alexa-skill/lambda
pip install -r requirements.txt -t .
zip -r ../thidom-alexa.zip .
```

1. Créer une fonction Lambda (Python 3.11+), uploader le zip
2. Ajouter le trigger **Alexa Skills Kit**
3. Configurer les variables d'environnement :

| Variable | Description |
|---|---|
| `THIDOM_API_URL` | URL de l'API ThiDom (ex: `https://maison.mondomaine.com/api`) |
| `THIDOM_TOKEN` | Token JWT valide pour l'authentification |

### 4. Mettre à jour les slots après modification

Après avoir ajouté ou modifié des appareils/pièces/scénarios :

```bash
# 1. Récupérer le modèle à jour
curl -o fr-FR.json https://maison.mondomaine.com/api/alexa/interaction-model

# 2. Coller dans la console Alexa → JSON Editor → Save → Build
```

## Test

Dans la console Alexa, onglet **Test**, tapez ou dites :

- « demande à maison thidom d'allumer la lumière salon »
- « demande à maison thidom quel est l'état du thermostat »
- « demande à maison thidom de lancer le scénario bonne nuit »
