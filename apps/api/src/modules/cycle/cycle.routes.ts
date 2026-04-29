import { cycleProfileSchema, periodLogSchema, symptomLogSchema } from "@lumera/shared";
import { Router } from "express";
import { db } from "../../db";
import { authRequired } from "../../shared/middleware/auth-required";
import { asyncHandler } from "../../shared/middleware/async-handler";
import { validateBody } from "../../shared/middleware/validate";
import { CycleController } from "./cycle.controller";
import { CycleRepository } from "./cycle.repository";
import { CycleService } from "./cycle.service";

const repository = new CycleRepository(db);
const service = new CycleService(repository);
const controller = new CycleController(service);

export const cycleRouter = Router();

cycleRouter.use(authRequired);
cycleRouter.get("/profile", asyncHandler(controller.getProfile));
cycleRouter.put("/profile", validateBody(cycleProfileSchema), asyncHandler(controller.upsertProfile));
cycleRouter.get("/periods", asyncHandler(controller.listPeriods));
cycleRouter.post("/periods", validateBody(periodLogSchema), asyncHandler(controller.createPeriod));
cycleRouter.get("/symptoms", asyncHandler(controller.listSymptoms));
cycleRouter.post("/symptoms", validateBody(symptomLogSchema), asyncHandler(controller.createSymptom));
cycleRouter.get("/predictions", asyncHandler(controller.predictions));
