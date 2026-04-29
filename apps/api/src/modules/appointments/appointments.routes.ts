import { appointmentSchema } from "@lumera/shared";
import { Router } from "express";
import { db } from "../../db";
import { authRequired } from "../../shared/middleware/auth-required";
import { asyncHandler } from "../../shared/middleware/async-handler";
import { validateBody } from "../../shared/middleware/validate";
import { AppointmentsController } from "./appointments.controller";
import { AppointmentsRepository } from "./appointments.repository";
import { AppointmentsService } from "./appointments.service";

const repository = new AppointmentsRepository(db);
const service = new AppointmentsService(repository);
const controller = new AppointmentsController(service);

export const appointmentsRouter = Router();

appointmentsRouter.use(authRequired);
appointmentsRouter.get("/", asyncHandler(controller.list));
appointmentsRouter.post("/", validateBody(appointmentSchema), asyncHandler(controller.create));
