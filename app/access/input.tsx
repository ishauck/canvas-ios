import CanvasLogo from "@/components/CanvasLogo";
import TextInput from "@/components/TextInput";
import { CANVAS_RED } from "@/constants/color";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect, useRef } from "react";
import { View, Text, Pressable, Animated, Keyboard, Platform, Easing, TouchableWithoutFeedback, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { verifyCanvas } from "../../lib/verify-canvas";
import { Button, ButtonWrapper } from "@/components/Button";
import { useGlobalStore } from "@/store/data";

export default function Input() {
    const theme = useTheme();
    const safeAreaInsets = useSafeAreaInsets();
    const [accessToken, setAccessToken] = useState('');
    const keyboardOffset = useRef(new Animated.Value(0)).current;
    const { domain } = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setCurrentAccount, addAccount, accounts } = useGlobalStore();

    useEffect(() => {
        const keyboardShow = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const keyboardHide = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

        const handleKeyboardShow = (event: { endCoordinates: { height: number } }) => {
            Animated.timing(keyboardOffset, {
                toValue: event.endCoordinates.height / 2,
                duration: 125,
                useNativeDriver: false,
                easing: Easing.in(Easing.quad),
            }).start();
        };
        const handleKeyboardHide = () => {
            Animated.timing(keyboardOffset, {
                toValue: 0,
                duration: 125,
                useNativeDriver: false,
                easing: Easing.out(Easing.quad),
            }).start();
        };
        const showSub = Keyboard.addListener(keyboardShow, handleKeyboardShow);
        const hideSub = Keyboard.addListener(keyboardHide, handleKeyboardHide);
        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, [keyboardOffset]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: safeAreaInsets.top, paddingHorizontal: 16 }}>
                <Pressable
                    onPress={() => router.back()}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        alignSelf: 'flex-start',
                        marginBottom: 8,
                        marginTop: 8,
                        paddingHorizontal: 8,
                        paddingVertical: 6,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: theme.border,
                        backgroundColor: theme.surface,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.08,
                        shadowRadius: 2,
                    }}
                >
                    <Ionicons name="arrow-back" size={20} color={theme.text} style={{ marginRight: 6 }} />
                    <Text style={{ color: theme.text, fontSize: 15, fontWeight: '500' }}>Back to Instructions</Text>
                </Pressable>
                <Animated.View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        transform: [{ translateY: Animated.multiply(keyboardOffset, -1) }],
                    }}
                >
                    <View style={{ backgroundColor: theme.surface, borderRadius: 24, padding: 16, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 6 }}>
                        {/* @ts-ignore */}
                        <CanvasLogo fill={CANVAS_RED} style={{ color: CANVAS_RED }} width={48} height={48} />
                    </View>
                    <Text style={{ color: theme.text, fontSize: 24, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>Enter your access token</Text>
                    <Text style={{ color: theme.muted ?? '#888', fontSize: 15, marginBottom: 20, textAlign: 'center', maxWidth: 320 }}>
                        Paste your Canvas access token below to continue.
                    </Text>
                    <View style={{ width: '100%', maxWidth: 340, marginBottom: 20 }}>
                        <TextInput
                            placeholder="Access token"
                            value={accessToken}
                            onChangeText={text => {
                                setAccessToken(text);
                                setError(null);
                            }}
                            style={{
                                backgroundColor: theme.surface,
                                borderColor: theme.border,
                                borderWidth: 1,
                                borderRadius: 12,
                                paddingHorizontal: 16,
                                paddingVertical: 12,
                                fontSize: 16,
                                color: theme.text,
                            }}
                            autoCapitalize="none"
                            autoCorrect={false}
                            secureTextEntry
                            error={error || undefined}
                        />
                        {error && (
                            <Text style={{ color: theme.error || '#d32f2f', marginTop: 6, fontSize: 14, textAlign: 'center' }}>{error}</Text>
                        )}
                    </View>
                    <ButtonWrapper style={{ width: '100%', maxWidth: 340, marginBottom: 0 }}>
                        <Button
                            onPress={async () => {
                                setLoading(true);
                                setError(null);
                                try {
                                    if (!domain) throw new Error('No domain provided');
                                    const accountIndex = accounts.length;
                                    const account = await verifyCanvas(domain as string, accessToken);
                                    setCurrentAccount(accountIndex);
                                    addAccount({
                                        id: account.id.toString(),
                                        domain: domain as string,
                                        name: account.name,
                                        key: accessToken,
                                    });
                                    router.replace('/app');
                                } catch {
                                    setError('Invalid token or network error.');
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            disabled={!accessToken || loading}
                            accessibilityLabel="Continue"
                            style={{ width: '100%', borderRadius: 12, paddingVertical: 14 }}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color={theme.buttonText} />
                            ) : (
                                <Text style={{ color: theme.buttonText, fontSize: 16, fontWeight: '600' }}>Continue</Text>
                            )}
                        </Button>
                    </ButtonWrapper>
                </Animated.View>
            </View>
        </TouchableWithoutFeedback>
    );
}