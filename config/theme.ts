export const Colors = {
  // Primary colors from the icon
  primary: '#4A90E2',           // Main blue from icon gradient
  primaryDark: '#357ABD',       // Darker blue variant
  primaryLight: '#87CEEB',      // Light blue from icon background
  accent: '#2C3E50',            // Dark navy from gear shapes
  accentLight: '#34495E',       // Lighter navy variant
  
  // Background colors
  background: '#F0F8FF',        // Very light blue background
  backgroundSecondary: '#E6F3FF', // Light blue secondary background  
  surface: '#FFFFFF',           // White surfaces
  
  // Text colors
  textPrimary: '#2C3E50',       // Dark navy text
  textSecondary: '#5A6C7D',     // Medium gray-blue text
  textTertiary: '#8FA0B3',      // Light gray-blue text
  textOnPrimary: '#FFFFFF',     // White text on blue backgrounds
  
  // Care intensity colors (keeping some differentiation but updating to match theme)
  light: {
    level1: '#FFB347',          // Soft orange
    level2: '#FFA500',          // Orange  
    level3: '#FF8C00',          // Dark orange
    level4: '#FF7F00',          // Red orange
    level5: '#FF6347',          // Tomato
  },
  
  water: {
    level1: '#87CEEB',          // Sky blue (matching icon)
    level2: '#4A90E2',          // Primary blue
    level3: '#357ABD',          // Primary dark
    level4: '#2C5F8B',          // Darker blue
    level5: '#1E3A5F',          // Navy blue
  },
  
  fertilizer: {
    level1: '#90EE90',          // Light green
    level2: '#7FD17F',          // Medium light green
    level3: '#6CB46C',          // Medium green
    level4: '#59A359',          // Dark green
    level5: '#4F8A4F',          // Forest green
  },
  
  // Status colors
  success: '#6CB46C',
  warning: '#FFA500',
  error: '#FF6B6B',
  info: '#4A90E2',
  
  // Borders and dividers
  border: '#E6F3FF',
  divider: '#D0E7FF',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const; 