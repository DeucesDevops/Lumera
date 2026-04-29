import { cycleGoalSchema } from "@lumera/shared";
import { z } from "zod";

export const preferencesBodySchema = z.object({
  goal: cycleGoalSchema,
  timezone: z.string().min(1).max(80).optional(),
  units: z.enum(["metric", "imperial"]).optional(),
});

export const consentBodySchema = z.object({
  healthDataStorage: z.boolean(),
  reminderNotifications: z.boolean(),
  anonymousAnalytics: z.boolean(),
  acceptedPrivacyVersion: z.string().min(1),
  acceptedTermsVersion: z.string().min(1),
});
