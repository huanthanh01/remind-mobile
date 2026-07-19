/**
 * ReMind design tokens – brand palette, semantic colours and typography.
 * Ported from the web frontend's index.css :root variables.
 * Light-mode only for now.
 */

import { Platform } from 'react-native';

/* ───── Brand palette ───── */
export const Brand = {
  700: '#176B68',
  600: '#23817D',
  500: '#2A9D8F',
  300: '#76C7BD',
  200: '#A1D9D3',
  100: '#DDF1EF',
  '050': '#EFF8F7',
} as const;

/* ───── Calm-blue (secondary) ───── */
export const CalmBlue = {
  600: '#477FA3',
  100: '#DFEEF7',
  '050': '#F2F8FC',
} as const;

/* ───── Neutrals ───── */
export const Ink = {
  900: '#172A2A',
  700: '#365252',
  600: '#4A6363',
  500: '#617878',
  400: '#7A9090',
  300: '#9DB3B3',
} as const;

export const Surface = {
  canvas: '#F7FAF9',
  white: '#FFFFFF',
  muted: '#EEF4F3',
  border: '#D6E2E0',
  borderStrong: '#AFC4C2',
} as const;

/* ───── Semantic colours ───── */
export const Semantic = {
  success: '#267A57',
  successBg: '#E4F4EB',
  warning: '#9A6A1E',
  warningBg: '#FAF0D9',
  error: '#A04747',
  errorBg: '#F9E7E7',
  info: '#477FA3',
  infoBg: '#DFEEF7',
} as const;

/* ───── Typography ───── */
export const FontSize = {
  xs: 12,
  sm: 13,
  base: 15,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
} as const;

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

/* ───── Spacing / Radius ───── */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
} as const;

export const Radius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

/* ───── Shadow presets ───── */
export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
} as const;

/* ───── Existing Colors export (extended) ───── */
const tintColorLight = Brand[700];
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: Ink[700],
    textHeading: Ink[900],
    background: Surface.canvas,
    surface: Surface.white,
    tint: tintColorLight,
    icon: Ink[500],
    tabIconDefault: Ink[400],
    tabIconSelected: tintColorLight,
    border: Surface.border,
  },
  dark: {
    text: '#ECEDEE',
    textHeading: '#FFFFFF',
    background: '#151718',
    surface: '#1E2122',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    border: '#2E3234',
  },
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'Georgia',
    rounded: 'System',
    mono: 'Menlo',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
});
