import { PropsWithChildren } from "react";
import { Text, View } from "react-native";

type InfoCardProps = PropsWithChildren<{
  title?: string;
  eyebrow?: string;
  className?: string;
  tone?: "plain" | "rose" | "teal" | "lavender" | "amber";
}>;

const toneClasses = {
  plain: "border-ink/10 bg-cream",
  rose: "border-rose/20 bg-petal",
  teal: "border-teal/15 bg-aqua",
  lavender: "border-plum/10 bg-lilac",
  amber: "border-amber/20 bg-honey",
};

const eyebrowClasses = {
  plain: "text-berry",
  rose: "text-berry",
  teal: "text-teal",
  lavender: "text-plum",
  amber: "text-amber",
};

export function InfoCard({ title, eyebrow, className = "", tone = "plain", children }: InfoCardProps) {
  return (
    <View className={`rounded-ui border p-4 ${toneClasses[tone]} ${className}`}>
      {eyebrow ? <Text className={`mb-1 text-xs font-semibold uppercase tracking-wide ${eyebrowClasses[tone]}`}>{eyebrow}</Text> : null}
      {title ? <Text className="mb-2 text-lg font-semibold text-ink">{title}</Text> : null}
      {children}
    </View>
  );
}
