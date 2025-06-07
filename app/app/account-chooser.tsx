import { useTheme } from "@/hooks/use-theme";
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Image, StatusBar, Alert } from "react-native";
import { CanvasLogo } from "@/components/CanvasLogo";
import { CANVAS_RED } from "@/constants/color";
import { useGlobalStore } from "@/store/data";
import { Button, ButtonWrapper } from "@/components/Button";
import { Redirect, router } from "expo-router";
import useBrandVariables from "@/hooks/use-brand-variables";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, { useAnimatedStyle, SharedValue } from "react-native-reanimated";
import React, { useCallback, useEffect, useState } from "react";
import * as Haptics from 'expo-haptics';
import { Ionicons } from "@expo/vector-icons";


// AccountAvatar component
function AccountAvatar({ avatar, domain, size = 40 }: { avatar?: string; domain: string; size?: number }) {
    const { data: brandVars } = useBrandVariables(domain);
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

function RightAction(prog: SharedValue<number>, drag: SharedValue<number>, onDelete: () => void) {
    const styleAnimation = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: drag.value + 100 }],
            height: '100%',
        };
    });

    const handleDelete = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Alert.alert('Delete Account', 'Are you sure you want to delete this account?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => {
                onDelete();
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            } },
        ]);
    }, [onDelete]);

    return (
        <Reanimated.View style={styleAnimation}>
            <TouchableOpacity
                style={{ width: 100, flex: 1, height: "100%", backgroundColor: 'red', alignItems: 'center', justifyContent: 'center' }}
                onPress={handleDelete}
            >
                <Ionicons name="trash" size={24} color="white" />
            </TouchableOpacity>
        </Reanimated.View>
    );
}

export default function AccountChooser() {
    const theme = useTheme();
    const accounts = useGlobalStore((state) => state.accounts);
    const setCurrentAccount = useGlobalStore((state) => state.setCurrentAccount);
    const removeAccount = useGlobalStore((state) => state.removeAccount);

    if (accounts.length === 0) {
        return <Redirect href="/" />;
    }


    // RenderItem as a separate component to manage drag state per row
    const RenderAccountRow = ({ item, index }: { item: any, index: number }) => {
        const [isDragging, setIsDragging] = useState(false);

        useEffect(() => {
            let timeoutId: number;

            timeoutId = setInterval(() => {
                if (isDragging) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }
            }, 8);

            return () => {
                if (timeoutId) {
                    clearInterval(timeoutId);
                }
            };
        }, [isDragging]);

        // Delete handler for this row
        const handleDelete = () => {
            removeAccount(item);
        };

        return (
            <ReanimatedSwipeable
                friction={2}
                containerStyle={{
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
                    flex: 1,
                }}
                enableTrackpadTwoFingerGesture
                rightThreshold={40}
                renderRightActions={(prog, drag) => RightAction(prog, drag, handleDelete)}
                onSwipeableOpenStartDrag={() => setIsDragging(true)}
                onSwipeableCloseStartDrag={() => setIsDragging(true)}
                onSwipeableWillClose={() => setIsDragging(false)}
                onSwipeableClose={() => setIsDragging(false)}
            >
                <TouchableOpacity
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: 12,
                    }}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setCurrentAccount(index);
                        router.replace('/app/(tabs)');
                    }}
                    disabled={isDragging}
                >
                    <AccountAvatar avatar={item.avatar} domain={item.domain} size={48} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={{ color: theme.text, fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
                        <Text style={{ color: theme.muted ?? '#888', fontSize: 13, opacity: 0.7 }}>{item.domain}</Text>
                    </View>
                </TouchableOpacity>
            </ReanimatedSwipeable>
        );
    };

    return (
        <SafeAreaView style={{ backgroundColor: theme.background, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: 340 }}>
                <View style={{ backgroundColor: theme.surface, borderRadius: 24, padding: 16, marginBottom: 24 }}>
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
                            <RenderAccountRow item={item} index={index} />
                        )}
                    />
                </View>
                <ButtonWrapper>
                    <Button accessibilityLabel="Continue" accessibilityRole="button" onPress={() => {
                        router.push('/app/add-account');
                    }}>
                        <Text style={{ color: theme.buttonText, fontSize: 16, fontWeight: 'bold' }}>Add Account</Text>
                    </Button>
                </ButtonWrapper>
            </View>
            <StatusBar barStyle={'default'} />
        </SafeAreaView>
    );
}