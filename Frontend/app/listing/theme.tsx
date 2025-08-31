// theme.tsx
export const colors = {
  background: "#F5F5F5",
  primary: "#5B7560",
  secondary: "#344E41",
  accent: "#AB9404",
  text: {
    primary: "#2B2B2B",
    secondary: "#6B6B6B",
    light: "#FFFFFF",
    muted: "#969696",
  },
  border: "#E6E6E6",
  tag: "#EBEEEC",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 6,
  lg: 8,
  round: 9999,
};

export const typography = {
  fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
  fontWeight: {
    regular: "400",
    medium: "500",
    semiBold: "600",
    bold: "700",
  },
};

export default {
  colors,
  spacing,
  borderRadius,
  typography,
};
