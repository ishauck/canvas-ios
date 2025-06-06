import { useTheme } from "@/hooks/use-theme";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Constants from "expo-constants";
import { useGlobalStore } from "@/store/data";
import { Redirect } from "expo-router";

export default function Settings() {
  const theme = useTheme();
  const { accounts, currentAccount, setCurrentAccount } = useGlobalStore();
  const version = Constants.expoConfig?.version || "Unknown";

  if (true) {
    return <Redirect href="/app/account-chooser" />;
  }

  return (
    <View style={{ backgroundColor: theme.background, flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 24 }}>Settings</Text>
      <View style={{ marginBottom: 32 }}>
        <Text style={{ fontSize: 16, color: theme.text }}>App Version</Text>
        <Text style={{ fontSize: 18, fontWeight: "600", color: theme.text }}>{version}</Text>
      </View>
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 16, color: theme.text, marginBottom: 8 }}>Switch User</Text>
        {accounts.length === 0 && <Text style={{ color: theme.text }}>No accounts found.</Text>}
        {accounts.map((account, idx) => (
          <TouchableOpacity
            key={account.id}
            style={[
              styles.accountRow,
              {
                backgroundColor:
                  idx === currentAccount ? theme.surface : theme.background,
                borderColor: idx === currentAccount ? theme.primary : theme.border,
              },
            ]}
            onPress={() => setCurrentAccount(idx)}
            disabled={idx === currentAccount}
          >
            {account.avatar ? (
              <Image
                source={{ uri: account.avatar }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatar, { backgroundColor: theme.border }]} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "600", color: theme.text }}>{account.name}</Text>
              <Text style={{ color: theme.text, opacity: 0.7 }}>{account.email}</Text>
            </View>
            {idx === currentAccount && (
              <Text style={{ color: theme.primary, fontWeight: "bold" }}>Current</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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