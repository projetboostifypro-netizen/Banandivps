import { Router } from "express";

export const logsRouter = Router();

type LogEntry = { level: string; message: string; data?: unknown; timestamp: string };
const logBuffer: LogEntry[] = [];
const MAX_LOGS = 500;

logsRouter.get("/logs", (req, res) => {
  const limit = Math.min(Number(req.query["limit"]) || 100, MAX_LOGS);
  const level = req.query["level"] as string | undefined;
  let entries = [...logBuffer].reverse();
  if (level) entries = entries.filter((e) => e.level === level);
  res.json({ success: true, count: entries.length, logs: entries.slice(0, limit) });
});

logsRouter.post("/logs", (req, res) => {
  const { level, message, data } = req.body as { level?: string; message?: string; data?: unknown };
  if (!message) {
    res.status(400).json({ success: false, error: "message is required" });
    return;
  }
  const entry: LogEntry = { level: level ?? "info", message, data, timestamp: new Date().toISOString() };
  logBuffer.push(entry);
  if (logBuffer.length > MAX_LOGS) logBuffer.shift();
  res.json({ success: true, entry });
});

logsRouter.delete("/logs", (_req, res) => {
  logBuffer.length = 0;
  res.json({ success: true, message: "Logs vidés" });
});
