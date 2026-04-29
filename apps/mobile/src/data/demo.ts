export const cycleQuickLogs = ["Period", "Symptom", "Note"];

export const todaySymptoms = [
  { label: "Mood", value: "Calm" },
  { label: "Pain", value: "None" },
  { label: "Sleep", value: "7h" },
];

export const pregnancyTasks = [
  "Ask about screening results",
  "Refill prenatal vitamins",
  "Write down one provider question",
];

export const pregnancyWeeks = [
  { week: 13, status: "Completed" },
  { week: 14, status: "Current" },
  { week: 15, status: "Coming up" },
  { week: 16, status: "Coming up" },
];

export const learnArticles = [
  { title: "Week 14: what to expect", category: "Pregnancy", minutes: 4 },
  { title: "Questions for appointments", category: "Care", minutes: 3 },
  { title: "Prenatal vitamins basics", category: "Pregnancy", minutes: 3 },
  { title: "When to seek urgent care", category: "Safety", minutes: 4 },
];

export const calendarDays = Array.from({ length: 30 }, (_, index) => {
  const day = index + 1;
  return {
    day,
    period: day >= 12 && day <= 16,
    fertile: day >= 22 && day <= 27,
    selected: day === 16,
  };
});
