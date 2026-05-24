import { Router } from "express";
import os from "os";
import process from "process";
import { startTime } from "../index.js";

export const dashboardRouter = Router();

dashboardRouter.get("/dashboard", (_req, res) => {
  const uptime = Math.floor((Date.now() - startTime) / 1000);
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = uptime % 60;
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memPercent = Math.round((usedMem / totalMem) * 100);
  const load = os.loadavg()[0]?.toFixed(2) ?? "0.00";

  res.setHeader("Content-Type", "text/html");
  res.send(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta http-equiv="refresh" content="10"/>
  <title>Banandivps — Dashboard</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Segoe UI',system-ui,sans-serif;background:#0f1117;color:#e2e8f0;min-height:100vh;padding:24px 32px}
    header{display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;flex-wrap:wrap;gap:12px}
    h1{font-size:2rem;font-weight:800;background:linear-gradient(135deg,#6366f1,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
    .badge{display:inline-flex;align-items:center;gap:6px;background:#0d2318;border:1px solid #22c55e55;border-radius:999px;padding:5px 14px;font-size:.8rem;color:#22c55e}
    .dot{width:8px;height:8px;border-radius:50%;background:#22c55e;animation:pulse 2s infinite}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
    .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-bottom:28px}
    .card{background:#161b27;border:1px solid #1e293b;border-radius:14px;padding:20px}
    .card-label{font-size:.72rem;color:#4a5568;text-transform:uppercase;letter-spacing:.07em;margin-bottom:10px}
    .card-value{font-size:1.7rem;font-weight:700;color:#f1f5f9}
    .card-sub{font-size:.78rem;color:#334155;margin-top:4px}
    .bar-bg{background:#1e293b;border-radius:999px;height:6px;margin-top:14px;overflow:hidden}
    .bar-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,#6366f1,#a855f7)}
    .section{background:#161b27;border:1px solid #1e293b;border-radius:14px;padding:24px;margin-bottom:20px}
    .section h2{font-size:.85rem;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:.07em;margin-bottom:16px}
    .ep{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid #1e293b30}
    .ep:last-child{border-bottom:none}
    .method{font-size:.65rem;font-weight:700;padding:3px 7px;border-radius:5px;min-width:48px;text-align:center;flex-shrink:0}
    .get{background:#0d2318;color:#22c55e}
    .post{background:#0d1a30;color:#3b82f6}
    .put{background:#1a1a0d;color:#eab308}
    .del{background:#1a0d0d;color:#ef4444}
    .ep-path{font-family:'Fira Code',monospace;font-size:.82rem;color:#7c8fa6;flex:1}
    .ep-desc{font-size:.73rem;color:#334155;text-align:right}
    footer{color:#334155;font-size:.72rem;text-align:center;margin-top:20px}
  </style>
</head>
<body>
<header>
  <div>
    <h1>Banandivps</h1>
    <p style="color:#334155;font-size:.82rem;margin-top:2px">Serveur VPS · Render · Refresh auto toutes les 10s</p>
  </div>
  <div class="badge"><span class="dot"></span> EN LIGNE</div>
</header>

<div class="grid">
  <div class="card">
    <div class="card-label">Uptime</div>
    <div class="card-value">${hours}h ${minutes}m</div>
    <div class="card-sub">${seconds}s depuis le démarrage</div>
  </div>
  <div class="card">
    <div class="card-label">Mémoire utilisée</div>
    <div class="card-value">${Math.round(usedMem / 1024 / 1024)} MB</div>
    <div class="card-sub">sur ${Math.round(totalMem / 1024 / 1024)} MB · ${memPercent}%</div>
    <div class="bar-bg"><div class="bar-fill" style="width:${memPercent}%"></div></div>
  </div>
  <div class="card">
    <div class="card-label">Plateforme</div>
    <div class="card-value">${os.platform()}</div>
    <div class="card-sub">${os.arch()} · ${os.cpus().length} CPU · Node ${process.version}</div>
  </div>
  <div class="card">
    <div class="card-label">Charge CPU (1min)</div>
    <div class="card-value">${load}</div>
    <div class="card-sub">Mémoire libre : ${Math.round(freeMem / 1024 / 1024)} MB</div>
  </div>
</div>

<div class="section">
  <h2>Endpoints API</h2>
  <div class="ep"><span class="method get">GET</span><span class="ep-path">/api/ping</span><span class="ep-desc">Vérification rapide</span></div>
  <div class="ep"><span class="method get">GET</span><span class="ep-path">/api/keepalive</span><span class="ep-desc">Keepalive Render</span></div>
  <div class="ep"><span class="method get">GET</span><span class="ep-path">/api/healthz</span><span class="ep-desc">Health check JSON</span></div>
  <div class="ep"><span class="method get">GET</span><span class="ep-path">/api/status</span><span class="ep-desc">Statut complet système</span></div>
  <div class="ep"><span class="method get">GET</span><span class="ep-path">/api/dashboard</span><span class="ep-desc">Ce tableau de bord</span></div>
  <div class="ep"><span class="method get">GET</span><span class="ep-path">/api/files</span><span class="ep-desc">Lister les fichiers stockés</span></div>
  <div class="ep"><span class="method post">POST</span><span class="ep-path">/api/files</span><span class="ep-desc">Créer un fichier { name, content }</span></div>
  <div class="ep"><span class="method get">GET</span><span class="ep-path">/api/files/:name</span><span class="ep-desc">Lire un fichier</span></div>
  <div class="ep"><span class="method del">DEL</span><span class="ep-path">/api/files/:name</span><span class="ep-desc">Supprimer un fichier</span></div>
  <div class="ep"><span class="method get">GET</span><span class="ep-path">/api/kv</span><span class="ep-desc">Lister les clés KV</span></div>
  <div class="ep"><span class="method put">PUT</span><span class="ep-path">/api/kv/:key</span><span class="ep-desc">Stocker { value, ttl? }</span></div>
  <div class="ep"><span class="method get">GET</span><span class="ep-path">/api/kv/:key</span><span class="ep-desc">Lire une valeur</span></div>
  <div class="ep"><span class="method del">DEL</span><span class="ep-path">/api/kv/:key</span><span class="ep-desc">Supprimer une clé</span></div>
  <div class="ep"><span class="method get">GET</span><span class="ep-path">/api/logs</span><span class="ep-desc">Consulter les logs ?limit=&level=</span></div>
  <div class="ep"><span class="method post">POST</span><span class="ep-path">/api/logs</span><span class="ep-desc">Ajouter { level?, message, data? }</span></div>
  <div class="ep"><span class="method del">DEL</span><span class="ep-path">/api/logs</span><span class="ep-desc">Vider les logs</span></div>
</div>

<footer>Dernière mise à jour : ${new Date().toLocaleString("fr-FR")} · Banandivps v1.0.0</footer>
</body>
</html>`);
});
