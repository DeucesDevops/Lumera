import { ChevronRight } from "lucide-react-native";
import { Text, View } from "react-native";
import { InfoCard } from "@/components/InfoCard";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { pregnancyWeeks } from "@/data/demo";
import { useApiQuery } from "@/lib/api-hooks";
import { formatDate, formatDateTime } from "@/lib/format";
import type { AppointmentsResponse, PregnancyProfileResponse, PregnancyWeeksResponse } from "@/lib/types";

export default function PregnancyScreen() {
  const profileQuery = useApiQuery<PregnancyProfileResponse>(["pregnancy", "profile"], "/pregnancy/profile");
  const weeksQuery = useApiQuery<PregnancyWeeksResponse>(["pregnancy", "weeks"], "/pregnancy/weeks");
  const appointmentsQuery = useApiQuery<AppointmentsResponse>(["appointments"], "/appointments");
  const profile = profileQuery.data?.profile;
  const weeks = weeksQuery.data?.weeks?.length ? weeksQuery.data.weeks.slice(0, 6) : pregnancyWeeks;
  const nextAppointment = appointmentsQuery.data?.appointments[0];
  const progress = profile ? Math.min(100, Math.max(2, (profile.currentWeek / 40) * 100)) : 35;

  return (
    <Screen>
      <View className="pt-4">
        <Text className="text-3xl font-bold text-plum">Pregnancy</Text>
        <Text className="mt-1 text-sm text-ink/50">Due date: {profile ? formatDate(profile.estimatedDueDate) : "Finish setup to calculate"}</Text>
      </View>

      <InfoCard
        className="mt-6"
        title={profile ? `Week ${profile.currentWeek} of 40` : "Week-by-week setup"}
        eyebrow={profile?.currentWeek && profile.currentWeek >= 13 ? "Second trimester" : "First trimester"}
        tone="lavender"
      >
        <View className="mt-2 h-3 overflow-hidden rounded-ui bg-cream">
          <View className="h-3 rounded-ui bg-rose" style={{ width: `${progress}%` }} />
        </View>
        <Text className="mt-3 text-sm leading-5 text-ink/60">Trimester progress is approximate and should match your provider's dating.</Text>
      </InfoCard>

      <SectionHeader title="Timeline" />
      <View className="gap-3">
        {weeks.map((item) => (
          <InfoCard
            key={item.week}
            tone={item.status === "current" || item.status === "Current" ? "rose" : item.status === "completed" || item.status === "Completed" ? "teal" : "plain"}
          >
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-base font-semibold text-ink">Week {item.week}</Text>
                <Text className="mt-1 text-sm text-ink/55">
                  {item.status}
                  {"title" in item ? ` · ${item.title}` : ""}
                </Text>
              </View>
              <ChevronRight size={20} color="#A23D72" />
            </View>
          </InfoCard>
        ))}
      </View>

      <SectionHeader title="Next appointment" />
      <InfoCard title={nextAppointment?.title ?? "No appointment scheduled"} tone="amber">
        <Text className="text-base text-ink/60">{nextAppointment ? formatDateTime(nextAppointment.scheduledAt) : "Add one from the API or upcoming appointment flow."}</Text>
        <Text className="mt-3 text-sm font-semibold text-amber">{nextAppointment?.location ?? "Questions ready"}</Text>
      </InfoCard>
    </Screen>
  );
}
