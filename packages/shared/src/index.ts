import { z } from "zod";

export const emailSchema = z.string().trim().toLowerCase().email();

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be 128 characters or fewer");

export const authRegisterSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const authLoginSchema = authRegisterSchema;

export const cycleGoalSchema = z.enum([
  "track_cycle",
  "trying_to_conceive",
  "pregnant",
  "postpartum",
]);

export const cycleProfileSchema = z.object({
  lastPeriodStartDate: z.string().date().optional(),
  averageCycleLength: z.number().int().min(18).max(45).default(28),
  averagePeriodLength: z.number().int().min(1).max(12).default(5),
  goal: cycleGoalSchema.default("track_cycle"),
});

export const periodLogSchema = z.object({
  startDate: z.string().date(),
  endDate: z.string().date().optional(),
  flow: z.enum(["light", "medium", "heavy"]).optional(),
  notes: z.string().max(1000).optional(),
});

export const symptomLogSchema = z.object({
  loggedAt: z.string().datetime().optional(),
  category: z.enum([
    "cramps",
    "mood",
    "sleep",
    "nausea",
    "spotting",
    "headache",
    "fatigue",
    "breast_tenderness",
    "discharge",
    "other",
  ]),
  intensity: z.number().int().min(0).max(10).default(0),
  notes: z.string().max(1000).optional(),
});

export const pregnancyProfileSchema = z.object({
  calculationMethod: z.enum(["last_period", "due_date", "conception_date"]),
  referenceDate: z.string().date(),
  careProviderName: z.string().max(160).optional(),
});

export const appointmentSchema = z.object({
  title: z.string().min(1).max(160),
  scheduledAt: z.string().datetime(),
  location: z.string().max(240).optional(),
  notes: z.string().max(1000).optional(),
});

export type AuthRegisterInput = z.infer<typeof authRegisterSchema>;
export type AuthLoginInput = z.infer<typeof authLoginSchema>;
export type CycleProfileInput = z.infer<typeof cycleProfileSchema>;
export type PeriodLogInput = z.infer<typeof periodLogSchema>;
export type SymptomLogInput = z.infer<typeof symptomLogSchema>;
export type PregnancyProfileInput = z.infer<typeof pregnancyProfileSchema>;
export type AppointmentInput = z.infer<typeof appointmentSchema>;
