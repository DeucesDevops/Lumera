import { router } from "expo-router";
import { Alert, Text, View } from "react-native";
import { Button } from "@/components/Button";
import { ChoiceRow } from "@/components/ChoiceRow";
import { Screen } from "@/components/Screen";
import { useApiMutation } from "@/lib/api-hooks";
import { useAuth } from "@/lib/auth";
import { useOnboarding } from "@/lib/onboarding";
import type { Goal } from "@/lib/types";

const goals = [
  ["track_cycle", "Track my cycle", "Period predictions, symptoms, and history."],
  ["trying_to_conceive", "Trying to conceive", "Cycle insights and fertile-window estimates."],
  ["pregnant", "I am pregnant", "Week-by-week guidance and appointments."],
  ["postpartum", "Postpartum support", "Recovery support coming after the MVP."],
] as const;

export default function GoalScreen() {
  const { accessToken, isDemo } = useAuth();
  const { goal, setGoal } = useOnboarding();
  const preferencesMutation = useApiMutation<{ preferences: unknown }, { goal: Goal; timezone: string; units: "metric" }>(
    "/me/preferences",
    "PUT",
  );

  async function handleContinue() {
    if (!accessToken || isDemo) {
      router.push("/(onboarding)/consent");
      return;
    }

    try {
      await preferencesMutation.mutateAsync({
        goal,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/London",
        units: "metric",
      });
      router.push("/(onboarding)/consent");
    } catch (error) {
      Alert.alert("Could not save your goal", error instanceof Error ? error.message : "Please try again.");
    }
  }

  return (
    <Screen>
      <View className="pt-8">
        <Text className="text-sm font-semibold text-berry">Setup 1/4</Text>
        <Text className="mt-3 text-3xl font-bold text-plum">What brings you to Lumera?</Text>
      </View>

      <View className="mt-8 gap-3">
        {goals.map(([value, title, subtitle]) => (
          <ChoiceRow key={value} title={title} subtitle={subtitle} selected={goal === value} onPress={() => setGoal(value)} />
        ))}
      </View>

      <View className="mt-8">
        <Button loading={preferencesMutation.isPending} onPress={handleContinue}>
          Continue
        </Button>
      </View>
    </Screen>
  );
}
