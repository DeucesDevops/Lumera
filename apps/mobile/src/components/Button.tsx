import { ReactNode } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

type ButtonProps = {
  children: ReactNode;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "teal";
  loading?: boolean;
  disabled?: boolean;
};

const variants = {
  primary: "bg-berry",
  secondary: "bg-petal border border-rose/25",
  ghost: "bg-transparent",
  teal: "bg-teal",
};

const textVariants = {
  primary: "text-white",
  secondary: "text-ink",
  ghost: "text-berry",
  teal: "text-white",
};

export function Button({ children, onPress, variant = "primary", loading, disabled }: ButtonProps) {
  return (
    <Pressable
      className={`min-h-12 items-center justify-center rounded-ui px-5 ${variants[variant]} ${disabled ? "opacity-50" : ""}`}
      disabled={disabled || loading}
      onPress={onPress}
    >
      <View className="flex-row items-center gap-2">
        {loading ? <ActivityIndicator color={variant === "ghost" || variant === "secondary" ? "#271D2A" : "#fff"} /> : null}
        <Text className={`text-base font-semibold ${textVariants[variant]}`}>{children}</Text>
      </View>
    </Pressable>
  );
}
