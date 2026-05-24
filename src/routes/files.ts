import { Router } from "express";
import fs from "fs";
import path from "path";

export const filesRouter = Router();

const STORAGE_DIR = process.env["STORAGE_DIR"] || "./storage";
if (!fs.existsSync(STORAGE_DIR)) fs.mkdirSync(STORAGE_DIR, { recursive: true });

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

filesRouter.get("/files", (_req, res) => {
  try {
    const files = fs.readdirSync(STORAGE_DIR).map((name) => {
      const fp = path.join(STORAGE_DIR, name);
      const stat = fs.statSync(fp);
      return { name, size: stat.size, sizeHuman: formatBytes(stat.size), modified: stat.mtime.toISOString(), isDirectory: stat.isDirectory() };
    });
    res.json({ success: true, count: files.length, files });
  } catch {
    res.status(500).json({ success: false, error: "Impossible de lister les fichiers" });
  }
});

filesRouter.post("/files", (req, res) => {
  const { name, content } = req.body as { name?: string; content?: string };
  if (!name || content === undefined) {
    res.status(400).json({ success: false, error: "name et content sont requis" });
    return;
  }
  const safeName = path.basename(name);
  try {
    fs.writeFileSync(path.join(STORAGE_DIR, safeName), content, "utf-8");
    res.json({ success: true, name: safeName, message: `Fichier '${safeName}' créé` });
  } catch {
    res.status(500).json({ success: false, error: "Impossible de créer le fichier" });
  }
});

filesRouter.get("/files/:name", (req, res) => {
  const safeName = path.basename(req.params["name"] ?? "");
  const fp = path.join(STORAGE_DIR, safeName);
  if (!fs.existsSync(fp)) { res.status(404).json({ success: false, error: "Fichier introuvable" }); return; }
  try {
    const content = fs.readFileSync(fp, "utf-8");
    res.json({ success: true, name: safeName, content });
  } catch {
    res.status(500).json({ success: false, error: "Impossible de lire le fichier" });
  }
});

filesRouter.delete("/files/:name", (req, res) => {
  const safeName = path.basename(req.params["name"] ?? "");
  const fp = path.join(STORAGE_DIR, safeName);
  if (!fs.existsSync(fp)) { res.status(404).json({ success: false, error: "Fichier introuvable" }); return; }
  try {
    fs.unlinkSync(fp);
    res.json({ success: true, message: `Fichier '${safeName}' supprimé` });
  } catch {
    res.status(500).json({ success: false, error: "Impossible de supprimer le fichier" });
  }
});
