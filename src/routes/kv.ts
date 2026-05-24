import { Router } from "express";

export const kvRouter = Router();

type Entry = { value: unknown; ttl?: number; createdAt: number };
const store = new Map<string, Entry>();

function isExpired(e: Entry): boolean {
  return !!e.ttl && Date.now() > e.createdAt + e.ttl * 1000;
}

kvRouter.get("/kv", (_req, res) => {
  const keys = Array.from(store.entries())
    .filter(([, v]) => !isExpired(v))
    .map(([key, v]) => ({
      key,
      ttl: v.ttl ?? null,
      createdAt: new Date(v.createdAt).toISOString(),
      expiresAt: v.ttl ? new Date(v.createdAt + v.ttl * 1000).toISOString() : null,
    }));
  res.json({ success: true, count: keys.length, keys });
});

kvRouter.get("/kv/:key", (req, res) => {
  const key = req.params["key"] ?? "";
  const entry = store.get(key);
  if (!entry || isExpired(entry)) {
    store.delete(key);
    res.status(404).json({ success: false, error: "Key not found or expired" });
    return;
  }
  res.json({ success: true, key, value: entry.value });
});

kvRouter.put("/kv/:key", (req, res) => {
  const key = req.params["key"] ?? "";
  const { value, ttl } = req.body as { value?: unknown; ttl?: number };
  if (value === undefined) {
    res.status(400).json({ success: false, error: "value is required" });
    return;
  }
  store.set(key, { value, ttl, createdAt: Date.now() });
  res.json({ success: true, key, message: "Valeur stockée" });
});

kvRouter.delete("/kv/:key", (req, res) => {
  const key = req.params["key"] ?? "";
  if (!store.has(key)) {
    res.status(404).json({ success: false, error: "Key not found" });
    return;
  }
  store.delete(key);
  res.json({ success: true, key, message: "Clé supprimée" });
});
