import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function Access() {
  const { domain } = useLocalSearchParams();

  return (
    <View>
      <Text>Access {domain}</Text>
    </View>
  );
}