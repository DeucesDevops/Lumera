import { Text, TextInput, TextInputProps, View } from "react-native";

type FieldProps = TextInputProps & {
  label: string;
  error?: string;
};

export function Field({ label, error, ...props }: FieldProps) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold text-ink">{label}</Text>
      <TextInput
        className="min-h-12 rounded-ui border border-rose/15 bg-cream px-4 text-base text-ink"
        placeholderTextColor="#8F7B8E"
        autoCapitalize="none"
        {...props}
      />
      {error ? <Text className="text-sm text-berry">{error}</Text> : null}
    </View>
  );
}
