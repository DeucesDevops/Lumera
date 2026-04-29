import type { NextFunction, Request, Response } from "express";
import { unauthorized } from "../errors/http-error";
import { verifyAccessToken } from "../security/tokens";

export function authRequired(req: Request, _res: Response, next: NextFunction) {
  const header = req.header("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : undefined;

  if (!token) {
    throw unauthorized();
  }

  const userId = verifyAccessToken(token);
  req.user = { id: userId };
  next();
}
