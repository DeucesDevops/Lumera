import type { Request, Response } from "express";
import type { CycleService } from "./cycle.service";

export class CycleController {
  constructor(private readonly service: CycleService) {}

  getProfile = async (req: Request, res: Response) => {
    const profile = await this.service.getProfile(req.user!.id);
    res.json({ profile });
  };

  upsertProfile = async (req: Request, res: Response) => {
    const profile = await this.service.upsertProfile(req.user!.id, req.body);
    res.json({ profile });
  };

  listPeriods = async (req: Request, res: Response) => {
    const periods = await this.service.listPeriods(req.user!.id);
    res.json({ periods });
  };

  createPeriod = async (req: Request, res: Response) => {
    const period = await this.service.createPeriod(req.user!.id, req.body);
    res.status(201).json({ period });
  };

  listSymptoms = async (req: Request, res: Response) => {
    const symptoms = await this.service.listSymptoms(req.user!.id);
    res.json({ symptoms });
  };

  createSymptom = async (req: Request, res: Response) => {
    const symptom = await this.service.createSymptom(req.user!.id, req.body);
    res.status(201).json({ symptom });
  };

  predictions = async (req: Request, res: Response) => {
    const predictions = await this.service.getPredictions(req.user!.id);
    res.json({ predictions });
  };
}
