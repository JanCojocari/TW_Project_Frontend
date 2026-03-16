// ─── Rentora gradient & colour tokens ────────────────────────────────────────
// Keep in sync with theme.ts raw palette values.

export const gradients = {
    // Primary — Vacation Blue
    primary:        'linear-gradient(135deg, #7096BE, #4E7AA6)',
    primaryReverse: 'linear-gradient(135deg, #4E7AA6, #7096BE)',
    primaryHover:   'linear-gradient(135deg, #4E7AA6, #7096BE)',
    textPrimary:    'linear-gradient(90deg, #7096BE, #4E7AA6)',
    textSunset:     'linear-gradient(90deg, #7096BE, #FF7A5C)',

    // Secondary — Warm Sunset Coral
    secondary:        'linear-gradient(135deg, #FF7A5C, #FFB38A)',
    secondaryReverse: 'linear-gradient(135deg, #FFB38A, #FF7A5C)',

    // Success — Sage Green
    success: 'linear-gradient(135deg, #7DAA92, #5A8A73)',

    // Combo — Blue + Coral (special hero accents)
    sunset: 'linear-gradient(135deg, #4C8BF5, #FF7A5C)',

    // Page backgrounds
    bgLight: 'linear-gradient(135deg, #F8F9FB 0%, #EAE7E1 100%)',
    hero:    'radial-gradient(circle at 70% 30%, rgba(76,139,245,0.07), transparent 55%), linear-gradient(135deg, #F8F9FB 0%, #EAE7E1 100%)',
    cta:     'linear-gradient(135deg, #F8F9FB 0%, #EAE7E1 60%, #F8F9FB 100%)',
};

export const colors = {
    // Backgrounds
    bgDefault:   '#F8F9FB',
    bgPaper:     '#FFFFFF',
    bgAlternate: '#EAE7E1',

    // Primary
    primary:      '#4C8BF5',
    primaryLight: '#7BAEF8',
    primaryDark:  '#2F6FE4',

    // Secondary
    secondary:      '#FF7A5C',
    secondaryLight: '#FFB38A',
    secondaryDark:  '#E55A3C',

    // Success
    success:      '#7DAA92',
    successLight: '#A0C4AF',
    successDark:  '#5A8A73',

    // Error
    error:     '#EF4444',
    errorDark: '#DC2626',

    // Text
    textPrimary:   '#1F2937',
    textSecondary: '#6B7280',
    textDisabled:  '#9CA3AF',

    // Borders / dividers
    border:      'rgba(76, 139, 245, 0.12)',
    borderHover: 'rgba(76, 139, 245, 0.35)',

    // Alpha helpers
    primaryAlpha06:  'rgba(76, 139, 245, 0.06)',
    primaryAlpha10:  'rgba(76, 139, 245, 0.10)',
    primaryAlpha15:  'rgba(76, 139, 245, 0.15)',
    primaryAlpha25:  'rgba(76, 139, 245, 0.25)',
    secondaryAlpha15:'rgba(255, 122, 92,  0.15)',
    successAlpha15:  'rgba(125, 170, 146, 0.15)',
    errorAlpha15:    'rgba(239,  68,  68,  0.15)',
};

export default { gradients, colors };