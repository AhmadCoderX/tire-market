// Font configuration for the entire application
export const FONTS = {
  // Primary font family - Poppins
  primary: {
    regular: 'Poppins-Regular',
    medium: 'Poppins-Medium',
    semiBold: 'Poppins-SemiBold',
    bold: 'Poppins-Bold',
  },
  
  // Fallback fonts for better cross-platform compatibility
  fallback: {
    regular: 'Poppins-Regular, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    medium: 'Poppins-Medium, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    semiBold: 'Poppins-SemiBold, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    bold: 'Poppins-Bold, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  
  // Monospace font for code or special text
  monospace: 'SpaceMono',
};

// Font weights for consistent usage
export const FONT_WEIGHTS = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
};

// Common font styles for reuse
export const FONT_STYLES = {
  // Body text styles
  body: {
    fontFamily: FONTS.primary.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  
  // Heading styles
  h1: {
    fontFamily: FONTS.primary.bold,
    fontSize: 32,
    lineHeight: 40,
  },
  
  h2: {
    fontFamily: FONTS.primary.semiBold,
    fontSize: 24,
    lineHeight: 32,
  },
  
  h3: {
    fontFamily: FONTS.primary.semiBold,
    fontSize: 20,
    lineHeight: 28,
  },
  
  h4: {
    fontFamily: FONTS.primary.medium,
    fontSize: 18,
    lineHeight: 24,
  },
  
  h5: {
    fontFamily: FONTS.primary.medium,
    fontSize: 16,
    lineHeight: 22,
  },
  
  h6: {
    fontFamily: FONTS.primary.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  
  // Button text styles
  button: {
    fontFamily: FONTS.primary.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  
  // Caption styles
  caption: {
    fontFamily: FONTS.primary.regular,
    fontSize: 12,
    lineHeight: 16,
  },
  
  // Label styles
  label: {
    fontFamily: FONTS.primary.medium,
    fontSize: 12,
    lineHeight: 16,
  },
};
