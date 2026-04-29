import type { Request, Response } from "express";
import type { AppointmentsService } from "./appointments.service";

export class AppointmentsController {
  constructor(private readonly service: AppointmentsService) {}

  list = async (req: Request, res: Response) => {
    const appointments = await this.service.list(req.user!.id);
    res.json({ appointments });
  };

  create = async (req: Request, res: Response) => {
    const appointment = await this.service.create(req.user!.id, req.body);
    res.status(201).json({ appointment });
  };
}
