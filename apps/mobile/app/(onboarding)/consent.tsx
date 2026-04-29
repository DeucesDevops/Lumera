import { router } from "expo-router";
import { Alert, Pressable, Text, View } from "react-native";
import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { useApiMutation } from "@/lib/api-hooks";
import { useAuth } from "@/lib/auth";
import { useOnboarding } from "@/lib/onboarding";

const options = [
  ["health", "Store cycle and pregnancy logs for my account"],
  ["notifications", "Send reminder notifications"],
  ["analytics", "Share anonymous product usage events"],
] as const;

export default function ConsentScreen() {
  const { accessToken, isDemo } = useAuth();
  const { consent, setConsent } = useOnboarding();
  const consentMutation = useApiMutation<
    { consent: unknown },
    {
      healthDataStorage: boolean;
      reminderNotifications: boolean;
      anonymousAnalytics: boolean;
      acceptedPrivacyVersion: string;
      acceptedTermsVersion: string;
    }
  >("/me/consents");

  async function handleContinue() {
    if (!accessToken || isDemo) {
      router.push("/(onboarding)/cycle");
      return;
    }

    try {
      await consentMutation.mutateAsync({
        healthDataStorage: consent.health,
        reminderNotifications: consent.notifications,
        anonymousAnalytics: consent.analytics,
        acceptedPrivacyVersion: "2026-04-28",
        acceptedTermsVersion: "2026-04-28",
      });
      router.push("/(onboarding)/cycle");
    } catch (error) {
      Alert.alert("Could not save privacy choices", error instanceof Error ? error.message : "Please try again.");
    }
  }

  return (
    <Screen>
      <View className="pt-8">
        <Text className="text-sm font-semibold text-teal">Privacy 2/4</Text>
        <Text className="mt-3 text-3xl font-bold text-plum">Your health data is sensitive.</Text>
        <Text className="mt-3 text-base leading-6 text-ink/60">Choose what Lumera can store and use. You can export or delete your data from Profile.</Text>
      </View>

      <View className="mt-8 gap-3">
        {options.map(([key, label]) => (
          <Pressable
            key={key}
            className="flex-row items-center gap-3 rounded-ui border border-rose/10 bg-cream p-4"
            onPress={() => setConsent({ ...consent, [key]: !consent[key] })}
          >
            <View className={`h-6 w-6 items-center justify-center rounded-ui border ${consent[key] ? "border-berry bg-berry" : "border-ink/20"}`}>
              {consent[key] ? <Text className="font-bold text-white">✓</Text> : null}
            </View>
            <Text className="flex-1 text-base leading-6 text-ink">{label}</Text>
          </Pressable>
        ))}
      </View>

      <View className="mt-8">
        <Button loading={consentMutation.isPending} onPress={handleContinue}>
          Continue
        </Button>
      </View>
    </Screen>
  );
}
