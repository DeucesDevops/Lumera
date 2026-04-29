import { Text, View } from "react-native";

type SectionHeaderProps = {
  title: string;
  action?: string;
};

export function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <View className="mb-3 mt-6 flex-row items-center justify-between">
      <Text className="text-lg font-semibold text-ink">{title}</Text>
      {action ? <Text className="text-sm font-semibold text-berry">{action}</Text> : null}
    </View>
  );
}
