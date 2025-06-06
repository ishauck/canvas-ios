import { View, Text, useColorScheme, Platform, TouchableWithoutFeedback, Keyboard, Animated, Easing } from "react-native";
import { useEffect, useRef } from "react";
import { CanvasLogo } from "@/components/CanvasLogo";
import { CANVAS_RED, THEME } from "@/constants/color";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TextInput, { TextInputHandle } from "@/components/TextInput";
import { ButtonWrapper, Button as RNButton } from "@/components/Button";
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import * as Haptics from 'expo-haptics';
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useTheme } from "@/hooks/use-theme";
import { useGlobalStore } from "@/store/data";

export default function Home() {
  const safeAreaInsets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = THEME[colorScheme || 'light'];
  const domainInputRef = useRef<TextInputHandle>(null);
  const { domain } = useLocalSearchParams();

  // Animated value for keyboard offset
  const keyboardOffset = useRef(new Animated.Value(0)).current;

  // TanStack Form setup
  const domainSchema = z.object({
    domain: z
      .string()
      .min(1, 'Domain is required')
      .regex(
        /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
        'Must be a valid Canvas domain (e.g., xyz.instructure.com)'
      ),
  });

  const form = useForm({
    defaultValues: { domain: domain || '' },
    onSubmit: async ({ value }) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Keyboard.dismiss();
      router.push({
        pathname: '/access',
        params: {
          domain: value.domain,
        }
      });
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
        duration: 125, // double speed
        useNativeDriver: false,
        easing: Easing.in(Easing.quad),
      }).start();
    };
    const handleKeyboardHide = () => {
      Animated.timing(keyboardOffset, {
        toValue: 0,
        duration: 125, // double speed
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

  const { accounts } = useGlobalStore();

  if (accounts.length > 0) {
    return <Redirect href="/app" />;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <Animated.View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{ translateY: Animated.multiply(keyboardOffset, -1) }],
          }}
        >
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <CanvasLogo width={100} height={100} color={colorScheme === 'dark' ? "#fff" : CANVAS_RED} />
            </View>
            <Text style={{ fontSize: 32, fontWeight: 'bold', marginVertical: 15, color: theme.text }}>Log In</Text>
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
                  />
                )}
              </form.Field>
              <form.Subscribe selector={s => [s.canSubmit, s.isSubmitting]}>
                {([_, isSubmitting]) => (
                  <ButtonWrapper>
                    <RNButton
                      onPress={() => form.handleSubmit()}
                      disabled={isSubmitting}
                      accessibilityLabel="Continue"
                    >
                      <Text style={{ color: theme.buttonText, fontSize: 16, fontWeight: "bold" }}>{isSubmitting ? '...' : 'Continue'}</Text>
                    </RNButton>
                  </ButtonWrapper>
                )}
              </form.Subscribe>
            </View>
          </View>
        </Animated.View>
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
    </TouchableWithoutFeedback>
  );
}
