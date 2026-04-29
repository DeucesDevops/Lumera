import { router } from "expo-router";
import { Bell, Download, LogOut, Shield, Trash2, UserRound } from "lucide-react-native";
import { Alert, Pressable, Text, View } from "react-native";
import { InfoCard } from "@/components/InfoCard";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { apiRequest } from "@/lib/api";
import { useApiMutation, useApiQuery } from "@/lib/api-hooks";
import { useAuth } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import type { ExportResponse, UserProfileResponse } from "@/lib/types";

function ProfileRow({ label, icon: Icon, danger, onPress }: { label: string; icon: typeof UserRound; danger?: boolean; onPress?: () => void }) {
  return (
    <Pressable className={`flex-row items-center gap-3 rounded-ui p-4 ${danger ? "bg-petal" : "bg-cream"}`} onPress={onPress}>
      <View className={`h-9 w-9 items-center justify-center rounded-ui ${danger ? "bg-blush" : "bg-lilac"}`}>
        <Icon size={18} color={danger ? "#A23D72" : "#4A294F"} />
      </View>
      <Text className={`flex-1 text-base font-semibold ${danger ? "text-berry" : "text-ink"}`}>{label}</Text>
      <Text className="text-lg text-ink/40">›</Text>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const { accessToken, isDemo, user, logout } = useAuth();
  const profileQuery = useApiQuery<UserProfileResponse>(["me"], "/me");
  const deleteMutation = useApiMutation<void, undefined>("/me/delete", "DELETE");
  const profile = profileQuery.data;

  async function handleExport() {
    if (!accessToken || isDemo) {
      Alert.alert("Demo profile", "Create or log in to an account to export backend data.");
      return;
    }

    try {
      const response = await apiRequest<ExportResponse>("/me/export", { accessToken });
      Alert.alert("Export ready", `Backend archive includes ${Object.keys(response.archive).length} data groups.`);
    } catch (error) {
      Alert.alert("Could not export data", error instanceof Error ? error.message : "Please try again.");
    }
  }

  function handleDelete() {
    if (!accessToken || isDemo) {
      Alert.alert("Demo profile", "Create or log in to an account to delete backend data.");
      return;
    }

    Alert.alert("Delete account?", "This will request account deletion in the backend.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteMutation.mutateAsync(undefined);
            await logout();
            router.replace("/(auth)");
          } catch (error) {
            Alert.alert("Could not delete account", error instanceof Error ? error.message : "Please try again.");
          }
        },
      },
    ]);
  }

  return (
    <Screen>
      <View className="pt-4">
        <Text className="text-3xl font-bold text-plum">Profile</Text>
        <Text className="mt-1 text-sm text-ink/50">{profile?.user.email ?? user?.email ?? "Not signed in"}</Text>
      </View>

      <InfoCard className="mt-6" title={profile?.preferences?.goal?.replaceAll("_", " ") ?? "Backend profile"} tone="lavender">
        <Text className="text-base leading-6 text-ink/65">
          {profile?.user.createdAt ? `Account created ${formatDate(profile.user.createdAt.slice(0, 10))}` : "Profile details sync after login."}
        </Text>
        <Text className="mt-2 text-sm text-ink/55">
          Consent: {profile?.latestConsent?.healthDataStorage ? "health data storage enabled" : "not saved yet"}
        </Text>
      </InfoCard>

      <SectionHeader title="Account" />
      <View className="gap-3">
        <ProfileRow label="Health profile" icon={UserRound} />
        <ProfileRow label="Notification settings" icon={Bell} />
        <ProfileRow label="Privacy and consent" icon={Shield} />
        <ProfileRow label="Export my data" icon={Download} onPress={handleExport} />
        <ProfileRow label={deleteMutation.isPending ? "Deleting..." : "Delete account"} icon={Trash2} danger onPress={handleDelete} />
      </View>

      <SectionHeader title="App" />
      <InfoCard title="Medical disclaimer" tone="teal">
        <Text className="text-base leading-6 text-ink/65">
          Lumera supports tracking and education. It does not diagnose, treat, or replace your care provider.
        </Text>
      </InfoCard>

      <View className="mt-6">
        <Pressable
          className="min-h-12 flex-row items-center justify-center gap-2 rounded-ui bg-plum px-5"
          onPress={async () => {
            await logout();
            router.replace("/(auth)");
          }}
        >
          <LogOut size={18} color="#fff" />
          <Text className="text-base font-semibold text-white">Log out</Text>
        </Pressable>
      </View>
    </Screen>
  );
}
