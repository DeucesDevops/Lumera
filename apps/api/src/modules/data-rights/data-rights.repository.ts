import type { DbClient } from "@lumera/db";
import {
  accountDeletionRequests,
  appointments,
  cycleProfiles,
  dataExportRequests,
  periodLogs,
  pregnancyProfiles,
  symptomLogs,
  userConsents,
  userPreferences,
  users,
} from "@lumera/db/schema";
import { eq } from "drizzle-orm";

export class DataRightsRepository {
  constructor(private readonly db: DbClient) {}

  async exportUserData(userId: string) {
    const [user] = await this.db.select().from(users).where(eq(users.id, userId)).limit(1);
    const [preferences] = await this.db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);
    const [cycleProfile] = await this.db
      .select()
      .from(cycleProfiles)
      .where(eq(cycleProfiles.userId, userId))
      .limit(1);
    const [pregnancyProfile] = await this.db
      .select()
      .from(pregnancyProfiles)
      .where(eq(pregnancyProfiles.userId, userId))
      .limit(1);

    const [periods, symptoms, userAppointments, consents] = await Promise.all([
      this.db.select().from(periodLogs).where(eq(periodLogs.userId, userId)),
      this.db.select().from(symptomLogs).where(eq(symptomLogs.userId, userId)),
      this.db.select().from(appointments).where(eq(appointments.userId, userId)),
      this.db.select().from(userConsents).where(eq(userConsents.userId, userId)),
    ]);

    await this.db.insert(dataExportRequests).values({
      userId,
      status: "completed",
      completedAt: new Date(),
    });

    return {
      exportedAt: new Date().toISOString(),
      user: user
        ? {
            id: user.id,
            email: user.email,
            emailVerifiedAt: user.emailVerifiedAt,
            createdAt: user.createdAt,
          }
        : null,
      preferences: preferences ?? null,
      consents,
      cycleProfile: cycleProfile ?? null,
      periods,
      symptoms,
      pregnancyProfile: pregnancyProfile ?? null,
      appointments: userAppointments,
    };
  }

  async requestDeletion(userId: string) {
    const [request] = await this.db
      .insert(accountDeletionRequests)
      .values({
        userId,
        status: "completed",
        completedAt: new Date(),
      })
      .returning();

    await this.db.update(users).set({ deletedAt: new Date(), updatedAt: new Date() }).where(eq(users.id, userId));

    return request;
  }
}
