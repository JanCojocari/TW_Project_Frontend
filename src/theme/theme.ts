import { createTheme, alpha } from '@mui/material/styles';

// ─── Raw palette tokens ────────────────────────────────────────────────────
const raw = {
    bgDefault:   '#F8F9FB',
    bgPaper:     '#FFFFFF',
    bgAlternate: '#EAE7E1',

    primaryMain:  '#4C8BF5',
    primaryLight: '#7BAEF8',
    primaryDark:  '#2F6FE4',

    secondaryMain:  '#FF7A5C',
    secondaryLight: '#FFB38A',
    secondaryDark:  '#E55A3C',

    successMain:  '#7DAA92',
    successLight: '#A0C4AF',
    successDark:  '#5A8A73',

    errorMain:  '#EF4444',
    errorLight: '#F87171',
    errorDark:  '#DC2626',

    warningMain:  '#F59E0B',
    warningLight: '#FCD34D',
    warningDark:  '#D97706',

    textPrimary:   '#1F2937',
    textSecondary: '#6B7280',
    textDisabled:  '#9CA3AF',

    divider: 'rgba(76, 139, 245, 0.12)',
};

export const rentoraTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main:         raw.primaryMain,
            light:        raw.primaryLight,
            dark:         raw.primaryDark,
            contrastText: '#FFFFFF',
        },
        secondary: {
            main:         raw.secondaryMain,
            light:        raw.secondaryLight,
            dark:         raw.secondaryDark,
            contrastText: '#FFFFFF',
        },
        success: {
            main:         raw.successMain,
            light:        raw.successLight,
            dark:         raw.successDark,
            contrastText: '#FFFFFF',
        },
        error: {
            main:  raw.errorMain,
            light: raw.errorLight,
            dark:  raw.errorDark,
        },
        warning: {
            main:  raw.warningMain,
            light: raw.warningLight,
            dark:  raw.warningDark,
        },
        info: {
            main:  raw.primaryMain,
            light: raw.primaryLight,
            dark:  raw.primaryDark,
        },
        background: {
            default: raw.bgDefault,
            paper:   raw.bgPaper,
        },
        text: {
            primary:   raw.textPrimary,
            secondary: raw.textSecondary,
            disabled:  raw.textDisabled,
        },
        divider: raw.divider,
    },

    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 900, fontSize: '3rem',    lineHeight: 1.2 },
        h2: { fontWeight: 900, fontSize: '2.5rem',  lineHeight: 1.2 },
        h3: { fontWeight: 900, fontSize: '2rem',    lineHeight: 1.3 },
        h4: { fontWeight: 700, fontSize: '1.75rem', lineHeight: 1.3 },
        h5: { fontWeight: 700, fontSize: '1.5rem',  lineHeight: 1.4 },
        h6: { fontWeight: 700, fontSize: '1.25rem', lineHeight: 1.4 },
        button: { textTransform: 'none', fontWeight: 600 },
    },

    shape: { borderRadius: 12 },

    shadows: [
        'none',
        `0 1px 3px ${alpha(raw.primaryMain, 0.04)}, 0 1px 2px ${alpha(raw.primaryMain, 0.06)}`,
        `0 4px 6px ${alpha(raw.primaryMain, 0.05)}, 0 2px 4px ${alpha(raw.primaryMain, 0.06)}`,
        `0 10px 15px ${alpha(raw.primaryMain, 0.08)}, 0 4px 6px ${alpha(raw.primaryMain, 0.05)}`,
        `0 20px 25px ${alpha(raw.primaryMain, 0.08)}, 0 10px 10px ${alpha(raw.primaryMain, 0.04)}`,
        `0 25px 50px ${alpha(raw.primaryMain, 0.10)}`,
        `0 25px 50px ${alpha(raw.primaryMain, 0.12)}`,
        `0 25px 50px ${alpha(raw.primaryMain, 0.14)}`,
        `0 25px 50px ${alpha(raw.primaryMain, 0.16)}`,
        `0 25px 50px ${alpha(raw.primaryMain, 0.18)}`,
        `0 25px 50px ${alpha(raw.primaryMain, 0.20)}`,
        `0 25px 50px ${alpha(raw.primaryMain, 0.22)}`,
        `0 25px 50px ${alpha(raw.primaryMain, 0.24)}`,
        `0 25px 50px ${alpha(raw.primaryMain, 0.26)}`,
        `0 25px 50px ${alpha(raw.primaryMain, 0.28)}`,
        `0 25px 50px ${alpha(raw.primaryMain, 0.30)}`,
        `0 25px 50px ${alpha(raw.primaryMain, 0.32)}`,
        `0 25px 50px ${alpha(raw.primaryMain, 0.34)}`,
        `0 25px 50px ${alpha(raw.primaryMain, 0.36)}`,
        `0 25px 50px ${alpha(raw.primaryMain, 0.38)}`,
        `0 25px 50px ${alpha(raw.primaryMain, 0.40)}`,
        `0 25px 50px ${alpha(raw.primaryMain, 0.42)}`,
        `0 25px 50px ${alpha(raw.primaryMain, 0.44)}`,
        `0 25px 50px ${alpha(raw.primaryMain, 0.46)}`,
        `0 25px 50px ${alpha(raw.primaryMain, 0.48)}`,
    ],

    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background:     raw.bgPaper,
                    borderBottom:   `1px solid ${raw.divider}`,
                    backdropFilter: 'blur(12px)',
                    color:          raw.textPrimary,
                    boxShadow:      `0 1px 12px ${alpha(raw.primaryMain, 0.08)}`,
                },
            },
        },

        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    padding:     '10px 24px',
                    fontSize:    '15px',
                    fontWeight:   700,
                    boxShadow:   'none',
                    transition:  'all 0.25s ease',
                    '&:hover': {
                        boxShadow: `0 4px 16px ${alpha(raw.primaryMain, 0.25)}`,
                        transform: 'translateY(-2px)',
                    },
                },
                contained: {
                    background: `linear-gradient(135deg, ${raw.primaryMain}, ${raw.primaryDark})`,
                    color:      '#FFFFFF',
                    '&:hover': {
                        background: `linear-gradient(135deg, ${raw.primaryDark}, ${raw.primaryMain})`,
                        boxShadow:  `0 6px 20px ${alpha(raw.primaryMain, 0.35)}`,
                    },
                    '&.Mui-disabled': {
                        background: alpha(raw.primaryMain, 0.2),
                        color:      raw.textDisabled,
                    },
                },
                outlined: {
                    borderColor: raw.primaryMain,
                    color:       raw.primaryMain,
                    '&:hover': {
                        background:  alpha(raw.primaryMain, 0.06),
                        borderColor: raw.primaryDark,
                    },
                },
                text: {
                    color: raw.primaryMain,
                    '&:hover': {
                        background: alpha(raw.primaryMain, 0.06),
                    },
                },
            },
        },

        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow:    `0 4px 20px ${alpha(raw.primaryMain, 0.08)}`,
                    border:       `1px solid ${raw.divider}`,
                    background:   raw.bgPaper,
                    transition:   'all 0.3s ease',
                    '&:hover': {
                        transform:   'translateY(-6px)',
                        boxShadow:   `0 16px 40px ${alpha(raw.primaryMain, 0.14)}`,
                        borderColor: raw.primaryMain,
                    },
                },
            },
        },

        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    background:   raw.bgPaper,
                },
                elevation0:  { boxShadow: 'none' },
                elevation1:  { boxShadow: `0 4px 20px ${alpha(raw.primaryMain, 0.08)}` },
                elevation2:  { boxShadow: `0 8px 32px ${alpha(raw.primaryMain, 0.10)}` },
                outlined: {
                    border:    `1px solid ${raw.divider}`,
                    boxShadow: 'none',
                },
            },
        },

        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight:   600,
                },
                colorSuccess: {
                    background: alpha(raw.successMain, 0.15),
                    color:      raw.successDark,
                    border:     `1px solid ${alpha(raw.successMain, 0.3)}`,
                },
                colorError: {
                    background: alpha(raw.errorMain, 0.15),
                    color:      raw.errorDark,
                    border:     `1px solid ${alpha(raw.errorMain, 0.3)}`,
                },
                colorPrimary: {
                    background: alpha(raw.primaryMain, 0.12),
                    color:      raw.primaryDark,
                    border:     `1px solid ${alpha(raw.primaryMain, 0.25)}`,
                },
                colorSecondary: {
                    background: alpha(raw.secondaryMain, 0.15),
                    color:      raw.secondaryDark,
                    border:     `1px solid ${alpha(raw.secondaryMain, 0.3)}`,
                },
            },
        },

        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
                        background:   raw.bgDefault,
                        '& fieldset': {
                            borderColor: raw.divider,
                        },
                        '&:hover fieldset': {
                            borderColor: raw.primaryMain,
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: raw.primaryMain,
                            borderWidth: 2,
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: raw.textSecondary,
                        '&.Mui-focused': { color: raw.primaryMain },
                    },
                    '& .MuiInputBase-input': {
                        color: raw.textPrimary,
                    },
                },
            },
        },

        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight:    700,
                    fontSize:      '15px',
                    color:         raw.textSecondary,
                    '&.Mui-selected': { color: raw.primaryMain },
                },
            },
        },

        MuiTabs: {
            styleOverrides: {
                indicator: {
                    background:   raw.primaryMain,
                    height:       3,
                    borderRadius: '3px 3px 0 0',
                    boxShadow:    `0 0 8px ${alpha(raw.primaryMain, 0.5)}`,
                },
            },
        },

        MuiDivider: {
            styleOverrides: {
                root: { borderColor: raw.divider },
            },
        },

        MuiIconButton: {
            styleOverrides: {
                root: {
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        background: alpha(raw.primaryMain, 0.08),
                    },
                },
            },
        },

        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    '&:hover': {
                        background: alpha(raw.primaryMain, 0.06),
                    },
                },
            },
        },

        MuiAlert: {
            styleOverrides: {
                root: { borderRadius: 12 },
                standardSuccess: {
                    background: alpha(raw.successMain, 0.12),
                    color:      raw.successDark,
                    '& .MuiAlert-icon': { color: raw.successDark },
                },
                standardError: {
                    background: alpha(raw.errorMain, 0.12),
                    color:      raw.errorDark,
                    '& .MuiAlert-icon': { color: raw.errorDark },
                },
            },
        },

        MuiDrawer: {
            styleOverrides: {
                paper: {
                    background:  raw.bgPaper,
                    borderLeft:  `1px solid ${raw.divider}`,
                },
            },
        },

        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    background: raw.bgDefault,
                    color:      raw.textPrimary,
                    margin:     0,
                },
                '::selection': {
                    background: alpha(raw.primaryMain, 0.2),
                    color:      raw.primaryDark,
                },
            },
        },
    },
});

export default rentoraTheme;