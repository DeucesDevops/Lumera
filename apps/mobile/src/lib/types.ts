export type Goal = "track_cycle" | "trying_to_conceive" | "pregnant" | "postpartum";

export type UserProfileResponse = {
  user: {
    id: string;
    email: string;
    emailVerifiedAt: string | null;
    createdAt: string;
  };
  preferences: {
    goal: Goal;
    timezone: string;
    units: string;
  } | null;
  latestConsent: {
    healthDataStorage: boolean;
    reminderNotifications: boolean;
    anonymousAnalytics: boolean;
  } | null;
};

export type CyclePredictionsResponse = {
  predictions: {
    cycleDay: number | null;
    nextPeriodStartDate: string | null;
    nextPeriodEndDate: string | null;
    fertileWindowStartDate: string | null;
    fertileWindowEndDate: string | null;
    ovulationEstimateDate: string | null;
  };
};

export type PeriodLogsResponse = {
  periods: Array<{
    id: string;
    startDate: string;
    endDate: string | null;
    flow: "light" | "medium" | "heavy" | null;
    notes: string | null;
  }>;
};

export type PregnancyProfileResponse = {
  profile: {
    id: string;
    calculationMethod: "last_period" | "due_date" | "conception_date";
    referenceDate: string;
    estimatedDueDate: string;
    careProviderName: string | null;
    currentWeek: number;
  } | null;
};

export type PregnancyWeeksResponse = {
  weeks: Array<{
    week: number;
    title: string;
    babySummary: string;
    bodyChanges: string;
    checklist: string[];
    status: "completed" | "current" | "upcoming";
  }>;
};

export type AppointmentsResponse = {
  appointments: Array<{
    id: string;
    title: string;
    scheduledAt: string;
    location: string | null;
    notes: string | null;
  }>;
};

export type ArticlesResponse = {
  articles: Array<{
    slug: string;
    title: string;
    category: string;
    readingMinutes: number;
    summary: string;
  }>;
};

export type ExportResponse = {
  archive: Record<string, unknown>;
};
