import { Router } from "express";
import { healthRouter } from "./health.js";
import { statusRouter } from "./status.js";
import { filesRouter } from "./files.js";
import { kvRouter } from "./kv.js";
import { logsRouter } from "./logs.js";
import { pingRouter } from "./ping.js";
import { dashboardRouter } from "./dashboard.js";

export const router = Router();

router.use(healthRouter);
router.use(statusRouter);
router.use(filesRouter);
router.use(kvRouter);
router.use(logsRouter);
router.use(pingRouter);
router.use(dashboardRouter);
