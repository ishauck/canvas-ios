import { View, Text, useColorScheme, Platform, TouchableWithoutFeedback, Keyboard, Animated, Easing, Pressable, ActivityIndicator } from "react-native";
import { useEffect, useRef, useState } from "react";
import { CanvasLogo } from "@/components/CanvasLogo";
import { CANVAS_RED, THEME } from "@/constants/color";
import TextInput, { TextInputHandle } from "@/components/TextInput";
import { ButtonWrapper, Button as RNButton } from "@/components/Button";
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import * as Haptics from 'expo-haptics';
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/use-theme";
import { verifyCanvas } from "@/lib/verify-canvas";
import { useGlobalStore } from "@/store/data";

export default function AddAccount() {
    const colorScheme = useColorScheme();
    const theme = THEME[colorScheme || 'light'];
    const domainInputRef = useRef<TextInputHandle>(null);
    const tokenInputRef = useRef<TextInputHandle>(null);
    const keyboardOffset = useRef(new Animated.Value(0)).current;
    const appTheme = useTheme();
    const { setCurrentAccount, addAccount, accounts } = useGlobalStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Domain validation schema
    const domainSchema = z.object({
        domain: z
            .string()
            .min(1, 'Domain is required')
            .regex(
                /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
                'Must be a valid Canvas domain (e.g., xyz.instructure.com)'
            ),
        token: z
            .string()
            .min(1, 'Token is required'),
    });

    // Form setup
    const form = useForm({
        defaultValues: { domain: '', token: '' },
        onSubmit: async ({ value }) => {
            setLoading(true);
            setError(null);
            try {
                const accountIndex = accounts.length;
                const account = await verifyCanvas(value.domain, value.token);
                setCurrentAccount(accountIndex);
                addAccount({
                    id: account.id.toString(),
                    domain: value.domain,
                    name: account.name,
                    key: value.token,
                });
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                Keyboard.dismiss();
                router.replace('/app');
            } catch {
                setError('Invalid token or network error.');
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            } finally {
                setLoading(false);
            }
        },
        validators: {
            onSubmit: ({ value }) => {
                const result = domainSchema.safeParse(value);
                if (!result.success) {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                    domainInputRef.current?.shake();
                    return result.error.message;
                }
                return undefined;
            },
        },
    });

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
            <View style={{ flex: 1, backgroundColor: theme.background }}>
                <Animated.View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: [{ translateY: Animated.multiply(keyboardOffset, -1) }],
                    }}
                >
                    <View style={{ alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: 16 }}>
                        <CanvasLogo width={80} height={80} color={colorScheme === 'dark' ? "#fff" : CANVAS_RED} />
                    </View>
                    <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 8, color: theme.text }}>Add Account</Text>
                    <Text style={{ color: theme.muted, fontSize: 15, marginBottom: 20, textAlign: 'center', maxWidth: 320 }}>
                        Enter your Canvas domain to add a new account.
                    </Text>
                    <View style={{ width: 300, flexDirection: 'column', gap: 10 }}>
                        <form.Field name="domain">
                            {(field) => (
                                <TextInput
                                    placeholder="xyz.instructure.com"
                                    keyboardType="url"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    containerStyle={{ width: "100%", height: 48 }}
                                    inputStyle={{ backgroundColor: theme.surface, color: theme.text }}
                                    value={field.state.value as string}
                                    onChangeText={field.handleChange}
                                    onBlur={field.handleBlur}
                                    ref={domainInputRef}
                                    error={field.state.meta.errors?.[0]}
                                />
                            )}
                        </form.Field>
                        <form.Field name="token">
                            {(field) => (
                                <TextInput
                                    placeholder="Canvas API Token"
                                    secureTextEntry={true}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    containerStyle={{ width: "100%", height: 48 }}
                                    inputStyle={{ backgroundColor: theme.surface, color: theme.text }}
                                    value={field.state.value as string}
                                    onChangeText={(text) => {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        field.handleChange(text);
                                    }}
                                    onBlur={field.handleBlur}
                                    ref={tokenInputRef}
                                    error={field.state.meta.errors?.[0]}
                                />
                            )}
                        </form.Field>
                        <form.Subscribe selector={s => [s.canSubmit, s.isSubmitting]}>
                            {([canSubmit, isSubmitting]) => (
                                <ButtonWrapper>
                                    <RNButton
                                        onPress={() => form.handleSubmit()}
                                        disabled={isSubmitting || !canSubmit || loading}
                                        accessibilityLabel="Continue"
                                    >
                                        {loading ? (
                                            <ActivityIndicator size="small" color={theme.buttonText} />
                                        ) : (
                                            <Text style={{ color: theme.buttonText, fontSize: 16, fontWeight: "bold" }}>{isSubmitting ? '...' : 'Continue'}</Text>
                                        )}
                                    </RNButton>
                                    {error && (
                                        <Text style={{ color: appTheme.error || '#d32f2f', marginTop: 6, fontSize: 14, textAlign: 'center' }}>{error}</Text>
                                    )}
                                </ButtonWrapper>
                            )}
                        </form.Subscribe>
                    </View>
                </Animated.View>
            </View>
        </TouchableWithoutFeedback>
    );
}