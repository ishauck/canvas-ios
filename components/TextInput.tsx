import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { TextInput as RNTextInput, Text, TextInputProps, View, StyleSheet, TextStyle, ViewStyle, useColorScheme, Animated, Easing } from "react-native";
import { THEME } from "@/constants/color";

export type TextInputHandle = {
    shake: () => void;
};

interface EnhancedTextInputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
}

const TextInput = forwardRef<TextInputHandle, EnhancedTextInputProps>(function TextInput({ label, error, containerStyle, inputStyle, ...props }, ref) {
    const [isFocused, setIsFocused] = useState(false);
    const colorScheme = useColorScheme();
    const theme = THEME[colorScheme || 'light'];
    const shakeAnim = useRef(new Animated.Value(0)).current;

    // Expose shake method via ref
    useImperativeHandle(ref, () => ({
        shake: () => {
            shakeAnim.setValue(0);
            Animated.spring(shakeAnim, {
                toValue: 1,
                friction: 2,
                tension: 200,
                useNativeDriver: true,
            }).start(() => {
                shakeAnim.setValue(0);
            });
        }
    }));

    useEffect(() => {
        if (error) {
            // Optionally, auto-shake on error prop change
        }
    }, [error, shakeAnim]);

    return (
        <View style={containerStyle}>
            {label && <Text style={[styles.label, { color: theme.label }]}>{label}</Text>}
            <Animated.View
                style={{
                    transform: [
                        {
                            translateX: shakeAnim.interpolate({
                                inputRange: [0, 0.25, 0.5, 0.75, 1],
                                outputRange: [0, -10, 10, -10, 0],
                            }),
                        },
                    ],
                }}
            >
                <RNTextInput
                    {...props}
                    style={[
                        styles.input,
                        {
                            borderColor: theme.border,
                            backgroundColor: isFocused ? theme.background : theme.surface,
                            color: theme.text,
                        },
                        isFocused && { borderColor: '#007AFF', backgroundColor: theme.background },
                        error && { borderColor: theme.error },
                        inputStyle,
                        props.style,
                    ]}
                    onFocus={e => {
                        setIsFocused(true);
                        props.onFocus && props.onFocus(e);
                    }}
                    onBlur={e => {
                        setIsFocused(false);
                        props.onBlur && props.onBlur(e);
                    }}
                    accessibilityLabel={label}
                />
            </Animated.View>
        </View>
    );
});

export default TextInput;

const styles = StyleSheet.create({
    label: {
        marginBottom: 4,
        fontWeight: "500",
        fontSize: 15,
    },
    input: {
        borderWidth: 1,
        borderRadius: 18,
        padding: 12,
        fontSize: 16,
    },
    error: {
        marginTop: 4,
        fontSize: 13,
    },
});