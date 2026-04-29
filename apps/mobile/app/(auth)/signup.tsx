import { router } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { Screen } from "@/components/Screen";
import { useAuth } from "@/lib/auth";

export default function SignupScreen() {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    setLoading(true);
    try {
      await register(email, password);
      router.replace("/(onboarding)/goal");
    } catch (error) {
      Alert.alert("Could not create account", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <View className="pt-10">
        <Text className="text-3xl font-bold text-plum">Create account</Text>
        <Text className="mt-3 text-base leading-6 text-ink/60">Start with an email and password. You can choose privacy settings next.</Text>
      </View>

      <View className="mt-8 gap-5">
        <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="you@example.com" />
        <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="At least 8 characters" />
      </View>

      <View className="mt-8 gap-3">
        <Button loading={loading} onPress={handleSignup}>
          Continue
        </Button>
        <Button variant="ghost" onPress={() => router.back()}>
          Back
        </Button>
      </View>
    </Screen>
  );
}
