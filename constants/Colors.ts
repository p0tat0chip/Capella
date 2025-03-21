/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#6E56CF'; // Changed to NeoPOP primary purple
const tintColorDark = '#9B6DFF'; // Lighter version of purple for dark mode

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,

    // Added NeoPOP light theme colors
    secondary: '#FF8B3E',
    accent: '#F31260',
    surface: '#F4F4F5',
    cardBackground: '#FAFAFA',
    textSecondary: '#687076',
    textTertiary: '#889096',
    success: '#17C964',
    warning: '#F5A524',
    error: '#F31260',
    info: '#0072F5',
    border: '#EAEAEA',
    divider: '#F1F1F1',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,

    // Added NeoPOP-inspired dark theme colors
    secondary: '#FF9F5A',
    accent: '#FF4D8D',
    surface: '#1E2021',
    cardBackground: '#202425',
    textSecondary: '#9BA1A6',
    textTertiary: '#6F767E',
    success: '#20E07B',
    warning: '#FFBA44',
    error: '#FF4D8D',
    info: '#3694FF',
    border: '#2A2D2E',
    divider: '#252829',
  },
};