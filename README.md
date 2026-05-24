# Banandivps 🚀

Serveur VPS polyvalent hébergé sur Render, tournant 24/7.

## Fonctionnalités

- **API REST complète** avec Express.js
- **Stockage de fichiers** — créer, lire, lister, supprimer
- **KV Store en mémoire** — stocker des clés/valeurs avec TTL optionnel
- **Système de logs** — centraliser et consulter les logs applicatifs
- **Dashboard de monitoring** — uptime, mémoire, CPU en temps réel
- **Health check** — compatible Render pour rester actif 24/7

## Endpoints

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/ping` | Vérification rapide |
| GET | `/api/keepalive` | Keepalive pour Render |
| GET | `/api/healthz` | Health check JSON |
| GET | `/api/status` | Statut complet système |
| GET | `/api/dashboard` | Tableau de bord HTML |
| GET | `/api/files` | Lister les fichiers |
| POST | `/api/files` | Créer un fichier `{ name, content }` |
| GET | `/api/files/:name` | Lire un fichier |
| DELETE | `/api/files/:name` | Supprimer un fichier |
| GET | `/api/kv` | Lister les clés KV |
| PUT | `/api/kv/:key` | Stocker `{ value, ttl? }` |
| GET | `/api/kv/:key` | Lire une valeur |
| DELETE | `/api/kv/:key` | Supprimer une clé |
| GET | `/api/logs` | Consulter les logs |
| POST | `/api/logs` | Ajouter `{ level?, message, data? }` |
| DELETE | `/api/logs` | Vider les logs |

## Démarrage local

```bash
npm install
npm run build
npm start
```

Le dashboard est accessible sur : `http://localhost:10000/api/dashboard`

## Déploiement sur Render

1. Push ce repo sur GitHub
2. Va sur [render.com](https://render.com) → **New Web Service**
3. Connecte ton repo GitHub (`Banandivps`)
4. Render détecte automatiquement `render.yaml`
5. Clique **Deploy** → ton serveur tourne 24/7

### Variables d'environnement Render

| Variable | Valeur |
|----------|--------|
| `PORT` | `10000` |
| `NODE_ENV` | `production` |
| `STORAGE_DIR` | `/opt/render/project/src/storage` |

## Structure du projet

```
Banandivps/
├── src/
│   ├── index.ts          # Point d'entrée
│   └── routes/
│       ├── index.ts      # Router principal
│       ├── health.ts     # Health check
│       ├── ping.ts       # Ping / keepalive
│       ├── status.ts     # Statut système
│       ├── files.ts      # Gestion fichiers
│       ├── kv.ts         # KV Store
│       ├── logs.ts       # Système de logs
│       └── dashboard.ts  # Dashboard HTML
├── build.mjs             # Script de build esbuild
├── render.yaml           # Config Render
└── package.json
```
