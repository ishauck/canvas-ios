import { useTheme } from "@/hooks/use-theme";
import { View, Text, SafeAreaView, FlatList, TouchableOpacity } from "react-native";
import { CanvasLogo } from "@/components/CanvasLogo";
import { CANVAS_RED } from "@/constants/color";
import { useGlobalStore } from "@/store/data";
import { Button, ButtonWrapper } from "@/components/Button";
import { Redirect, router } from "expo-router";

export default function AccountChooser() {
    const theme = useTheme();
    const accounts = useGlobalStore((state) => state.accounts);
    const setAccounts = useGlobalStore((state) => state.setAccounts);
    const setCurrentAccount = useGlobalStore((state) => state.setCurrentAccount);
    if (accounts.length === 0) {
        return <Redirect href="/" />;
    }

    return (
        <SafeAreaView style={{ backgroundColor: theme.background, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: 340 }}>
                <View style={{ backgroundColor: theme.surface, borderRadius: 24, padding: 16, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 6 }}>
                    {/* @ts-ignore */}
                    <CanvasLogo fill={CANVAS_RED} style={{ color: CANVAS_RED }} width={48} height={48} />
                </View>
                <Text style={{ color: theme.text, fontSize: 24, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>Account Chooser</Text>
                <Text style={{ color: theme.muted ?? '#888', fontSize: 15, marginBottom: 20, textAlign: 'center', maxWidth: 320 }}>
                    Select an account to continue.
                </Text>
                <View style={{ height: 400, width: '100%' }}>
                    <FlatList
                        data={accounts}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity style={{
                                backgroundColor: theme.surface,
                                borderRadius: 12,
                                padding: 16,
                                borderTopLeftRadius: index === 0 ? 12 : 0,
                                borderTopRightRadius: index === 0 ? 12 : 0,
                                borderBottomLeftRadius: index === accounts.length - 1 ? 12 : 0,
                                borderBottomRightRadius: index === accounts.length - 1 ? 12 : 0,
                                borderWidth: 1,
                                borderLeftWidth: 0,
                                borderRightWidth: 0,
                                borderBottomWidth: 0,
                                borderTopWidth: index === 0 ? 0 : 1,
                                borderColor: theme.border,
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                            onPress={() => {
                                setCurrentAccount(index);
                                router.replace('/app/(tabs)');
                            }}>
                                <Text style={{ color: theme.text, fontSize: 24, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
                <ButtonWrapper>
                    <Button accessibilityLabel="Continue" accessibilityRole="button" onPress={() => {
                        setAccounts([]);
                        router.replace('/');
                    }}>
                        <Text style={{ color: theme.buttonText, fontSize: 16, fontWeight: 'bold' }}>Clear Accounts</Text>
                    </Button>
                </ButtonWrapper>
            </View>
        </SafeAreaView>
    );
}