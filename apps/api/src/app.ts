import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { appointmentsRouter } from "./modules/appointments/appointments.routes";
import { authRouter } from "./modules/auth/auth.routes";
import { contentRouter } from "./modules/content/content.routes";
import { cycleRouter } from "./modules/cycle/cycle.routes";
import { dataRightsRouter } from "./modules/data-rights/data-rights.routes";
import { pregnancyRouter } from "./modules/pregnancy/pregnancy.routes";
import { usersRouter } from "./modules/users/users.routes";
import { errorHandler } from "./shared/middleware/error-handler";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN.split(","),
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
  app.use(
    rateLimit({
      windowMs: 60_000,
      limit: 120,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "lumera-api" });
  });

  app.get("/api/v1/health", (_req, res) => {
    res.json({ status: "ok", service: "lumera-api" });
  });

  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/me", usersRouter);
  app.use("/api/v1/me", dataRightsRouter);
  app.use("/api/v1/cycle", cycleRouter);
  app.use("/api/v1/pregnancy", pregnancyRouter);
  app.use("/api/v1/appointments", appointmentsRouter);
  app.use("/api/v1/content", contentRouter);

  app.use(errorHandler);

  return app;
}
