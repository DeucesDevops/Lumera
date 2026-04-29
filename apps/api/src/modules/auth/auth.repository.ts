import type { DbClient } from "@lumera/db";
import { sessions, users } from "@lumera/db/schema";
import { eq } from "drizzle-orm";

export class AuthRepository {
  constructor(private readonly db: DbClient) {}

  async findUserByEmail(email: string) {
    const [user] = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    return user;
  }

  async findUserById(id: string) {
    const [user] = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
  }

  async createUser(input: { email: string; passwordHash: string }) {
    const [user] = await this.db.insert(users).values(input).returning();
    return user;
  }

  async createSession(input: {
    userId: string;
    refreshTokenHash: string;
    expiresAt: Date;
    userAgent?: string | undefined;
    ipAddress?: string | undefined;
  }) {
    const [session] = await this.db.insert(sessions).values(input).returning();
    return session;
  }

  async findSessionByRefreshHash(refreshTokenHash: string) {
    const [session] = await this.db
      .select()
      .from(sessions)
      .where(eq(sessions.refreshTokenHash, refreshTokenHash))
      .limit(1);

    return session;
  }

  async rotateSession(input: { sessionId: string; refreshTokenHash: string; expiresAt: Date }) {
    const [session] = await this.db
      .update(sessions)
      .set({
        refreshTokenHash: input.refreshTokenHash,
        expiresAt: input.expiresAt,
        updatedAt: new Date(),
      })
      .where(eq(sessions.id, input.sessionId))
      .returning();

    return session;
  }

  async revokeSession(sessionId: string) {
    await this.db
      .update(sessions)
      .set({ revokedAt: new Date(), updatedAt: new Date() })
      .where(eq(sessions.id, sessionId));
  }

  async revokeUserSessions(userId: string) {
    await this.db
      .update(sessions)
      .set({ revokedAt: new Date(), updatedAt: new Date() })
      .where(eq(sessions.userId, userId));
  }
}
