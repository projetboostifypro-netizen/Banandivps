import express from "express";
import cors from "cors";
import { router } from "./routes/index.js";

const app = express();
const PORT = Number(process.env["PORT"] ?? 10000);
const startTime = Date.now();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use((_req, res, next) => {
  res.setHeader("X-Powered-By", "Banandivps");
  next();
});

app.use("/api", router);

app.get("/", (_req, res) => {
  res.redirect("/api/dashboard");
});

app.listen(PORT, () => {
  console.log(`🚀 Banandivps démarré sur le port ${PORT}`);
  console.log(`📊 Dashboard : http://localhost:${PORT}/api/dashboard`);
  console.log(`❤️  Health   : http://localhost:${PORT}/api/healthz`);
});

export { startTime };
