import { createTheme } from '@mui/material/styles';

// 楽天カラーパレット
const colors = {
  primary: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444', // 楽天レッド
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  secondary: {
    50: '#ffffff', // 白
    100: '#ffffff',
    200: '#ffffff',
    300: '#ffffff',
    400: '#ffffff',
    500: '#ffffff',
    600: '#ffffff',
    700: '#ffffff',
    800: '#ffffff',
    900: '#ffffff',
  },
  neutral: {
    50: '#ffffff', // 純白
    100: '#fafafa',
    200: '#f5f5f5',
    300: '#e5e5e5',
    400: '#d4d4d4',
    500: '#a3a3a3',
    600: '#737373',
    700: '#525252',
    800: '#404040',
    900: '#262626',
  },
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
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
};

// タイポグラフィ設定
const typography = {
  fontFamily: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.025em',
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.025em',
  },
  h3: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '-0.025em',
  },
  h4: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h5: {
    fontSize: '1.125rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.6,
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.6,
  },
  button: {
    fontWeight: 600,
    textTransform: 'none',
  },
};

// シャドウ設定
const shadows = [
  'none',
  '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  '0 35px 60px -12px rgb(0 0 0 / 0.3)',
  '0 40px 80px -12px rgb(0 0 0 / 0.4)',
  '0 50px 100px -20px rgb(0 0 0 / 0.5)',
  '0 60px 120px -20px rgb(0 0 0 / 0.6)',
  '0 70px 140px -20px rgb(0 0 0 / 0.7)',
  '0 80px 160px -20px rgb(0 0 0 / 0.8)',
  '0 90px 180px -20px rgb(0 0 0 / 0.9)',
  '0 100px 200px -20px rgb(0 0 0 / 1)',
  '0 110px 220px -20px rgb(0 0 0 / 1)',
  '0 120px 240px -20px rgb(0 0 0 / 1)',
  '0 130px 260px -20px rgb(0 0 0 / 1)',
  '0 140px 280px -20px rgb(0 0 0 / 1)',
  '0 150px 300px -20px rgb(0 0 0 / 1)',
  '0 160px 320px -20px rgb(0 0 0 / 1)',
  '0 170px 340px -20px rgb(0 0 0 / 1)',
  '0 180px 360px -20px rgb(0 0 0 / 1)',
  '0 190px 380px -20px rgb(0 0 0 / 1)',
  '0 200px 400px -20px rgb(0 0 0 / 1)',
];

// メインテーマ
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary[600],
      light: colors.primary[400],
      dark: colors.primary[800],
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffffff', // 白
      light: '#ffffff',
      dark: '#ffffff',
      contrastText: '#ef4444',
    },
    background: {
      default: '#ffffff', // 純白背景
      paper: '#ffffff',
    },
    text: {
      primary: colors.neutral[900],
      secondary: colors.neutral[600],
    },
    success: {
      main: '#ef4444', // 楽天レッド
      light: '#f87171',
      dark: '#dc2626',
    },
    warning: {
      main: '#ef4444', // 楽天レッド
      light: '#f87171',
      dark: '#dc2626',
    },
    error: {
      main: '#ef4444', // 楽天レッド
      light: '#f87171',
      dark: '#dc2626',
    },
  },
  typography,
  shadows,
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          },
        },
        sizeSmall: {
          padding: '6px 12px',
          fontSize: '0.75rem',
          minHeight: '32px',
        },
        sizeMedium: {
          padding: '8px 16px',
          fontSize: '0.875rem',
          minHeight: '40px',
        },
        sizeLarge: {
          padding: '12px 24px',
          fontSize: '1rem',
          minHeight: '48px',
        },
        contained: {
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

// ダークテーマ
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.primary[500],
      light: colors.primary[300],
      dark: colors.primary[700],
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffffff', // 白
      light: '#ffffff',
      dark: '#ffffff',
      contrastText: '#ef4444',
    },
    background: {
      default: '#ffffff', // ダークモードでも白背景
      paper: '#ffffff',
    },
    text: {
      primary: colors.neutral[100],
      secondary: colors.neutral[400],
    },
    success: {
      main: '#ef4444', // 楽天レッド
      light: '#f87171',
      dark: '#dc2626',
    },
    warning: {
      main: '#ef4444', // 楽天レッド
      light: '#f87171',
      dark: '#dc2626',
    },
    error: {
      main: '#ef4444', // 楽天レッド
      light: '#f87171',
      dark: '#dc2626',
    },
  },
  typography,
  shadows,
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)',
          },
        },
        sizeSmall: {
          padding: '6px 12px',
          fontSize: '0.75rem',
          minHeight: '32px',
        },
        sizeMedium: {
          padding: '8px 16px',
          fontSize: '0.875rem',
          minHeight: '40px',
        },
        sizeLarge: {
          padding: '12px 24px',
          fontSize: '1rem',
          minHeight: '48px',
        },
        contained: {
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3)',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});
