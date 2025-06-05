import React, { useState } from "react";
import { TextInput as RNTextInput, Text, TextInputProps, View, StyleSheet, TextStyle, ViewStyle, useColorScheme } from "react-native";
import { THEME } from "@/constants/color";

interface EnhancedTextInputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
}

export default function TextInput({ label, error, containerStyle, inputStyle, ...props }: EnhancedTextInputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const colorScheme = useColorScheme();
    const theme = THEME[colorScheme || 'light'];

    return (
        <View style={containerStyle}>
            {label && <Text style={[styles.label, { color: theme.label }]}>{label}</Text>}
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
            {error && <Text style={[styles.error, { color: theme.error }]}>{error}</Text>}
        </View>
    );
}

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