import { Router } from "express";

export const pingRouter = Router();

pingRouter.get("/ping", (_req, res) => {
  res.json({ pong: true, timestamp: new Date().toISOString() });
});

pingRouter.get("/keepalive", (_req, res) => {
  res.send("OK");
});
