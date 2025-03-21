import { DarkTheme, DefaultTheme, ThemeProvider, Theme } from '@react-navigation/native';
import "@/global.css";
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useRef } from 'react';
import 'react-native-reanimated';
import { Platform } from 'react-native';

import { useColorScheme } from '@/lib/useColorScheme';
import { useAuthStore } from '@/store/authStore';
import { NAV_THEME } from '@/lib/constants';
import {QueryClient} from "@tanstack/query-core";
import {QueryClientProvider} from "@tanstack/react-query";

SplashScreen.preventAutoHideAsync();

const LIGHT_THEME: Theme = {
    ...DefaultTheme,
    colors: NAV_THEME.light,
};

const DARK_THEME: Theme = {
    ...DarkTheme,
    colors: NAV_THEME.dark,
};

const useIsomorphicLayoutEffect =
    Platform.OS === 'web' && typeof window === 'undefined' ? useEffect : useEffect;

export default function RootLayout() {
    const hasMounted = useRef(false);
    const { colorScheme, isDarkColorScheme } = useColorScheme();
    const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });
    const user = useAuthStore((state) => state.user);
    const isLoading = useAuthStore((state) => state.isLoading);
    const segments = useSegments();
    const router = useRouter();
    const [isReady, setIsReady] = useState(false);

    useIsomorphicLayoutEffect(() => {
        if (hasMounted.current) {
            return;
        }

        if (Platform.OS === 'web') {
            document.documentElement.classList.add('bg-background');
        }
        setIsColorSchemeLoaded(true);
        hasMounted.current = true;
    }, []);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
            setIsReady(true);
        }
    }, [loaded]);

    useEffect(() => {
        if (!isReady || isLoading) return;

        const currentRoute = segments[0];
        const isAuthRoute = currentRoute === 'login' || currentRoute === 'register';
        const isOnboardingRoute = currentRoute === 'onboarding';

        if (!user && !isAuthRoute && !isOnboardingRoute) {
            router.replace('/onboarding');
        } else if (user && (isAuthRoute || isOnboardingRoute)) {
            router.replace('/(tabs)');
        }
    }, [user, isLoading, segments, isReady]);

    if (!loaded || !isReady || !isColorSchemeLoaded) {
        return null;
    }
    const queryClient = new QueryClient();
    return (
        <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
            <QueryClientProvider client={queryClient}>
                <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="onboarding" />
                    <Stack.Screen name="login" />
                    <Stack.Screen name="register" />
                    <Stack.Screen name="(tabs)" />
                </Stack>
            </QueryClientProvider>
        </ThemeProvider>
    );
}
