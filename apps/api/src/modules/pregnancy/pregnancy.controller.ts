import type { Request, Response } from "express";
import type { PregnancyService } from "./pregnancy.service";

export class PregnancyController {
  constructor(private readonly service: PregnancyService) {}

  getProfile = async (req: Request, res: Response) => {
    const profile = await this.service.getProfile(req.user!.id);
    res.json({ profile });
  };

  upsertProfile = async (req: Request, res: Response) => {
    const profile = await this.service.upsertProfile(req.user!.id, req.body);
    res.json({ profile });
  };

  weeks = async (req: Request, res: Response) => {
    const weeks = await this.service.weeks(req.user!.id);
    res.json({ weeks });
  };

  weekDetail = async (req: Request, res: Response) => {
    const week = await this.service.weekDetail(Number(req.params.week));
    res.json({ week });
  };
}
