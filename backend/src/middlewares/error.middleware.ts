import type { NextFunction, Request, Response } from "express";
import * as Sentry from "@sentry/node";
import { logger } from "../lib/logger.js";

export const errorHandler = (err: Error & { status?: number }, req: Request, res: Response, _next: NextFunction) => {
  const reqId = req.id;
  const userId = req.user?.id;
  logger.error({ err, reqId, userId, path: req.path, method: req.method }, "Unhandled request error");
  Sentry.captureException(err, {
    tags: { reqId: String(reqId || ""), path: req.path, method: req.method },
    user: userId ? { id: userId } : undefined,
  });
  const status = err.status ?? 500;
  const message = status === 500 ? "Internal server error" : err.message;
  res.status(status).json({ error: message, reqId });
};
