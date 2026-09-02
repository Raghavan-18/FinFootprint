/**
 * FinFootprint Tailwind CSS Configuration
 *
 * Maps design tokens to Tailwind v4 @theme syntax
 * This file is consumed by the CSS @theme directive
 */

import designTokens from './client/src/design/tokens.js';

const { colors, typography, spacing, layout, motion, breakpoints, components } = designTokens;

// Helper to flatten color objects for Tailwind
const flattenColors = (obj, prefix = '') => {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}-${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenColors(value, newKey));
    } else {
      result[newKey] = value;
    }
  }
  return result;
};

// Flatten all color scales
const colorTokens = {
  ...flattenColors(colors.brand),
  ...flattenColors(colors.evidence),
  ...flattenColors(colors.neutral),
  ...flattenColors(colors.status),
  // Surface colors as semantic tokens
  'surface-base-light': colors.surface.light.base,
  'surface-raised-light': colors.surface.light.raised,
  'surface-sunken-light': colors.surface.light.sunken,
  'surface-overlay-light': colors.surface.light.overlay,
  'surface-base-dark': colors.surface.dark.base,
  'surface-raised-dark': colors.surface.dark.raised,
  'surface-sunken-dark': colors.surface.dark.sunken,
  'surface-overlay-dark': colors.surface.dark.overlay,
};

export default {
  theme: {
    extend: {
      // Colors
      colors: colorTokens,

      // Font families
      fontFamily: {
        sans: typography.fontFamilies.sans.split(',').map(f => f.trim().replace(/"/g, '')),
        tamil: typography.fontFamilies.tamil.split(',').map(f => f.trim().replace(/"/g, '')),
        mono: typography.fontFamilies.mono.split(',').map(f => f.trim().replace(/"/g, '')),
      },

      // Font sizes
      fontSize: Object.fromEntries(
        Object.entries(typography.fontSizes).map(([key, value]) => [
          key,
          [value, { lineHeight: typography.lineHeights.normal }],
        ])
      ),

      // Font weights
      fontWeight: typography.fontWeights,

      // Line heights
      lineHeight: typography.lineHeights,

      // Letter spacing
      letterSpacing: typography.letterSpacings,

      // Spacing
      spacing: spacing,

      // Border radius
      borderRadius: layout.radius,

      // Box shadows
      boxShadow: layout.shadows,

      // Z-index
      zIndex: layout.zIndex,

      // Transitions
      transitionDuration: motion.durations,
      transitionTimingFunction: motion.easings,

      // Breakpoints
      screens: {
        xs: breakpoints.xs,
        sm: breakpoints.sm,
        md: breakpoints.md,
        lg: breakpoints.lg,
        xl: breakpoints.xl,
        '2xl': breakpoints['2xl'],
      },

      // Container widths
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
          xl: '2.5rem',
          '2xl': '3rem',
        },
        screens: {
          sm: layout.container.sm,
          md: layout.container.md,
          lg: layout.container.lg,
          xl: layout.container.xl,
          '2xl': layout.container['2xl'],
        },
      },

      // Component-specific
      height: {
        ...components.button.heights,
        ...components.input.heights,
      },

      minHeight: {
        ...components.button.heights,
        ...components.input.heights,
      },

      padding: {
        ...components.button.padding,
        ...Object.fromEntries(
          Object.entries(components.card.padding).map(([k, v]) => [`card-${k}`, v])
        ),
      },
    },
  },

  // Dark mode class strategy
  darkMode: 'class',

  // Content paths
  content: [
    './client/index.html',
    './client/src/**/*.{js,ts,jsx,tsx}',
  ],
};