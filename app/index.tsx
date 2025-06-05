import { View, Text, useColorScheme } from "react-native";
import { CanvasLogo } from "@/components/CanvasLogo";
import { CANVAS_RED, THEME } from "@/constants/color";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TextInput from "@/components/TextInput";
import { ButtonWrapper, Button as RNButton } from "@/components/Button";

export default function Home() {
  const safeAreaInsets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = THEME[colorScheme || 'light'];

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <CanvasLogo width={100} height={100} color={colorScheme === 'dark' ? "#fff" : CANVAS_RED} />
        </View>
        <Text style={{ fontSize: 32, fontWeight: 'bold', marginVertical: 15, color: theme.text }}>Log In</Text>
        <View style={{ width: 300, flexDirection: 'column', gap: 10 }}>
          <TextInput
            placeholder="xyz.instructure.com"
            keyboardType="url"
            containerStyle={{ width: "100%", height: 48 }}
            inputStyle={{ backgroundColor: theme.surface, color: theme.text }} />
          <ButtonWrapper>
            <RNButton>
              <Text style={{ color: theme.buttonText, fontSize: 16, fontWeight: "bold" }}>Continue</Text>
            </RNButton>
          </ButtonWrapper>
        </View>
      </View>
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: safeAreaInsets.bottom,
      }}>
        <Text style={{ fontSize: 12, color: theme.muted, textAlign: 'center' }}>This app is not affiliated with Canvas LMS nor Instructure.</Text>
      </View>
    </View>
  );
}
