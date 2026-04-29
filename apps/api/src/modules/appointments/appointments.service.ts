import type { AppointmentInput } from "@lumera/shared";
import type { AppointmentsRepository } from "./appointments.repository";

export class AppointmentsService {
  constructor(private readonly repository: AppointmentsRepository) {}

  list(userId: string) {
    return this.repository.list(userId);
  }

  async create(userId: string, input: AppointmentInput) {
    const appointment = await this.repository.create(userId, input);

    if (!appointment) {
      throw new Error("Failed to save appointment.");
    }

    return appointment;
  }
}
