import crypto from "node:crypto";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { env } from "../../config/env";
import { unauthorized } from "../errors/http-error";

type AccessTokenPayload = {
  typ: "access";
};

export function createOpaqueToken() {
  return crypto.randomBytes(48).toString("base64url");
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function signAccessToken(userId: string) {
  const expiresIn = env.ACCESS_TOKEN_TTL as NonNullable<SignOptions["expiresIn"]>;

  return jwt.sign({ typ: "access" } satisfies AccessTokenPayload, env.JWT_ACCESS_SECRET as Secret, {
    subject: userId,
    expiresIn,
  });
}

export function verifyAccessToken(token: string) {
  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
    if (typeof decoded === "string" || decoded.typ !== "access" || !decoded.sub) {
      throw unauthorized();
    }

    return decoded.sub;
  } catch {
    throw unauthorized();
  }
}
