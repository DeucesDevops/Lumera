import { createContext, PropsWithChildren, useContext, useMemo, useState } from "react";
import type { Goal } from "./types";

type ConsentState = {
  health: boolean;
  notifications: boolean;
  analytics: boolean;
};

type OnboardingState = {
  goal: Goal;
  setGoal: (goal: Goal) => void;
  consent: ConsentState;
  setConsent: (consent: ConsentState) => void;
  periodLength: number;
  setPeriodLength: (value: number) => void;
  cycleLength: number;
  setCycleLength: (value: number) => void;
  lastPeriodStartDate: string;
  pregnancyMethod: "last_period" | "due_date" | "conception_date";
  setPregnancyMethod: (method: "last_period" | "due_date" | "conception_date") => void;
  provider: string;
  setProvider: (provider: string) => void;
};

const OnboardingContext = createContext<OnboardingState | null>(null);

export function OnboardingProvider({ children }: PropsWithChildren) {
  const [goal, setGoal] = useState<Goal>("pregnant");
  const [consent, setConsent] = useState<ConsentState>({ health: true, notifications: false, analytics: false });
  const [periodLength, setPeriodLength] = useState(5);
  const [cycleLength, setCycleLength] = useState(28);
  const [pregnancyMethod, setPregnancyMethod] = useState<"last_period" | "due_date" | "conception_date">("last_period");
  const [provider, setProvider] = useState("");

  const value = useMemo<OnboardingState>(
    () => ({
      goal,
      setGoal,
      consent,
      setConsent,
      periodLength,
      setPeriodLength,
      cycleLength,
      setCycleLength,
      lastPeriodStartDate: "2026-04-12",
      pregnancyMethod,
      setPregnancyMethod,
      provider,
      setProvider,
    }),
    [consent, cycleLength, goal, periodLength, pregnancyMethod, provider],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider.");
  }

  return context;
}
