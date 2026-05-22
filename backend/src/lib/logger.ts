import crypto from "node:crypto";
import pino from "pino";
import { pinoHttp } from "pino-http";

export const logger = pino({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "debug"),
});

export const requestLogger = pinoHttp({
  logger,
  genReqId: (req: { headers: Record<string, unknown> }, res: { setHeader: (name: string, value: string) => void }) => {
    const incoming = req.headers["x-request-id"];
    const reqId = typeof incoming === "string" && incoming.trim() ? incoming : crypto.randomUUID();
    res.setHeader("x-request-id", reqId);
    return reqId;
  },
});
