import { useTheme } from "@/hooks/use-theme";
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { CanvasLogo } from "@/components/CanvasLogo";
import { CANVAS_RED } from "@/constants/color";
import { useGlobalStore } from "@/store/data";
import { Button, ButtonWrapper } from "@/components/Button";
import { Redirect, router } from "expo-router";
import useBrandVariables from "@/hooks/use-brand-variables";

// AccountAvatar component
function AccountAvatar({ avatar, domain, size = 40 }: { avatar?: string; domain: string; size?: number }) {
    const { data: brandVars } = useBrandVariables();
    // Try to get the brand logo for the domain
    const brandLogo = brandVars?.["ic-brand-msapplication-tile-wide"];
    const avatarStyle = {
        backgroundColor: '#ccc',
    };
    const brandBubbleStyle = {
        position: 'absolute' as const,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#eee',
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        overflow: 'hidden' as const,
    };
    return (
        <View style={{ width: size, height: size }}>
            {avatar ? (
                <Image source={{ uri: avatar }} style={[avatarStyle, { width: size, height: size, borderRadius: size / 2 }]} />
            ) : (
                <View style={[avatarStyle, { width: size, height: size, borderRadius: size / 2, backgroundColor: '#ccc', alignItems: 'center', justifyContent: 'center' }]}> 
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: size / 2 }}>{domain[0]?.toUpperCase() || '?'}</Text>
                </View>
            )}
            {brandLogo && (
                <View style={[brandBubbleStyle, { width: size / 2.2, height: size / 2.2, borderRadius: size / 4, right: -2, bottom: -2 }]}> 
                    <Image source={{ uri: brandLogo }} style={{ width: '100%', height: '100%', borderRadius: size / 4 }} resizeMode="contain" />
                </View>
            )}
        </View>
    );
}

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
                                justifyContent: 'flex-start',
                                gap: 12,
                            }}
                            onPress={() => {
                                setCurrentAccount(index);
                                router.replace('/app/(tabs)');
                            }}>
                                <AccountAvatar avatar={item.avatar} domain={item.domain} size={48} />
                                <View style={{ flex: 1, marginLeft: 12 }}>
                                    <Text style={{ color: theme.text, fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
                                    <Text style={{ color: theme.muted ?? '#888', fontSize: 13, opacity: 0.7 }}>{item.domain}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
                <ButtonWrapper>
                    <Button accessibilityLabel="Continue" accessibilityRole="button" onPress={() => {
                        router.replace('/');
                    }}>
                        <Text style={{ color: theme.buttonText, fontSize: 16, fontWeight: 'bold' }}>Clear Accounts</Text>
                    </Button>
                </ButtonWrapper>
            </View>
        </SafeAreaView>
    );
}