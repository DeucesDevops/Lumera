import { router } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { Screen } from "@/components/Screen";
import { useAuth } from "@/lib/auth";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    try {
      await login(email, password);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Could not log in", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <View className="pt-10">
        <Text className="text-3xl font-bold text-plum">Welcome back</Text>
        <Text className="mt-3 text-base leading-6 text-ink/60">Log in to continue tracking your cycle and pregnancy journey.</Text>
      </View>

      <View className="mt-8 gap-5">
        <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="you@example.com" />
        <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="Your password" />
      </View>

      <View className="mt-8 gap-3">
        <Button loading={loading} onPress={handleLogin}>
          Log in
        </Button>
        <Button variant="ghost" onPress={() => router.back()}>
          Back
        </Button>
      </View>
    </Screen>
  );
}
