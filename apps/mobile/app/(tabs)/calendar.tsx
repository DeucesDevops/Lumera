import { Plus } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { InfoCard } from "@/components/InfoCard";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { calendarDays } from "@/data/demo";
import { useApiQuery } from "@/lib/api-hooks";
import { formatDateRange, formatShortDate } from "@/lib/format";
import type { CyclePredictionsResponse, PeriodLogsResponse } from "@/lib/types";

const selectedDay = 28;

function dateOnly(day: number) {
  return `2026-04-${String(day).padStart(2, "0")}`;
}

function isBetween(value: string, start?: string | null, end?: string | null) {
  if (!start) {
    return false;
  }

  const stop = end ?? start;
  return value >= start && value <= stop;
}

export default function CalendarScreen() {
  const periodsQuery = useApiQuery<PeriodLogsResponse>(["cycle", "periods"], "/cycle/periods");
  const predictionsQuery = useApiQuery<CyclePredictionsResponse>(["cycle", "predictions"], "/cycle/predictions");
  const periods = periodsQuery.data?.periods;
  const predictions = predictionsQuery.data?.predictions;
  const days =
    periods || predictions
      ? Array.from({ length: 30 }, (_, index) => {
          const day = index + 1;
          const currentDate = dateOnly(day);
          return {
            day,
            period: periods?.some((period) => isBetween(currentDate, period.startDate, period.endDate)) ?? false,
            fertile: isBetween(currentDate, predictions?.fertileWindowStartDate, predictions?.fertileWindowEndDate),
            selected: day === selectedDay,
          };
        })
      : calendarDays;
  const selected = days.find((day) => day.selected);

  return (
    <Screen>
      <View className="flex-row items-center justify-between pt-4">
        <Text className="text-3xl font-bold text-plum">Calendar</Text>
        <Pressable className="h-11 w-11 items-center justify-center rounded-ui bg-berry">
          <Plus size={20} color="#fff" />
        </Pressable>
      </View>

      <View className="mt-6 flex-row items-center justify-between rounded-ui bg-peach px-4 py-3">
        <Text className="text-xl font-semibold text-ink">April 2026</Text>
        <Text className="text-sm font-semibold text-coral">Today</Text>
      </View>

      <View className="mt-5 flex-row justify-between">
        {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
          <Text key={`${day}-${index}`} className="w-10 text-center text-xs font-semibold text-ink/50">
            {day}
          </Text>
        ))}
      </View>

      <View className="mt-3 flex-row flex-wrap gap-y-3">
        {days.map((item) => (
          <View key={item.day} className="w-[14.285%] items-center">
            <View
              className={`h-10 w-10 items-center justify-center rounded-ui ${
                item.selected ? "bg-berry" : item.period ? "bg-petal" : item.fertile ? "bg-aqua" : "bg-cream"
              }`}
            >
              <Text className={`font-semibold ${item.selected ? "text-white" : "text-ink"}`}>{item.day}</Text>
            </View>
          </View>
        ))}
      </View>

      <SectionHeader title="Legend" />
      <View className="flex-row gap-3">
        <Text className="rounded-ui bg-petal px-3 py-2 text-sm font-semibold text-berry">Period</Text>
        <Text className="rounded-ui bg-aqua px-3 py-2 text-sm font-semibold text-teal">Fertile</Text>
        <Text className="rounded-ui bg-berry px-3 py-2 text-sm font-semibold text-white">Selected</Text>
      </View>

      <SectionHeader title="Selected day" />
      <InfoCard title="Apr 28" tone={selected?.period ? "rose" : selected?.fertile ? "teal" : "plain"}>
        <Text className="text-base leading-6 text-ink/65">
          {selected?.period
            ? "Period logged from your backend history."
            : selected?.fertile
              ? "Estimated fertile window from your cycle profile."
              : "No period or fertile-window estimate for this day."}
        </Text>
      </InfoCard>

      <SectionHeader title="Backend estimates" />
      <View className="gap-3">
        <InfoCard title="Next period" tone="rose">
          <Text className="text-base leading-6 text-ink/65">
            {formatDateRange(predictions?.nextPeriodStartDate, predictions?.nextPeriodEndDate)}
          </Text>
        </InfoCard>
        <InfoCard title="Fertile window" tone="teal">
          <Text className="text-base leading-6 text-ink/65">
            {formatDateRange(predictions?.fertileWindowStartDate, predictions?.fertileWindowEndDate)}
          </Text>
          {predictions?.ovulationEstimateDate ? (
            <Text className="mt-2 text-sm text-ink/55">Ovulation estimate: {formatShortDate(predictions.ovulationEstimateDate)}</Text>
          ) : null}
        </InfoCard>
      </View>
    </Screen>
  );
}
