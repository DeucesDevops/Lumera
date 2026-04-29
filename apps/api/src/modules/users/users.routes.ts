import { Router } from "express";
import { db } from "../../db";
import { authRequired } from "../../shared/middleware/auth-required";
import { asyncHandler } from "../../shared/middleware/async-handler";
import { validateBody } from "../../shared/middleware/validate";
import { UsersController } from "./users.controller";
import { UsersRepository } from "./users.repository";
import { consentBodySchema, preferencesBodySchema } from "./users.schemas";
import { UsersService } from "./users.service";

const repository = new UsersRepository(db);
const service = new UsersService(repository);
const controller = new UsersController(service);

export const usersRouter = Router();

usersRouter.use(authRequired);
usersRouter.get("/", asyncHandler(controller.getProfile));
usersRouter.put("/preferences", validateBody(preferencesBodySchema), asyncHandler(controller.upsertPreferences));
usersRouter.post("/consents", validateBody(consentBodySchema), asyncHandler(controller.createConsent));
