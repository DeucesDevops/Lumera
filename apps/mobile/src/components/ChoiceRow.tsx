import { ChevronRight } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

type ChoiceRowProps = {
  title: string;
  subtitle?: string;
  selected?: boolean;
  onPress?: () => void;
};

export function ChoiceRow({ title, subtitle, selected, onPress }: ChoiceRowProps) {
  return (
    <Pressable
      className={`flex-row items-center justify-between rounded-ui border p-4 ${
        selected ? "border-rose bg-petal" : "border-ink/10 bg-cream"
      }`}
      onPress={onPress}
    >
      <View className="flex-1 pr-3">
        <Text className="text-base font-semibold text-ink">{title}</Text>
        {subtitle ? <Text className="mt-1 text-sm leading-5 text-ink/60">{subtitle}</Text> : null}
      </View>
      <ChevronRight size={20} color={selected ? "#A23D72" : "#357C7C"} />
    </Pressable>
  );
}
