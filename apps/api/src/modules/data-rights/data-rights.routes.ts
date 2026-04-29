import { Router } from "express";
import { db } from "../../db";
import { authRequired } from "../../shared/middleware/auth-required";
import { asyncHandler } from "../../shared/middleware/async-handler";
import { DataRightsController } from "./data-rights.controller";
import { DataRightsRepository } from "./data-rights.repository";
import { DataRightsService } from "./data-rights.service";

const repository = new DataRightsRepository(db);
const service = new DataRightsService(repository);
const controller = new DataRightsController(service);

export const dataRightsRouter = Router();

dataRightsRouter.use(authRequired);
dataRightsRouter.get("/export", asyncHandler(controller.export));
dataRightsRouter.delete("/delete", asyncHandler(controller.deleteAccount));
