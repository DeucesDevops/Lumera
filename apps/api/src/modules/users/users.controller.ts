import type { Request, Response } from "express";
import type { UsersService } from "./users.service";

export class UsersController {
  constructor(private readonly service: UsersService) {}

  getProfile = async (req: Request, res: Response) => {
    const profile = await this.service.getProfile(req.user!.id);
    res.json(profile);
  };

  upsertPreferences = async (req: Request, res: Response) => {
    const preferences = await this.service.upsertPreferences(req.user!.id, req.body);
    res.json({ preferences });
  };

  createConsent = async (req: Request, res: Response) => {
    const consent = await this.service.createConsent(req.user!.id, req.body);
    res.status(201).json({ consent });
  };
}
