import type { DbClient } from "@lumera/db";
import { appointments } from "@lumera/db/schema";
import { desc, eq } from "drizzle-orm";

export class AppointmentsRepository {
  constructor(private readonly db: DbClient) {}

  async list(userId: string) {
    return this.db
      .select()
      .from(appointments)
      .where(eq(appointments.userId, userId))
      .orderBy(desc(appointments.scheduledAt));
  }

  async create(
    userId: string,
    input: {
      title: string;
      scheduledAt: string;
      location?: string | undefined;
      notes?: string | undefined;
    },
  ) {
    const [appointment] = await this.db
      .insert(appointments)
      .values({
        userId,
        title: input.title,
        scheduledAt: new Date(input.scheduledAt),
        location: input.location,
        notes: input.notes,
      })
      .returning();

    return appointment;
  }
}
