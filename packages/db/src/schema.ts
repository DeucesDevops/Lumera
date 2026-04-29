import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const userGoalEnum = pgEnum("user_goal", [
  "track_cycle",
  "trying_to_conceive",
  "pregnant",
  "postpartum",
]);

export const flowEnum = pgEnum("period_flow", ["light", "medium", "heavy"]);

export const symptomCategoryEnum = pgEnum("symptom_category", [
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
]);

export const pregnancyCalculationMethodEnum = pgEnum("pregnancy_calculation_method", [
  "last_period",
  "due_date",
  "conception_date",
]);

export const reminderTypeEnum = pgEnum("reminder_type", [
  "period",
  "appointment",
  "supplement",
  "pregnancy_week",
]);

export const contentStatusEnum = pgEnum("content_status", ["draft", "review", "published", "archived"]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
};

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => ({
    emailIdx: uniqueIndex("users_email_idx").on(table.email),
  }),
);

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    refreshTokenHash: text("refresh_token_hash").notNull(),
    userAgent: text("user_agent"),
    ipAddress: text("ip_address"),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => ({
    userIdx: index("sessions_user_idx").on(table.userId),
    refreshHashIdx: uniqueIndex("sessions_refresh_hash_idx").on(table.refreshTokenHash),
  }),
);

export const emailVerificationTokens = pgTable(
  "email_verification_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => ({
    tokenHashIdx: uniqueIndex("email_verification_tokens_hash_idx").on(table.tokenHash),
  }),
);

export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => ({
    tokenHashIdx: uniqueIndex("password_reset_tokens_hash_idx").on(table.tokenHash),
  }),
);

export const userConsents = pgTable(
  "user_consents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    healthDataStorage: boolean("health_data_storage").default(false).notNull(),
    reminderNotifications: boolean("reminder_notifications").default(false).notNull(),
    anonymousAnalytics: boolean("anonymous_analytics").default(false).notNull(),
    acceptedPrivacyVersion: text("accepted_privacy_version").notNull(),
    acceptedTermsVersion: text("accepted_terms_version").notNull(),
    ...timestamps,
  },
  (table) => ({
    userIdx: index("user_consents_user_idx").on(table.userId),
  }),
);

export const userPreferences = pgTable(
  "user_preferences",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    goal: userGoalEnum("goal").default("track_cycle").notNull(),
    timezone: text("timezone").default("Europe/London").notNull(),
    units: text("units").default("metric").notNull(),
    ...timestamps,
  },
  (table) => ({
    userIdx: uniqueIndex("user_preferences_user_idx").on(table.userId),
  }),
);

export const cycleProfiles = pgTable(
  "cycle_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    goal: userGoalEnum("goal").default("track_cycle").notNull(),
    lastPeriodStartDate: date("last_period_start_date"),
    averageCycleLength: integer("average_cycle_length").default(28).notNull(),
    averagePeriodLength: integer("average_period_length").default(5).notNull(),
    ...timestamps,
  },
  (table) => ({
    userIdx: uniqueIndex("cycle_profiles_user_idx").on(table.userId),
  }),
);

export const periodLogs = pgTable(
  "period_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    startDate: date("start_date").notNull(),
    endDate: date("end_date"),
    flow: flowEnum("flow"),
    notes: text("notes"),
    ...timestamps,
  },
  (table) => ({
    userStartIdx: index("period_logs_user_start_idx").on(table.userId, table.startDate),
  }),
);

export const symptomLogs = pgTable(
  "symptom_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    loggedAt: timestamp("logged_at", { withTimezone: true }).defaultNow().notNull(),
    category: symptomCategoryEnum("category").notNull(),
    intensity: integer("intensity").default(0).notNull(),
    notes: text("notes"),
    ...timestamps,
  },
  (table) => ({
    userLoggedAtIdx: index("symptom_logs_user_logged_at_idx").on(table.userId, table.loggedAt),
  }),
);

export const pregnancyProfiles = pgTable(
  "pregnancy_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    calculationMethod: pregnancyCalculationMethodEnum("calculation_method").notNull(),
    referenceDate: date("reference_date").notNull(),
    estimatedDueDate: date("estimated_due_date").notNull(),
    careProviderName: text("care_provider_name"),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => ({
    userIdx: uniqueIndex("pregnancy_profiles_user_idx").on(table.userId),
  }),
);

export const pregnancySymptomLogs = pgTable(
  "pregnancy_symptom_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    pregnancyProfileId: uuid("pregnancy_profile_id")
      .notNull()
      .references(() => pregnancyProfiles.id, { onDelete: "cascade" }),
    loggedAt: timestamp("logged_at", { withTimezone: true }).defaultNow().notNull(),
    category: symptomCategoryEnum("category").notNull(),
    intensity: integer("intensity").default(0).notNull(),
    notes: text("notes"),
    ...timestamps,
  },
  (table) => ({
    pregnancyLoggedAtIdx: index("pregnancy_symptom_logs_profile_logged_idx").on(
      table.pregnancyProfileId,
      table.loggedAt,
    ),
  }),
);

export const appointments = pgTable(
  "appointments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }).notNull(),
    location: text("location"),
    notes: text("notes"),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => ({
    userScheduledIdx: index("appointments_user_scheduled_idx").on(table.userId, table.scheduledAt),
  }),
);

export const reminders = pgTable(
  "reminders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: reminderTypeEnum("type").notNull(),
    title: text("title").notNull(),
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }).notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}).notNull(),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    canceledAt: timestamp("canceled_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => ({
    userScheduledIdx: index("reminders_user_scheduled_idx").on(table.userId, table.scheduledAt),
  }),
);

export const pushTokens = pgTable(
  "push_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull(),
    platform: text("platform").notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => ({
    tokenIdx: uniqueIndex("push_tokens_token_idx").on(table.token),
    userIdx: index("push_tokens_user_idx").on(table.userId),
  }),
);

export const contentArticles = pgTable(
  "content_articles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    category: text("category").notNull(),
    body: text("body").notNull(),
    readingMinutes: integer("reading_minutes").default(3).notNull(),
    status: contentStatusEnum("status").default("draft").notNull(),
    reviewer: text("reviewer"),
    lastReviewedAt: timestamp("last_reviewed_at", { withTimezone: true }),
    sources: jsonb("sources").$type<string[]>().default([]).notNull(),
    ...timestamps,
  },
  (table) => ({
    slugIdx: uniqueIndex("content_articles_slug_idx").on(table.slug),
    categoryIdx: index("content_articles_category_idx").on(table.category),
  }),
);

export const pregnancyWeekContent = pgTable(
  "pregnancy_week_content",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    week: integer("week").notNull(),
    title: text("title").notNull(),
    babySummary: text("baby_summary").notNull(),
    bodyChanges: text("body_changes").notNull(),
    checklist: jsonb("checklist").$type<string[]>().default([]).notNull(),
    status: contentStatusEnum("status").default("draft").notNull(),
    reviewer: text("reviewer"),
    lastReviewedAt: timestamp("last_reviewed_at", { withTimezone: true }),
    sources: jsonb("sources").$type<string[]>().default([]).notNull(),
    ...timestamps,
  },
  (table) => ({
    weekIdx: uniqueIndex("pregnancy_week_content_week_idx").on(table.week),
  }),
);

export const dataExportRequests = pgTable(
  "data_export_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: text("status").default("pending").notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => ({
    userIdx: index("data_export_requests_user_idx").on(table.userId),
  }),
);

export const accountDeletionRequests = pgTable(
  "account_deletion_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: text("status").default("pending").notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => ({
    userIdx: index("account_deletion_requests_user_idx").on(table.userId),
  }),
);

export const auditEvents = pgTable(
  "audit_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userCreatedIdx: index("audit_events_user_created_idx").on(table.userId, table.createdAt),
  }),
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type CycleProfile = typeof cycleProfiles.$inferSelect;
export type PeriodLog = typeof periodLogs.$inferSelect;
export type SymptomLog = typeof symptomLogs.$inferSelect;
export type PregnancyProfile = typeof pregnancyProfiles.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;
