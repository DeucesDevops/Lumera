import type { DbClient } from "@lumera/db";
import { pregnancyProfiles } from "@lumera/db/schema";
import { eq } from "drizzle-orm";

export class PregnancyRepository {
  constructor(private readonly db: DbClient) {}

  async getProfile(userId: string) {
    const [profile] = await this.db
      .select()
      .from(pregnancyProfiles)
      .where(eq(pregnancyProfiles.userId, userId))
      .limit(1);

    return profile;
  }

  async upsertProfile(
    userId: string,
    input: {
      calculationMethod: "last_period" | "due_date" | "conception_date";
      referenceDate: string;
      estimatedDueDate: string;
      careProviderName?: string | undefined;
    },
  ) {
    const [profile] = await this.db
      .insert(pregnancyProfiles)
      .values({
        userId,
        calculationMethod: input.calculationMethod,
        referenceDate: input.referenceDate,
        estimatedDueDate: input.estimatedDueDate,
        careProviderName: input.careProviderName,
      })
      .onConflictDoUpdate({
        target: pregnancyProfiles.userId,
        set: {
          calculationMethod: input.calculationMethod,
          referenceDate: input.referenceDate,
          estimatedDueDate: input.estimatedDueDate,
          careProviderName: input.careProviderName,
          updatedAt: new Date(),
        },
      })
      .returning();

    return profile;
  }
}
