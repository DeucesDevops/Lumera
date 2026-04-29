export const pregnancyWeekContent = Array.from({ length: 40 }, (_, index) => {
  const week = index + 1;

  return {
    week,
    title: `Week ${week}`,
    babySummary:
      week < 13
        ? "Early development is moving quickly while your body adjusts to pregnancy."
        : week < 28
          ? "Growth, movement, and body changes become more noticeable through this trimester."
          : "Baby is continuing to grow while you prepare for birth and postpartum recovery.",
    bodyChanges:
      "Symptoms vary widely. Track what feels important and contact your provider if something feels severe, sudden, or worrying.",
    checklist: [
      "Log symptoms you want to discuss",
      "Review upcoming appointments",
      "Write down one question for your care provider",
    ],
  };
});
