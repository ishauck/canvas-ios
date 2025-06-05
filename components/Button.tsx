import { CANVAS_RED, THEME } from "@/constants/color";
import { Pressable, StyleSheet, useColorScheme, ViewStyle, StyleProp, AccessibilityProps } from "react-native";
import { SquircleView } from "react-native-figma-squircle";
import React, { useMemo } from "react";

const VARIANTS = {
    primary: (theme: any) => ({
        backgroundColor: theme.button,
    }),
    // Add more variants as needed
};

type ButtonWrapperProps = Omit<React.ComponentProps<typeof SquircleView>, "squircleParams">;

export function ButtonWrapper({ children, ...props }: ButtonWrapperProps) {
    const colorScheme = useColorScheme();
    const theme = THEME[colorScheme || 'light'];
    return (
        <SquircleView {...props} style={[styles.wrapper, { backgroundColor: theme.button }, props.style]} squircleParams={{
            cornerRadius: 18,
            cornerSmoothing: 1,
        }}>
            {children}
        </SquircleView>
    );
}

type ButtonProps = {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    variant?: keyof typeof VARIANTS;
    accessibilityLabel?: string;
    accessibilityRole?: AccessibilityProps["accessibilityRole"];
} & Omit<React.ComponentProps<typeof Pressable>, "style" | "children">;

export function Button({
    children,
    style,
    variant = "primary",
    accessibilityLabel,
    accessibilityRole = "button",
    ...props
}: ButtonProps) {
    const colorScheme = useColorScheme();
    const theme = THEME[colorScheme || 'light'];

    // Memoize style calculation
    const buttonStyle = useMemo(() => {
        let resolvedStyle: any[] = [];
        if (Array.isArray(style)) {
            resolvedStyle = style.filter(s => typeof s !== 'function');
        } else if (style && typeof style !== 'function') {
            resolvedStyle = [style];
        }
        // Variant support (currently only primary, but extendable)
        const variantStyle = variant && VARIANTS[variant] ? VARIANTS[variant](theme) : {};
        return [
            { backgroundColor: theme.button, ...styles.button },
            variantStyle,
            ...resolvedStyle,
        ];
    }, [style, theme, variant]);

    return (
        <Pressable
            style={({ pressed }) => [
                ...buttonStyle,
                pressed && { opacity: 0.7 }, // Touch feedback
            ]}
            accessibilityLabel={accessibilityLabel}
            accessibilityRole={accessibilityRole}
            {...props}
        >
            {children}
        </Pressable>
    );
}

export const styles = StyleSheet.create({
    wrapper: {
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 24,
        height: 48,
    },
    button: {
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 24,
        height: "100%",
    }
});