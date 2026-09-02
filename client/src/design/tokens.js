/**
 * FinFootprint Design System Tokens
 *
 * A distinctive visual identity for a financial footprint platform
 * serving informal workers — vegetable vendors, micro-entrepreneurs,
 * street vendors, and small business owners in India.
 *
 * Design philosophy: "Trust earned, not given"
 * - Grounded in the material reality of daily commerce
 * - Warmth without sentimentality; structure without rigidity
 * - Every token serves the goal of building credible financial identity
 */

// ============================================================
// COLOR PALETTE
// ============================================================

/**
 * Core brand colors — derived from the material world of informal commerce:
 * - Turmeric/yellow: the spice trade, daily cash handling, warmth of hand-to-hand exchange
 * - Deep indigo: ink of ledger books, trust, institutional credibility
 * - Terracotta: clay pots for savings, earthiness of street markets
 * - Slate/charcoal: carbon paper, receipts, the administrative layer
 *
 * Avoids: generic fintech blues, sterile whites, "trust me" greens
 */
export const colors = {
  // Brand Primaries
  brand: {
    // Turmeric — the color of daily commerce, hand-stained fingers counting notes
    turmeric: {
      50: '#FFF8E7',
      100: '#FFF0C9',
      200: '#FFE093',
      300: '#FFCC5C',
      400: '#FFB82E',
      500: '#FFA31A',  // Primary brand
      600: '#E68A0E',
      700: '#B3660B',
      800: '#804D08',
      900: '#4D2604',
      950: '#261302',
    },

    // Indigo — ledger ink, institutional trust, the bridge to formal finance
    indigo: {
      50: '#EEF0FA',
      100: '#DCE1F5',
      200: '#B9C3EB',
      300: '#96A5E1',
      400: '#7282D4',
      500: '#5A68C8',  // Primary action
      600: '#4551A6',
      700: '#364083',
      800: '#282F60',
      900: '#1D2244',
      950: '#0E1122',
    },

    // Terracotta — clay savings pots, earth of the marketplace
    terracotta: {
      50: '#FDF3F0',
      100: '#FBE7E2',
      200: '#F5CFC4',
      300: '#EDB2A0',
      400: '#E48F74',
      500: '#DB6D4D',  // Accent/warning
      600: '#C4553C',
      700: '#9E4330',
      800: '#783325',
      900: '#5C291F',
      950: '#2E140F',
    },
  },

  // Semantic colors — mapped to evidence tiers
  evidence: {
    // VERIFIED — Bank-grade, digitally reconciled
    verified: {
      light: '#065F46',   // emerald-800
      DEFAULT: '#047857', // emerald-700
      dark: '#064E3B',    // emerald-900
      bg: '#ECFDF5',      // emerald-50
      bgDark: '#022C22',  // emerald-950
      border: '#A7F3D0',  // emerald-300
      borderDark: '#064E3B',
    },

    // CORROBORATED — Cross-referenced, multiple sources
    corroborated: {
      light: '#1E3A8A',   // blue-800
      DEFAULT: '#1E40AF', // blue-700
      dark: '#172554',    // blue-900
      bg: '#EFF6FF',      // blue-50
      bgDark: '#0C1A3A',  // blue-950
      border: '#BFDBFE',  // blue-300
      borderDark: '#1E3A8A',
    },

    // SELF_DECLARED — Worker's own word, pending verification
    selfDeclared: {
      light: '#854D0E',   // amber-800
      DEFAULT: '#B45309', // amber-700
      dark: '#78350F',    // amber-900
      bg: '#FFFBEB',      // amber-50
      bgDark: '#1F1D15',  // amber-950
      border: '#FDE68A',  // amber-300
      borderDark: '#854D0E',
    },

    // MISMATCH — Discrepancy detected, needs review
    mismatch: {
      light: '#991B1B',   // red-800
      DEFAULT: '#B91C1C', // red-700
      dark: '#7F1D1D',    // red-900
      bg: '#FEF2F2',      // red-50
      bgDark: '#2E0A0A',  // red-950
      border: '#FCA5A5',  // red-300
      borderDark: '#991B1B',
    },
  },

  // Neutral scale — warm slate, not cold gray
  neutral: {
    0: '#FFFFFF',
    50: '#FAFAF8',   // warm white — paper, receipts
    100: '#F3F1ED',  // subtle warmth
    200: '#E7E3DB',  // divider lines
    300: '#D6D1C7',  // disabled borders
    400: '#B8B1A4',  // placeholder text
    500: '#9A9284',  // secondary labels
    600: '#7C7466',  // body text (light)
    700: '#5E574C',  // headings (light)
    800: '#3D3830',  // headings (dark)
    900: '#26221D',  // primary text (dark)
    950: '#161310',  // near-black, not pure
    1000: '#0A0908', // absolute minimum
  },

  // Status / feedback
  status: {
    success: { light: '#065F46', DEFAULT: '#047857', dark: '#064E3B' },
    warning: { light: '#854D0E', DEFAULT: '#B45309', dark: '#78350F' },
    error: { light: '#991B1B', DEFAULT: '#B91C1C', dark: '#7F1D1D' },
    info: { light: '#1E3A8A', DEFAULT: '#1E40AF', dark: '#172554' },
  },

  // Surface layers
  surface: {
    // Light mode
    light: {
      base: '#FFFFFF',
      raised: '#FAFAF8',
      sunken: '#F3F1ED',
      overlay: 'rgba(22, 19, 16, 0.45)',
    },
    // Dark mode
    dark: {
      base: '#161310',
      raised: '#1E1A16',
      sunken: '#0F0D0B',
      overlay: 'rgba(22, 19, 16, 0.65)',
    },
  },
};

// ============================================================
// TYPOGRAPHY
// ============================================================

/**
 * Type system: One family for everything — Plus Jakarta Sans
 * - Geometric but human, legible at small sizes
 * - Distinctive enough to not look like system UI
 * - Strong numerals for financial data
 * - Tamil: Noto Sans Tamil (harmonized metrics)
 */
export const typography = {
  fontFamilies: {
    sans: '"Plus Jakarta Sans", "Noto Sans Tamil", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    tamil: '"Noto Sans Tamil", "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  },

  fontWeights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Type scale — based on 1.25 major third ratio
  // Starts at 13px base for dense financial data legibility
  fontSizes: {
    xs: '0.75rem',    // 12px — metadata, timestamps
    sm: '0.8125rem',  // 13px — base body
    base: '0.875rem', // 14px — comfortable reading
    lg: '1rem',       // 16px — emphasized body
    xl: '1.125rem',   // 18px — small headings
    '2xl': '1.25rem', // 20px — section heads
    '3xl': '1.5625rem', // 25px — page titles
    '4xl': '1.953rem',  // 31px — hero
    '5xl': '2.441rem',  // 39px — display
  },

  lineHeights: {
    tight: 1.2,
    snug: 1.35,
    normal: 1.55,
    relaxed: 1.7,
  },

  letterSpacings: {
    tighter: '-0.02em',
    tight: '-0.01em',
    normal: '0',
    wide: '0.01em',
    wider: '0.02em',
    widest: '0.05em', // for uppercase labels
  },
};

// ============================================================
// SPACING & LAYOUT
// ============================================================

/**
 * Spacing scale — 4px base unit, but with intentional gaps
 * for financial data density
 */
export const spacing = {
  0: '0',
  1: '0.125rem',   // 2px
  2: '0.25rem',    // 4px
  3: '0.375rem',   // 6px
  4: '0.5rem',     // 8px
  5: '0.625rem',   // 10px
  6: '0.75rem',    // 12px
  7: '0.875rem',   // 14px
  8: '1rem',       // 16px
  9: '1.125rem',   // 18px
  10: '1.25rem',   // 20px
  11: '1.375rem',  // 22px
  12: '1.5rem',    // 24px
  14: '1.75rem',   // 28px
  16: '2rem',      // 32px
  20: '2.5rem',    // 40px
  24: '3rem',      // 48px
  28: '3.5rem',    // 56px
  32: '4rem',      // 64px
  36: '4.5rem',    // 72px
  40: '5rem',      // 80px
  48: '6rem',      // 96px
  56: '7rem',      // 112px
  64: '8rem',      // 128px
};

// Layout constants
export const layout = {
  // Container max-widths
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1440px',
    full: '100%',
  },

  // Sidebar widths
  sidebar: {
    collapsed: '64px',
    expanded: '260px',
    mobile: '280px',
  },

  // Header heights
  header: {
    desktop: '64px',
    mobile: '56px',
  },

  // Border radius — intentional, not uniform
  radius: {
    none: '0',
    xs: '0.125rem',   // 2px — tight elements
    sm: '0.25rem',    // 4px — buttons, inputs
    md: '0.5rem',     // 8px — cards, dropdowns
    lg: '0.75rem',    // 12px — modals, panels
    xl: '1rem',       // 16px — major containers
    '2xl': '1.5rem',  // 24px — hero sections
    full: '9999px',   // pills, badges
  },

  // Shadows — layered, not flat
  shadows: {
    none: 'none',
    xs: '0 1px 2px 0 rgba(22, 19, 16, 0.04)',
    sm: '0 1px 3px 0 rgba(22, 19, 16, 0.06), 0 1px 2px -1px rgba(22, 19, 16, 0.06)',
    md: '0 4px 6px -1px rgba(22, 19, 16, 0.07), 0 2px 4px -2px rgba(22, 19, 16, 0.07)',
    lg: '0 10px 15px -3px rgba(22, 19, 16, 0.08), 0 4px 6px -4px rgba(22, 19, 16, 0.08)',
    xl: '0 20px 25px -5px rgba(22, 19, 16, 0.1), 0 8px 10px -6px rgba(22, 19, 16, 0.1)',
    '2xl': '0 25px 50px -12px rgba(22, 19, 16, 0.15)',
    inner: 'inset 0 2px 4px 0 rgba(22, 19, 16, 0.05)',
    // Focus ring
    focus: '0 0 0 3px rgba(90, 104, 200, 0.35)',
    focusError: '0 0 0 3px rgba(185, 28, 28, 0.35)',
  },

  // Z-index layers
  zIndex: {
    base: 0,
    dropdown: 100,
    sticky: 200,
    fixed: 300,
    modalBackdrop: 400,
    modal: 500,
    popover: 600,
    tooltip: 700,
    toast: 800,
  },
};

// ============================================================
// MOTION & TRANSITIONS
// ============================================================

export const motion = {
  durations: {
    instant: '0ms',
    fast: '120ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },

  easings: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Custom: springy but controlled
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },

  // Reduced motion
  reducedMotion: {
    durations: {
      fast: '0ms',
      normal: '0ms',
      slow: '0ms',
      slower: '0ms',
    },
  },
};

// ============================================================
// BREAKPOINTS
// ============================================================

export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// ============================================================
// COMPONENT-SPECIFIC TOKENS
// ============================================================

export const components = {
  // Button variants
  button: {
    heights: {
      sm: '32px',
      md: '40px',
      lg: '48px',
      xl: '56px',
    },
    padding: {
      sm: '0 12px',
      md: '0 16px',
      lg: '0 24px',
      xl: '0 32px',
    },
  },

  // Input fields
  input: {
    heights: {
      sm: '36px',
      md: '44px',
      lg: '52px',
    },
  },

  // Cards
  card: {
    padding: {
      sm: '12px',
      md: '16px',
      lg: '24px',
    },
  },

  // Tables
  table: {
    cellPadding: '12px 16px',
    headerHeight: '44px',
    rowHeight: '52px',
  },
};

// ============================================================
// EXPORT ALL
// ============================================================

export const designTokens = {
  colors,
  typography,
  spacing,
  layout,
  motion,
  breakpoints,
  components,
};

export default designTokens;