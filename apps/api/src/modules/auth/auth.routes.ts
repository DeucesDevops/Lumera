import { Router } from "express";
import { db } from "../../db";
import { authRequired } from "../../shared/middleware/auth-required";
import { asyncHandler } from "../../shared/middleware/async-handler";
import { validateBody } from "../../shared/middleware/validate";
import { AuthController } from "./auth.controller";
import { AuthRepository } from "./auth.repository";
import { loginBodySchema, logoutBodySchema, refreshBodySchema, registerBodySchema } from "./auth.schemas";
import { AuthService } from "./auth.service";

const repository = new AuthRepository(db);
const service = new AuthService(repository);
const controller = new AuthController(service);

export const authRouter = Router();

authRouter.post("/register", validateBody(registerBodySchema), asyncHandler(controller.register));
authRouter.post("/login", validateBody(loginBodySchema), asyncHandler(controller.login));
authRouter.post("/refresh", validateBody(refreshBodySchema), asyncHandler(controller.refresh));
authRouter.post("/logout", validateBody(logoutBodySchema), asyncHandler(controller.logout));
authRouter.post("/logout-all", authRequired, asyncHandler(controller.logoutAll));
authRouter.get("/me", authRequired, asyncHandler(controller.me));
