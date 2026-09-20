export const colors = {
  background: {
    primary: '#070707',
    secondary: '#111111',
    card: '#181818',
    surface: '#202020',
  },
  border: {
    default: 'rgba(255, 255, 255, 0.06)',
    active: 'rgba(245, 166, 35, 0.3)',
  },
  accent: {
    primary: '#F5A623',
    secondaryGold: '#FFB938',
  },
  status: {
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#A1A1AA',
    muted: '#71717A',
  },
} as const;

export type Colors = typeof colors;
