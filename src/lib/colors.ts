/**
 * Color Palette and Design Tokens
 * 
 * This file contains all the color definitions and utility functions
 * for the iDEAL School Admin Dashboard theme.
 * 
 * Primary Theme: Blue (#3da5f5) with white backgrounds
 * Accent Theme: Red (#f7020b) for highlights and important actions
 */

// Primary Blue Color Palette
export const primaryColors = {
  50: '#f0f8ff',
  100: '#e0f2fe',
  200: '#bae6fd',
  300: '#7dd3fc',
  400: '#38bdf8',
  500: '#3da5f5', // Main primary blue
  600: '#0284c7',
  700: '#0369a1',
  800: '#075985',
  900: '#0c4a6e',
} as const;

// Accent Red Color Palette
export const accentColors = {
  50: '#fef2f2',
  100: '#fee2e2',
  200: '#fecaca',
  300: '#fca5a5',
  400: '#f87171',
  500: '#f7020b', // Main accent red
  600: '#dc2626',
  700: '#b91c1c',
  800: '#991b1b',
  900: '#7f1d1d',
} as const;

// Neutral Gray Palette
export const neutralColors = {
  50: '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
} as const;

// Semantic Colors
export const semanticColors = {
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  error: accentColors,
  info: primaryColors,
} as const;

// Background Colors
export const backgroundColors = {
  primary: '#ffffff',
  secondary: '#f8fafc',
  tertiary: '#f1f5f9',
} as const;

// Text Colors
export const textColors = {
  primary: '#0f172a',
  secondary: '#475569',
  tertiary: '#64748b',
  inverse: '#ffffff',
} as const;

// Shadow Colors
export const shadowColors = {
  primary: 'rgba(61, 165, 245, 0.15)',
  accent: 'rgba(247, 2, 11, 0.15)',
  soft: 'rgba(0, 0, 0, 0.05)',
  medium: 'rgba(0, 0, 0, 0.1)',
  strong: 'rgba(0, 0, 0, 0.15)',
} as const;

// Utility Functions
export const getColorValue = (color: string, shade: number = 500): string => {
  const colorMap: Record<string, Record<number, string>> = {
    primary: primaryColors,
    accent: accentColors,
    neutral: neutralColors,
  };
  
  return colorMap[color]?.[shade] || color;
};

// CSS Custom Properties
export const cssVariables = {
  '--primary-50': primaryColors[50],
  '--primary-100': primaryColors[100],
  '--primary-200': primaryColors[200],
  '--primary-300': primaryColors[300],
  '--primary-400': primaryColors[400],
  '--primary-500': primaryColors[500],
  '--primary-600': primaryColors[600],
  '--primary-700': primaryColors[700],
  '--primary-800': primaryColors[800],
  '--primary-900': primaryColors[900],
  
  '--accent-50': accentColors[50],
  '--accent-100': accentColors[100],
  '--accent-200': accentColors[200],
  '--accent-300': accentColors[300],
  '--accent-400': accentColors[400],
  '--accent-500': accentColors[500],
  '--accent-600': accentColors[600],
  '--accent-700': accentColors[700],
  '--accent-800': accentColors[800],
  '--accent-900': accentColors[900],
  
  '--bg-primary': backgroundColors.primary,
  '--bg-secondary': backgroundColors.secondary,
  '--bg-tertiary': backgroundColors.tertiary,
  
  '--text-primary': textColors.primary,
  '--text-secondary': textColors.secondary,
  '--text-tertiary': textColors.tertiary,
  '--text-inverse': textColors.inverse,
} as const;

// Theme Configuration
export const theme = {
  colors: {
    primary: primaryColors,
    accent: accentColors,
    neutral: neutralColors,
    semantic: semanticColors,
    background: backgroundColors,
    text: textColors,
    shadow: shadowColors,
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
  },
  shadows: {
    soft: '0 2px 8px 0 rgba(0, 0, 0, 0.05)',
    medium: '0 4px 12px 0 rgba(0, 0, 0, 0.1)',
    strong: '0 8px 24px 0 rgba(0, 0, 0, 0.15)',
    primary: '0 4px 14px 0 rgba(61, 165, 245, 0.15)',
    accent: '0 4px 14px 0 rgba(247, 2, 11, 0.15)',
  },
} as const;

// Export all colors for easy access
export const colors = {
  ...primaryColors,
  ...accentColors,
  ...neutralColors,
  ...semanticColors,
  ...backgroundColors,
  ...textColors,
  ...shadowColors,
} as const;

export default theme;
