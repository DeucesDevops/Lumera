import { pregnancyProfileSchema } from "@lumera/shared";
import { Router } from "express";
import { db } from "../../db";
import { authRequired } from "../../shared/middleware/auth-required";
import { asyncHandler } from "../../shared/middleware/async-handler";
import { validateBody } from "../../shared/middleware/validate";
import { PregnancyController } from "./pregnancy.controller";
import { PregnancyRepository } from "./pregnancy.repository";
import { PregnancyService } from "./pregnancy.service";

const repository = new PregnancyRepository(db);
const service = new PregnancyService(repository);
const controller = new PregnancyController(service);

export const pregnancyRouter = Router();

pregnancyRouter.use(authRequired);
pregnancyRouter.get("/profile", asyncHandler(controller.getProfile));
pregnancyRouter.put("/profile", validateBody(pregnancyProfileSchema), asyncHandler(controller.upsertProfile));
pregnancyRouter.get("/weeks", asyncHandler(controller.weeks));
pregnancyRouter.get("/weeks/:week", asyncHandler(controller.weekDetail));
