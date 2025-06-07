import { useTheme } from "@/hooks/use-theme";
import { View, Text, Image, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import type { ViewStyle } from 'react-native';
import * as Application from 'expo-application';
import { Button, ButtonWrapper } from "@/components/Button";

export default function Settings() {
  const theme = useTheme();
  const version = Application.nativeApplicationVersion || "Unknown";

  // Move theme-dependent styles here
  const cardStyle: ViewStyle = {
    backgroundColor: theme.surface,
    borderRadius: 14,
    padding: 18,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.border,
  };

  return (
    <View style={{ backgroundColor: theme.background, flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 24, color: theme.text }}>Settings</Text>
      {/* App Version Card */}
      <View style={cardStyle}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Ionicons name="information-circle-outline" size={22} color={theme.muted} style={{ marginRight: 8 }} />
          <Text style={{ fontSize: 15, color: theme.muted, fontWeight: '600' }}>App Version</Text>
        </View>
        <Text style={{ fontSize: 18, fontWeight: "700", color: theme.text }}>{version}</Text>
      </View>
      {/* Accounts Card */}
      <View style={[cardStyle, { marginTop: 20 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Ionicons name="person-circle-outline" size={22} color={theme.muted} style={{ marginRight: 8 }} />
          <Text style={{ fontSize: 15, color: theme.muted, fontWeight: '600' }}>Accounts</Text>
        </View>
        <ButtonWrapper>
          <Button
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
            onPress={() => {
              // @ts-ignore
              router.push('/app/account-chooser');
            }}
            accessibilityLabel="Manage Accounts"
          >
            <Ionicons name="settings-outline" color={theme.buttonText} size={18} />
            <Text style={{ fontWeight: 'bold', color: theme.buttonText, fontSize: 16 }}>Manage Accounts</Text>
          </Button>
        </ButtonWrapper>
      </View>
      <Text style={{ fontSize: 12, color: theme.muted, marginTop: 12, textAlign: 'center' }}>
        Canvas is a product of Instructure, Inc., and this app is not affiliated with Instructure, Inc. nor Canvas.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Only keep static styles here
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: "#ccc",
  },
});