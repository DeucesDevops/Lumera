import { Bell, CalendarPlus, CircleHelp, Pill, Plus } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { InfoCard } from "@/components/InfoCard";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { pregnancyTasks, todaySymptoms } from "@/data/demo";
import { useApiQuery } from "@/lib/api-hooks";
import { useAuth } from "@/lib/auth";
import { formatDate, formatDateRange } from "@/lib/format";
import type { AppointmentsResponse, CyclePredictionsResponse, PregnancyProfileResponse, PregnancyWeeksResponse } from "@/lib/types";

const quickActions = {
  Symptom: { iconBg: "bg-petal", color: "#A23D72" },
  Appointment: { iconBg: "bg-aqua", color: "#357C7C" },
  Question: { iconBg: "bg-lilac", color: "#4A294F" },
  Reminder: { iconBg: "bg-honey", color: "#D79A2B" },
};

function QuickAction({ label, icon: Icon }: { label: keyof typeof quickActions; icon: typeof Plus }) {
  const action = quickActions[label];

  return (
    <Pressable className="min-h-24 flex-1 items-center justify-center gap-3 rounded-ui border border-white/80 bg-cream p-3">
      <View className={`h-11 w-11 items-center justify-center rounded-ui ${action.iconBg}`}>
        <Icon size={22} color={action.color} />
      </View>
      <Text className="text-center text-sm font-semibold text-ink">{label}</Text>
    </Pressable>
  );
}

export default function TodayScreen() {
  const { isDemo } = useAuth();
  const pregnancyProfileQuery = useApiQuery<PregnancyProfileResponse>(["pregnancy", "profile"], "/pregnancy/profile");
  const predictionsQuery = useApiQuery<CyclePredictionsResponse>(["cycle", "predictions"], "/cycle/predictions");
  const weeksQuery = useApiQuery<PregnancyWeeksResponse>(["pregnancy", "weeks"], "/pregnancy/weeks");
  const appointmentsQuery = useApiQuery<AppointmentsResponse>(["appointments"], "/appointments");
  const profile = pregnancyProfileQuery.data?.profile;
  const predictions = predictionsQuery.data?.predictions;
  const currentWeek = weeksQuery.data?.weeks.find((week) => week.status === "current");
  const nextAppointment = appointmentsQuery.data?.appointments[0];
  const tasks = currentWeek?.checklist?.length ? currentWeek.checklist.slice(0, 3) : pregnancyTasks;

  return (
    <Screen>
      <View className="flex-row items-center justify-between pt-4">
        <View>
          <Text className="text-3xl font-bold text-plum">Today</Text>
          <Text className="mt-1 text-sm text-ink/50">{isDemo ? "Demo workspace" : "Synced with your private backend"}</Text>
        </View>
        <View className="h-11 w-11 items-center justify-center rounded-ui bg-petal">
          <Bell size={20} color="#A23D72" />
        </View>
      </View>

      <View className="mt-6 rounded-ui bg-plum p-5">
        <Text className="mb-1 text-xs font-semibold uppercase tracking-wide text-blush">Pregnancy</Text>
        <Text className="mb-2 text-2xl font-semibold text-white">{profile ? `Week ${profile.currentWeek}` : "Setup ready"}</Text>
        <Text className="text-base leading-6 text-white/75">
          {profile
            ? `Estimated due date ${formatDate(profile.estimatedDueDate)}. ${currentWeek?.babySummary ?? "Week-by-week guidance will appear here."}`
            : "Finish setup to see week-by-week pregnancy guidance and due-date tracking."}
        </Text>
        <View className="mt-5 flex-row gap-2">
          <View className="h-2 w-16 rounded-ui bg-rose" />
          <View className="h-2 w-10 rounded-ui bg-amber" />
          <View className="h-2 w-8 rounded-ui bg-teal" />
        </View>
      </View>

      <SectionHeader title="Quick actions" />
      <View className="flex-row gap-3">
        <QuickAction label="Symptom" icon={Plus} />
        <QuickAction label="Appointment" icon={CalendarPlus} />
      </View>
      <View className="mt-3 flex-row gap-3">
        <QuickAction label="Question" icon={CircleHelp} />
        <QuickAction label="Reminder" icon={Pill} />
      </View>

      <SectionHeader title="Today's check-in" />
      <View className="gap-3">
        {predictions?.cycleDay ? (
          <InfoCard tone="teal">
            <View className="flex-row items-center justify-between">
              <Text className="text-base text-ink/60">Cycle day</Text>
              <Text className="text-base font-semibold text-ink">{predictions.cycleDay}</Text>
            </View>
          </InfoCard>
        ) : null}
        {todaySymptoms.map((item) => (
          <InfoCard key={item.label} tone={item.label === "Mood" ? "lavender" : item.label === "Pain" ? "rose" : "teal"}>
            <View className="flex-row items-center justify-between">
              <Text className="text-base text-ink/60">{item.label}</Text>
              <Text className="text-base font-semibold text-ink">{item.value}</Text>
            </View>
          </InfoCard>
        ))}
      </View>

      <SectionHeader title="This week" />
      <View className="gap-3">
        {tasks.map((task, index) => (
          <View key={task} className={`flex-row items-center gap-3 rounded-ui p-4 ${index === 1 ? "bg-honey" : "bg-mint"}`}>
            <View className={`h-5 w-5 rounded-ui border ${index === 1 ? "border-amber" : "border-sage"}`} />
            <Text className="flex-1 text-base leading-6 text-ink">{task}</Text>
          </View>
        ))}
        {predictions?.nextPeriodStartDate ? (
          <InfoCard title="Next period estimate" tone="rose">
            <Text className="text-base leading-6 text-ink/65">{formatDateRange(predictions.nextPeriodStartDate, predictions.nextPeriodEndDate)}</Text>
          </InfoCard>
        ) : null}
        {nextAppointment ? (
          <InfoCard title={nextAppointment.title} tone="amber">
            <Text className="text-base text-ink/60">{formatDate(nextAppointment.scheduledAt.slice(0, 10))}</Text>
          </InfoCard>
        ) : null}
      </View>
    </Screen>
  );
}
