import { Router } from "express";
import os from "os";
import process from "process";
import { startTime } from "../index.js";

export const statusRouter = Router();

statusRouter.get("/status", (_req, res) => {
  const uptime = Math.floor((Date.now() - startTime) / 1000);
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = uptime % 60;
  const memUsage = process.memoryUsage();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();

  res.json({
    status: "online",
    server: "Banandivps",
    version: "1.0.0",
    uptime: { seconds: uptime, human: `${hours}h ${minutes}m ${seconds}s` },
    system: {
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
      hostname: os.hostname(),
      cpus: os.cpus().length,
      loadAvg: os.loadavg(),
    },
    memory: {
      total: `${Math.round(totalMem / 1024 / 1024)} MB`,
      free: `${Math.round(freeMem / 1024 / 1024)} MB`,
      used: `${Math.round((totalMem - freeMem) / 1024 / 1024)} MB`,
      process: {
        rss: `${Math.round(memUsage.rss / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`,
      },
    },
    timestamp: new Date().toISOString(),
  });
});
