import { Link, router } from "expo-router";
import { HeartPulse } from "lucide-react-native";
import { Text, View } from "react-native";
import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { useAuth } from "@/lib/auth";

export default function WelcomeScreen() {
  const { continueAsDemo } = useAuth();

  return (
    <Screen scroll={false}>
      <View className="flex-1 justify-between py-6">
        <View>
          <View className="mb-10 h-16 w-16 items-center justify-center rounded-ui bg-petal">
            <HeartPulse size={30} color="#A23D72" />
          </View>
          <Text className="text-5xl font-bold text-plum">Lumera</Text>
          <Text className="mt-5 text-xl leading-8 text-ink/70">
            Cycle and pregnancy support that keeps your private health data at the center.
          </Text>
          <View className="mt-8 flex-row gap-2">
            <View className="h-2 flex-1 rounded-ui bg-rose" />
            <View className="h-2 flex-1 rounded-ui bg-teal" />
            <View className="h-2 flex-1 rounded-ui bg-amber" />
            <View className="h-2 flex-1 rounded-ui bg-lavender" />
          </View>
        </View>

        <View className="gap-3">
          <Button onPress={() => router.push("/(auth)/signup")}>Create account</Button>
          <Link href="/(auth)/login" asChild>
            <Button variant="secondary">Log in</Button>
          </Link>
          <Button
            variant="ghost"
            onPress={() => {
              continueAsDemo();
              router.replace("/(tabs)");
            }}
          >
            Preview demo
          </Button>
          <Text className="text-center text-xs leading-5 text-ink/50">
            Lumera is for education and tracking. It does not replace professional medical care.
          </Text>
        </View>
      </View>
    </Screen>
  );
}
