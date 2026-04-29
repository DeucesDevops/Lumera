import { router } from "expo-router";
import { Alert, Text, View } from "react-native";
import { Button } from "@/components/Button";
import { ChoiceRow } from "@/components/ChoiceRow";
import { Field } from "@/components/Field";
import { InfoCard } from "@/components/InfoCard";
import { Screen } from "@/components/Screen";
import { useApiMutation } from "@/lib/api-hooks";
import { useAuth } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { useOnboarding } from "@/lib/onboarding";

type PregnancyMethod = "last_period" | "due_date" | "conception_date";

export default function PregnancySetupScreen() {
  const { accessToken, isDemo } = useAuth();
  const { lastPeriodStartDate, pregnancyMethod, provider, setPregnancyMethod, setProvider } = useOnboarding();
  const pregnancyMutation = useApiMutation<
    { profile: unknown },
    { calculationMethod: PregnancyMethod; referenceDate: string; careProviderName?: string }
  >("/pregnancy/profile", "PUT");

  async function handleFinish() {
    if (!accessToken || isDemo) {
      router.replace("/(tabs)");
      return;
    }

    try {
      await pregnancyMutation.mutateAsync({
        calculationMethod: pregnancyMethod,
        referenceDate: lastPeriodStartDate,
        careProviderName: provider.trim() || undefined,
      });
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Could not save pregnancy setup", error instanceof Error ? error.message : "Please try again.");
    }
  }

  return (
    <Screen>
      <View className="pt-8">
        <Text className="text-sm font-semibold text-berry">Pregnancy setup 4/4</Text>
        <Text className="mt-3 text-3xl font-bold text-plum">How should we calculate?</Text>
      </View>

      <View className="mt-8 gap-3">
        <ChoiceRow title="Last menstrual period" selected={pregnancyMethod === "last_period"} onPress={() => setPregnancyMethod("last_period")} />
        <ChoiceRow title="Due date" selected={pregnancyMethod === "due_date"} onPress={() => setPregnancyMethod("due_date")} />
        <ChoiceRow title="Conception date" selected={pregnancyMethod === "conception_date"} onPress={() => setPregnancyMethod("conception_date")} />
      </View>

      <View className="mt-6 gap-5">
        <InfoCard title="Reference date" tone="lavender">
          <Text className="text-base font-semibold text-ink">{formatDate(lastPeriodStartDate)}</Text>
          <Text className="mt-1 text-sm text-ink/60">Date picker will connect here.</Text>
        </InfoCard>
        <Field label="Care provider" value={provider} onChangeText={setProvider} placeholder="Optional name" />
      </View>

      <View className="mt-8">
        <Button loading={pregnancyMutation.isPending} onPress={handleFinish}>
          Finish setup
        </Button>
      </View>
    </Screen>
  );
}
