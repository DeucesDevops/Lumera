import { compare, hash } from "bcryptjs";
import { env } from "../../config/env";
import { conflict, unauthorized } from "../../shared/errors/http-error";
import { createOpaqueToken, hashToken, signAccessToken } from "../../shared/security/tokens";
import type { AuthRepository } from "./auth.repository";

type SessionContext = {
  userAgent?: string | undefined;
  ipAddress?: string | undefined;
};

export class AuthService {
  constructor(private readonly repository: AuthRepository) {}

  async register(input: { email: string; password: string }, context: SessionContext) {
    const email = input.email.toLowerCase();
    const existing = await this.repository.findUserByEmail(email);

    if (existing) {
      throw conflict("An account with this email already exists.");
    }

    const passwordHash = await hash(input.password, 12);
    const user = await this.repository.createUser({ email, passwordHash });

    if (!user) {
      throw new Error("Failed to create user.");
    }

    return this.createAuthResponse(user, context);
  }

  async login(input: { email: string; password: string }, context: SessionContext) {
    const user = await this.repository.findUserByEmail(input.email.toLowerCase());

    if (!user || user.deletedAt) {
      throw unauthorized("Invalid email or password.");
    }

    const validPassword = await compare(input.password, user.passwordHash);

    if (!validPassword) {
      throw unauthorized("Invalid email or password.");
    }

    return this.createAuthResponse(user, context);
  }

  async refresh(refreshToken: string) {
    const refreshTokenHash = hashToken(refreshToken);
    const session = await this.repository.findSessionByRefreshHash(refreshTokenHash);

    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      throw unauthorized("Session expired.");
    }

    const user = await this.repository.findUserById(session.userId);

    if (!user || user.deletedAt) {
      throw unauthorized("Session expired.");
    }

    const nextRefreshToken = createOpaqueToken();
    await this.repository.rotateSession({
      sessionId: session.id,
      refreshTokenHash: hashToken(nextRefreshToken),
      expiresAt: this.refreshExpiryDate(),
    });

    return {
      user: this.serializeUser(user),
      accessToken: signAccessToken(user.id),
      refreshToken: nextRefreshToken,
    };
  }

  async logout(refreshToken: string) {
    const session = await this.repository.findSessionByRefreshHash(hashToken(refreshToken));

    if (session) {
      await this.repository.revokeSession(session.id);
    }
  }

  async logoutAll(userId: string) {
    await this.repository.revokeUserSessions(userId);
  }

  async getMe(userId: string) {
    const user = await this.repository.findUserById(userId);

    if (!user || user.deletedAt) {
      throw unauthorized();
    }

    return this.serializeUser(user);
  }

  private async createAuthResponse(
    user: NonNullable<Awaited<ReturnType<AuthRepository["findUserById"]>>>,
    context: SessionContext,
  ) {
    const refreshToken = createOpaqueToken();
    const session = await this.repository.createSession({
      userId: user.id,
      refreshTokenHash: hashToken(refreshToken),
      expiresAt: this.refreshExpiryDate(),
      ...context,
    });

    if (!session) {
      throw new Error("Failed to create session.");
    }

    return {
      user: this.serializeUser(user),
      accessToken: signAccessToken(user.id),
      refreshToken,
    };
  }

  private refreshExpiryDate() {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() + env.REFRESH_TOKEN_TTL_DAYS);
    return date;
  }

  private serializeUser(user: NonNullable<Awaited<ReturnType<AuthRepository["findUserById"]>>>) {
    return {
      id: user.id,
      email: user.email,
      emailVerifiedAt: user.emailVerifiedAt,
      createdAt: user.createdAt,
    };
  }
}
