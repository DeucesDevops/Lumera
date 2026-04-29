import { router } from "expo-router";
import { Minus, Plus } from "lucide-react-native";
import { Alert, Pressable, Text, View } from "react-native";
import { Button } from "@/components/Button";
import { InfoCard } from "@/components/InfoCard";
import { Screen } from "@/components/Screen";
import { useApiMutation } from "@/lib/api-hooks";
import { useAuth } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { useOnboarding } from "@/lib/onboarding";
import type { Goal } from "@/lib/types";

function Stepper({ label, value, setValue }: { label: string; value: number; setValue: (value: number) => void }) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold text-ink">{label}</Text>
      <View className="flex-row items-center justify-between rounded-ui border border-ink/10 bg-white p-3">
        <Pressable className="h-10 w-10 items-center justify-center rounded-ui bg-peach" onPress={() => setValue(Math.max(1, value - 1))}>
          <Minus size={18} color="#211B1E" />
        </Pressable>
        <Text className="text-lg font-semibold text-ink">{value} days</Text>
        <Pressable className="h-10 w-10 items-center justify-center rounded-ui bg-petal" onPress={() => setValue(value + 1)}>
          <Plus size={18} color="#211B1E" />
        </Pressable>
      </View>
    </View>
  );
}

export default function CycleSetupScreen() {
  const { accessToken, isDemo } = useAuth();
  const { cycleLength, goal, lastPeriodStartDate, periodLength, setCycleLength, setPeriodLength } = useOnboarding();
  const cycleProfileMutation = useApiMutation<
    { profile: unknown },
    { goal: Goal; lastPeriodStartDate: string; averageCycleLength: number; averagePeriodLength: number }
  >("/cycle/profile", "PUT");
  const periodMutation = useApiMutation<
    { period: unknown },
    { startDate: string; endDate: string; flow: "light" | "medium" | "heavy"; notes?: string }
  >("/cycle/periods");
  const loading = cycleProfileMutation.isPending || periodMutation.isPending;

  function addDays(dateOnly: string, days: number) {
    const date = new Date(`${dateOnly}T00:00:00.000Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  }

  async function handleContinue() {
    if (!accessToken || isDemo) {
      router.push("/(onboarding)/pregnancy");
      return;
    }

    try {
      await cycleProfileMutation.mutateAsync({
        goal,
        lastPeriodStartDate,
        averageCycleLength: cycleLength,
        averagePeriodLength: periodLength,
      });
      await periodMutation.mutateAsync({
        startDate: lastPeriodStartDate,
        endDate: addDays(lastPeriodStartDate, periodLength - 1),
        flow: "medium",
      });
      router.push("/(onboarding)/pregnancy");
    } catch (error) {
      Alert.alert("Could not save cycle baseline", error instanceof Error ? error.message : "Please try again.");
    }
  }

  return (
    <Screen>
      <View className="pt-8">
        <Text className="text-sm font-semibold text-coral">Cycle setup 3/4</Text>
        <Text className="mt-3 text-3xl font-bold text-plum">Set your baseline.</Text>
      </View>

      <View className="mt-8 gap-5">
        <InfoCard title="Last period started" tone="rose">
          <Text className="text-base font-semibold text-ink">{formatDate(lastPeriodStartDate)}</Text>
          <Text className="mt-1 text-sm text-ink/60">Date picker will connect here.</Text>
        </InfoCard>
        <Stepper label="Period usually lasts" value={periodLength} setValue={setPeriodLength} />
        <Stepper label="Cycle usually lasts" value={cycleLength} setValue={setCycleLength} />
      </View>

      <View className="mt-8">
        <Button loading={loading} onPress={handleContinue}>
          Continue
        </Button>
      </View>
    </Screen>
  );
}
