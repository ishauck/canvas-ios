import { useColorScheme } from "react-native";
import { THEME } from "@/constants/color";

export function useTheme() {
  const colorScheme = useColorScheme();
  return THEME[colorScheme || 'light'];
}