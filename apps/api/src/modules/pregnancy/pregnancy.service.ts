import type { PregnancyProfileInput } from "@lumera/shared";
import { notFound } from "../../shared/errors/http-error";
import { addDays, daysBetween, toDateOnly } from "../../shared/utils/date";
import { pregnancyWeekContent } from "./pregnancy.content";
import type { PregnancyRepository } from "./pregnancy.repository";

export class PregnancyService {
  constructor(private readonly repository: PregnancyRepository) {}

  async getProfile(userId: string) {
    const profile = await this.repository.getProfile(userId);

    if (!profile) {
      return null;
    }

    return {
      ...profile,
      currentWeek: this.currentWeek(profile.estimatedDueDate),
    };
  }

  async upsertProfile(userId: string, input: PregnancyProfileInput) {
    const estimatedDueDate = this.estimateDueDate(input);
    const profile = await this.repository.upsertProfile(userId, {
      ...input,
      estimatedDueDate,
    });

    if (!profile) {
      throw new Error("Failed to save pregnancy profile.");
    }

    return {
      ...profile,
      currentWeek: this.currentWeek(profile.estimatedDueDate),
    };
  }

  async weeks(userId: string) {
    const profile = await this.repository.getProfile(userId);
    const currentWeek = profile ? this.currentWeek(profile.estimatedDueDate) : null;

    return pregnancyWeekContent.map((week) => ({
      ...week,
      status: currentWeek === null ? "upcoming" : week.week < currentWeek ? "completed" : week.week === currentWeek ? "current" : "upcoming",
    }));
  }

  async weekDetail(week: number) {
    const content = pregnancyWeekContent.find((item) => item.week === week);

    if (!content) {
      throw notFound("Pregnancy week not found.");
    }

    return content;
  }

  private estimateDueDate(input: PregnancyProfileInput) {
    const reference = new Date(`${input.referenceDate}T00:00:00.000Z`);

    if (input.calculationMethod === "due_date") {
      return input.referenceDate;
    }

    if (input.calculationMethod === "conception_date") {
      return toDateOnly(addDays(reference, 266));
    }

    return toDateOnly(addDays(reference, 280));
  }

  private currentWeek(estimatedDueDate: string) {
    const dueDate = new Date(`${estimatedDueDate}T00:00:00.000Z`);
    const pregnancyStart = addDays(dueDate, -280);
    const week = Math.floor(daysBetween(pregnancyStart, new Date()) / 7) + 1;
    return Math.min(40, Math.max(1, week));
  }
}
