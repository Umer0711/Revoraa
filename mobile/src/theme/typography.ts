export const typography = {
  fontFamily: {
    heading: 'System', // SF Pro Display on iOS, Roboto/System on Android
    body: 'System', // SF Pro Text on iOS, Roboto/System on Android
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
} as const;
