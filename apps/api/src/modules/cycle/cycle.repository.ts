import type { DbClient } from "@lumera/db";
import { cycleProfiles, periodLogs, symptomLogs } from "@lumera/db/schema";
import { desc, eq } from "drizzle-orm";

export class CycleRepository {
  constructor(private readonly db: DbClient) {}

  async getProfile(userId: string) {
    const [profile] = await this.db
      .select()
      .from(cycleProfiles)
      .where(eq(cycleProfiles.userId, userId))
      .limit(1);

    return profile;
  }

  async upsertProfile(
    userId: string,
    input: {
      goal: "track_cycle" | "trying_to_conceive" | "pregnant" | "postpartum";
      lastPeriodStartDate?: string | undefined;
      averageCycleLength: number;
      averagePeriodLength: number;
    },
  ) {
    const [profile] = await this.db
      .insert(cycleProfiles)
      .values({
        userId,
        goal: input.goal,
        lastPeriodStartDate: input.lastPeriodStartDate,
        averageCycleLength: input.averageCycleLength,
        averagePeriodLength: input.averagePeriodLength,
      })
      .onConflictDoUpdate({
        target: cycleProfiles.userId,
        set: {
          goal: input.goal,
          lastPeriodStartDate: input.lastPeriodStartDate,
          averageCycleLength: input.averageCycleLength,
          averagePeriodLength: input.averagePeriodLength,
          updatedAt: new Date(),
        },
      })
      .returning();

    return profile;
  }

  async listPeriods(userId: string) {
    return this.db
      .select()
      .from(periodLogs)
      .where(eq(periodLogs.userId, userId))
      .orderBy(desc(periodLogs.startDate));
  }

  async latestPeriod(userId: string) {
    const [period] = await this.db
      .select()
      .from(periodLogs)
      .where(eq(periodLogs.userId, userId))
      .orderBy(desc(periodLogs.startDate))
      .limit(1);

    return period;
  }

  async createPeriod(
    userId: string,
    input: {
      startDate: string;
      endDate?: string | undefined;
      flow?: "light" | "medium" | "heavy" | undefined;
      notes?: string | undefined;
    },
  ) {
    const [period] = await this.db
      .insert(periodLogs)
      .values({ userId, ...input })
      .returning();

    return period;
  }

  async listSymptoms(userId: string) {
    return this.db
      .select()
      .from(symptomLogs)
      .where(eq(symptomLogs.userId, userId))
      .orderBy(desc(symptomLogs.loggedAt));
  }

  async createSymptom(
    userId: string,
    input: {
      loggedAt?: string | undefined;
      category:
        | "cramps"
        | "mood"
        | "sleep"
        | "nausea"
        | "spotting"
        | "headache"
        | "fatigue"
        | "breast_tenderness"
        | "discharge"
        | "other";
      intensity: number;
      notes?: string | undefined;
    },
  ) {
    const [symptom] = await this.db
      .insert(symptomLogs)
      .values({
        userId,
        category: input.category,
        intensity: input.intensity,
        notes: input.notes,
        loggedAt: input.loggedAt ? new Date(input.loggedAt) : undefined,
      })
      .returning();

    return symptom;
  }
}
