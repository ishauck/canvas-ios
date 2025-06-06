import React, { useState } from "react";
import { CanvasLogo } from "@/components/CanvasLogo";
import { CANVAS_RED } from "@/constants/color";
import { useTheme } from "@/hooks/use-theme";
import { useLocalSearchParams, router } from "expo-router";
import { View, Text, useColorScheme, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TextInput from "@/components/TextInput";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { MotiView, AnimatePresence } from "moti";
import * as Haptics from "expo-haptics";
import * as Linking from 'expo-linking';
import { Button, ButtonWrapper } from "@/components/Button";

export default function Access() {
    const { domain } = useLocalSearchParams();
    const colorScheme = useColorScheme();
    const theme = useTheme();
    const safeAreaInsets = useSafeAreaInsets();
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3;

    const handleOpenCanvasSettings = () => {
        Linking.openURL(`https://${domain}/profile/settings`);
    };

    const handleNextStep = () => {
        if (currentStep < totalSteps) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setCurrentStep(currentStep + 1);
            return;
        }

        router.push({
            pathname: '/access/input',
            params: {
                domain: domain,
            },
        });
    };

    const handlePrevStep = () => {
        if (currentStep > 1) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setCurrentStep(currentStep - 1);
        }
    };

    const renderStepIndicators = () => (
        <View style={styles.stepIndicatorContainer}>
            {Array.from({ length: totalSteps }).map((_, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === currentStep;
                const isCompleted = stepNumber < currentStep;
                return (
                    <React.Fragment key={stepNumber}>
                        <Pressable
                            onPress={() => setCurrentStep(stepNumber)}
                            style={[
                                styles.stepIndicator,
                                {
                                    backgroundColor: isActive
                                        ? theme.primary
                                        : isCompleted
                                            ? theme.primary
                                            : theme.surface,
                                    borderColor: isActive || isCompleted ? theme.primary : theme.border,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.stepIndicatorText,
                                    {
                                        color: isActive || isCompleted ? theme.background : theme.muted,
                                    },
                                ]}
                            >
                                {stepNumber}
                            </Text>
                        </Pressable>
                        {stepNumber < totalSteps && (
                            <View style={styles.stepConnector}>
                                <MotiView
                                    animate={{ width: currentStep > stepNumber ? '100%' : '0%' }}
                                    transition={{ type: 'timing', duration: 100 }}
                                    style={[
                                        styles.stepConnectorProgress,
                                        {
                                            backgroundColor: theme.primary,
                                        },
                                    ]}
                                />
                                <View
                                    style={[
                                        styles.stepConnectorProgress,
                                        {
                                            backgroundColor: theme.border,
                                            width: '100%',
                                            position: 'absolute',
                                            zIndex: -1,
                                        },
                                    ]}
                                />
                            </View>
                        )}
                    </React.Fragment>
                );
            })}
        </View>
    );

    const renderStepContent = () => {
        let content = null;
        switch (currentStep) {
            case 1:
                content = (
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'timing', duration: 350 }}
                        style={{ width: '100%', alignItems: 'center' }}
                    >
                        <View style={styles.stepContent}>
                            <View style={[styles.stepCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                                accessible accessibilityLabel="Go to Canvas Settings step card">
                                <View style={styles.stepIconContainer}>
                                    <MaterialIcons name="open-in-new" size={24} color={theme.primary} />
                                </View>
                                <Text style={[styles.stepTitle, { color: theme.text }]}>Go to Canvas Settings</Text>
                                <Text style={[styles.stepDescription, { color: theme.muted, marginBottom: 12 }]}>Tap below to open your Canvas settings in the browser. You&apos;ll need to generate an access token there.</Text>
                                <ButtonWrapper>
                                    <Button
                                        onPress={() => {
                                            handleOpenCanvasSettings();
                                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                        }}
                                        style={[
                                            styles.nextButton,
                                            { backgroundColor: theme.primary, shadowColor: theme.primary, shadowOpacity: 0.15, shadowRadius: 6, elevation: 2 },
                                        ]}
                                        accessibilityLabel="Open Canvas Settings"
                                    >
                                        <MaterialIcons name="open-in-new" size={18} color={theme.buttonText} style={{ marginRight: 8 }} />
                                        <Text style={[styles.buttonText, { color: theme.buttonText, marginRight: 0 }]}>Open Canvas Settings</Text>
                                    </Button>
                                </ButtonWrapper>
                            </View>
                            <View style={styles.buttonRow}>
                                <Pressable
                                    onPress={handleNextStep}
                                    style={[
                                        styles.nextButton,
                                        { backgroundColor: theme.primary, shadowColor: theme.primary, shadowOpacity: 0.15, shadowRadius: 6, elevation: 2 },
                                    ]}
                                    accessibilityLabel="Continue to next step"
                                >
                                    <Text style={[styles.buttonText, { color: theme.background }]}>Continue</Text>
                                    <Ionicons name="chevron-forward" size={20} color={theme.background} />
                                </Pressable>
                            </View>
                        </View>
                    </MotiView >
                );
                break;
            case 2:
                content = (
                    <View style={styles.stepContent}>
                        <View style={[styles.stepCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                            <View style={styles.stepIconContainer}>
                                <MaterialIcons name="integration-instructions" size={24} color={theme.primary} />
                            </View>
                            <Text style={[styles.stepTitle, { color: theme.text }]}>Find Approved Integrations</Text>
                            <Text style={[styles.stepDescription, { color: theme.muted }]}>Scroll to <Text style={{ fontWeight: 'bold' }}>Approved Integrations</Text> on the settings page.</Text>
                        </View>
                        <View style={styles.buttonRow}>
                            <Pressable onPress={handlePrevStep} style={[styles.backButton, { borderColor: theme.border }]}>
                                <Ionicons name="chevron-back" size={20} color={theme.text} />
                            </Pressable>
                            <Pressable onPress={handleNextStep} style={[styles.nextButton, { backgroundColor: theme.primary }]}>
                                <Text style={[styles.buttonText, { color: theme.background }]}>Continue</Text>
                                <Ionicons name="chevron-forward" size={20} color={theme.background} />
                            </Pressable>
                        </View>
                    </View>
                );
                break;
            case 3:
                content = (
                    <View style={styles.stepContent}>
                        <View style={[styles.stepCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                            <View style={styles.stepIconContainer}>
                                <MaterialIcons name="vpn-key" size={24} color={theme.primary} />
                            </View>
                            <Text style={[styles.stepTitle, { color: theme.text }]}>Create New Access Token</Text>
                            <Text style={[styles.stepDescription, { color: theme.muted }]}>Press <Text style={{ fontWeight: 'bold' }}>New Access Token</Text> to create a new token.</Text>
                        </View>
                        <View style={styles.buttonRow}>
                            <Pressable onPress={handlePrevStep} style={[styles.backButton, { borderColor: theme.border }]}>
                                <Ionicons name="chevron-back" size={20} color={theme.text} />
                            </Pressable>
                            <Pressable onPress={handleNextStep} style={[styles.nextButton, { backgroundColor: theme.primary }]}>
                                <Text style={[styles.buttonText, { color: theme.background }]}>Continue</Text>
                                <Ionicons name="chevron-forward" size={20} color={theme.background} />
                            </Pressable>
                        </View>
                    </View>
                );
                break;
            default:
                content = null;
        }
        return (
            <AnimatePresence exitBeforeEnter>
                <MotiView
                    key={currentStep}
                    from={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: 'timing', duration: 180 }}
                    style={{ width: '100%', alignItems: 'center' }}
                >
                    {content}
                </MotiView>
            </AnimatePresence>
        );
    };

    return (
        <View
            style={[
                styles.container,
                {
                    paddingTop: safeAreaInsets.top,
                    backgroundColor: theme.background,
                },
            ]}
        >
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
                }}
            >
                <Ionicons name="arrow-back" size={20} color={theme.text} style={{ marginRight: 6 }} />
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: '500' }}>Back to Home</Text>
            </Pressable>
            <CanvasLogo
                width={80}
                height={80}
                color={colorScheme === "dark" ? "#fff" : CANVAS_RED}
                style={styles.logo}
            />
            <Text style={[styles.title, { color: theme.text }]}>Get an Access Token</Text>
            <Text style={[styles.subtitle, { color: theme.muted }]}>Follow these steps to generate your Canvas access token</Text>
            {renderStepIndicators()}
            {renderStepContent()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        paddingHorizontal: 16,
    },
    logo: {
        marginBottom: 24,
        marginTop: 16,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 32,
        textAlign: "center",
    },
    stepIndicatorContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
        width: "100%",
        maxWidth: 320,
    },
    stepIndicator: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
    },
    stepIndicatorText: {
        fontSize: 14,
        fontWeight: "bold",
    },
    stepConnector: {
        height: 3,
        flex: 1,
        marginHorizontal: 8,
        backgroundColor: "transparent",
        position: "relative",
        justifyContent: "center",
    },
    stepConnectorProgress: {
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        borderRadius: 2,
    },
    stepContent: {
        width: "100%",
        maxWidth: 320,
        alignItems: "center",
    },
    stepCard: {
        width: "100%",
        borderRadius: 18,
        padding: 24,
        borderWidth: 1,
        marginBottom: 24,
    },
    stepIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        marginBottom: 16,
    },
    stepTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    stepDescription: {
        fontSize: 15,
        lineHeight: 22,
    },
    nextButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        flex: 1,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
        marginRight: 8,
    },
    buttonRow: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        gap: 10,
    },
    backButton: {
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        aspectRatio: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 8,
        width: 48,
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: "500",
    },
    inputContainer: {
        marginTop: 24,
        width: "100%",
    },
    inputLabel: {
        fontSize: 16,
        marginBottom: 8,
    },
    inputContainerStyle: {
        width: "100%",
        height: 48,
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
    },
});