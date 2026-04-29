import type { DbClient } from "@lumera/db";
import { userConsents, userPreferences, users } from "@lumera/db/schema";
import { eq } from "drizzle-orm";

export class UsersRepository {
  constructor(private readonly db: DbClient) {}

  async getProfile(userId: string) {
    const [user] = await this.db.select().from(users).where(eq(users.id, userId)).limit(1);
    const [preferences] = await this.db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);
    const [latestConsent] = await this.db
      .select()
      .from(userConsents)
      .where(eq(userConsents.userId, userId))
      .limit(1);

    return { user, preferences, latestConsent };
  }

  async upsertPreferences(
    userId: string,
    input: {
      goal: "track_cycle" | "trying_to_conceive" | "pregnant" | "postpartum";
      timezone?: string | undefined;
      units?: string | undefined;
    },
  ) {
    const [preferences] = await this.db
      .insert(userPreferences)
      .values({
        userId,
        goal: input.goal,
        timezone: input.timezone,
        units: input.units,
      })
      .onConflictDoUpdate({
        target: userPreferences.userId,
        set: {
          goal: input.goal,
          timezone: input.timezone,
          units: input.units,
          updatedAt: new Date(),
        },
      })
      .returning();

    return preferences;
  }

  async createConsent(
    userId: string,
    input: {
      healthDataStorage: boolean;
      reminderNotifications: boolean;
      anonymousAnalytics: boolean;
      acceptedPrivacyVersion: string;
      acceptedTermsVersion: string;
    },
  ) {
    const [consent] = await this.db
      .insert(userConsents)
      .values({
        userId,
        ...input,
      })
      .returning();

    return consent;
  }

  async softDeleteUser(userId: string) {
    await this.db.update(users).set({ deletedAt: new Date(), updatedAt: new Date() }).where(eq(users.id, userId));
  }
}
