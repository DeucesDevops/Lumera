import type { CycleProfileInput, PeriodLogInput, SymptomLogInput } from "@lumera/shared";
import { badRequest } from "../../shared/errors/http-error";
import { addDays, daysBetween, toDateOnly } from "../../shared/utils/date";
import type { CycleRepository } from "./cycle.repository";

export class CycleService {
  constructor(private readonly repository: CycleRepository) {}

  async getProfile(userId: string) {
    const profile = await this.repository.getProfile(userId);
    return profile ?? null;
  }

  async upsertProfile(userId: string, input: CycleProfileInput) {
    const profile = await this.repository.upsertProfile(userId, {
      goal: input.goal,
      lastPeriodStartDate: input.lastPeriodStartDate,
      averageCycleLength: input.averageCycleLength,
      averagePeriodLength: input.averagePeriodLength,
    });

    if (!profile) {
      throw new Error("Failed to save cycle profile.");
    }

    return profile;
  }

  listPeriods(userId: string) {
    return this.repository.listPeriods(userId);
  }

  async createPeriod(userId: string, input: PeriodLogInput) {
    if (input.endDate && input.endDate < input.startDate) {
      throw badRequest("Period end date cannot be before the start date.");
    }

    const period = await this.repository.createPeriod(userId, input);

    if (!period) {
      throw new Error("Failed to save period log.");
    }

    return period;
  }

  listSymptoms(userId: string) {
    return this.repository.listSymptoms(userId);
  }

  async createSymptom(userId: string, input: SymptomLogInput) {
    const symptom = await this.repository.createSymptom(userId, input);

    if (!symptom) {
      throw new Error("Failed to save symptom log.");
    }

    return symptom;
  }

  async getPredictions(userId: string) {
    const profile = await this.repository.getProfile(userId);
    const latestPeriod = await this.repository.latestPeriod(userId);

    const cycleLength = profile?.averageCycleLength ?? 28;
    const periodLength = profile?.averagePeriodLength ?? 5;
    const anchorDate = latestPeriod?.startDate ?? profile?.lastPeriodStartDate;

    if (!anchorDate) {
      return {
        cycleDay: null,
        nextPeriodStartDate: null,
        nextPeriodEndDate: null,
        fertileWindowStartDate: null,
        fertileWindowEndDate: null,
        ovulationEstimateDate: null,
      };
    }

    const start = new Date(`${anchorDate}T00:00:00.000Z`);
    const today = new Date();
    const daysSinceStart = daysBetween(start, today);
    const cycleDay = Math.max(1, (daysSinceStart % cycleLength) + 1);
    const cyclesElapsed = Math.max(1, Math.floor(daysSinceStart / cycleLength) + 1);
    const nextPeriodStart = addDays(start, cyclesElapsed * cycleLength);
    const ovulation = addDays(nextPeriodStart, -14);

    return {
      cycleDay,
      nextPeriodStartDate: toDateOnly(nextPeriodStart),
      nextPeriodEndDate: toDateOnly(addDays(nextPeriodStart, periodLength - 1)),
      fertileWindowStartDate: toDateOnly(addDays(ovulation, -5)),
      fertileWindowEndDate: toDateOnly(addDays(ovulation, 1)),
      ovulationEstimateDate: toDateOnly(ovulation),
    };
  }
}
