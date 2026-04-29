import type { Request, Response } from "express";
import type { DataRightsService } from "./data-rights.service";

export class DataRightsController {
  constructor(private readonly service: DataRightsService) {}

  export = async (req: Request, res: Response) => {
    const archive = await this.service.exportUserData(req.user!.id);
    res.json({ archive });
  };

  deleteAccount = async (req: Request, res: Response) => {
    await this.service.deleteAccount(req.user!.id);
    res.status(204).send();
  };
}
