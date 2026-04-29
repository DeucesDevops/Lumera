import type { Request, Response } from "express";
import type { AuthService } from "./auth.service";

export class AuthController {
  constructor(private readonly service: AuthService) {}

  register = async (req: Request, res: Response) => {
    const result = await this.service.register(req.body, {
      userAgent: req.header("user-agent"),
      ipAddress: req.ip,
    });

    res.status(201).json(result);
  };

  login = async (req: Request, res: Response) => {
    const result = await this.service.login(req.body, {
      userAgent: req.header("user-agent"),
      ipAddress: req.ip,
    });

    res.json(result);
  };

  refresh = async (req: Request, res: Response) => {
    const result = await this.service.refresh(req.body.refreshToken);
    res.json(result);
  };

  logout = async (req: Request, res: Response) => {
    await this.service.logout(req.body.refreshToken);
    res.status(204).send();
  };

  logoutAll = async (req: Request, res: Response) => {
    await this.service.logoutAll(req.user!.id);
    res.status(204).send();
  };

  me = async (req: Request, res: Response) => {
    const user = await this.service.getMe(req.user!.id);
    res.json({ user });
  };
}
