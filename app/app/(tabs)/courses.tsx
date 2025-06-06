import { useTheme } from "@/hooks/use-theme";
import { View, Text } from "react-native";

export default function Courses() {
  const theme = useTheme();
  return (
    <View style={{ backgroundColor: theme.background, flex: 1 }}>
      <Text>Courses</Text>
    </View>
  );
}