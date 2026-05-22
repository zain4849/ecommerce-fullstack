import "dotenv/config";
import Joi from "joi";
import * as Sentry from "@sentry/node";
import app from "./app.js";
import { prisma } from "./lib/prisma.js";
import { logger } from "./lib/logger.js";

const PORT = Number(process.env.PORT ?? 5000);

function validateEnvironment() {
  const schema = Joi.object({
    NODE_ENV: Joi.string().valid("development", "test", "production").default("development"),
    PORT: Joi.number().port().default(5000),
    DATABASE_URL: Joi.string().uri({ scheme: ["postgres", "postgresql"] }).required(),
    JWT_SECRET: Joi.string().min(32).required(),
    FRONTEND_URL: Joi.string().when("NODE_ENV", {
      is: "production",
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    STRIPE_SECRET_KEY: Joi.string().when("NODE_ENV", {
      is: "production",
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    STRIPE_WEBHOOK_SECRET: Joi.string().when("NODE_ENV", {
      is: "production",
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    SENTRY_DSN: Joi.string().uri().optional(),
    ALLOW_VERCEL_PREVIEWS: Joi.string().valid("true", "false").optional(),
  }).unknown(true);

  const { error } = schema.validate(process.env, { abortEarly: false });
  if (error) {
    throw new Error(`Environment validation failed: ${error.details.map((d) => d.message).join(", ")}`);
  }
}

async function bootstrap() {
  validateEnvironment();
  await prisma.$connect();
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
    });
  }

  const server = app.listen(PORT, () => {
    logger.info({ port: PORT }, "Server running");
  });

  const shutdown = async (signal: "SIGINT" | "SIGTERM") => {
    logger.info({ signal }, "Received shutdown signal");
    server.close(async () => {
      try {
        await prisma.$disconnect();
        await Sentry.close(2000);
        logger.info("Shutdown complete");
        process.exit(0);
      } catch (error) {
        logger.error({ error }, "Shutdown failed");
        process.exit(1);
      }
    });
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

bootstrap().catch((error) => {
  logger.error({ error }, "Failed to start server");
  process.exit(1);
});
