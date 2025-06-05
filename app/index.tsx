import { View, Text, useColorScheme, Platform, TouchableWithoutFeedback, Keyboard, Animated, Easing } from "react-native";
import { useEffect, useRef } from "react";
import { CanvasLogo } from "@/components/CanvasLogo";
import { CANVAS_RED, THEME } from "@/constants/color";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TextInput from "@/components/TextInput";
import { ButtonWrapper, Button as RNButton } from "@/components/Button";

export default function Home() {
  const safeAreaInsets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = THEME[colorScheme || 'light'];

  // Animated value for keyboard offset
  const keyboardOffset = useRef(new Animated.Value(0)).current;

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
