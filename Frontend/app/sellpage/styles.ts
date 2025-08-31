import { StyleSheet } from "react-native";

// Color palette
export const colors = {
  primary: "#3A593F",
  primaryLight: "#5B7560",
  primaryDark: "#293E2C",
  secondary: "#DAD7CD",
  background: "#F5F5F5",
  white: "#FDFDFD",
  border: "#E6E6E6",
  inputBorder: "#A1A1A1",
  text: "#09090B",
  textSecondary: "#6B6B6B",
  textLight: "#969696",
  error: "#C2001D",
  gray: "#757b79",
};

// Typography
export const typography = {
  heading: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 28,
  },
  subheading: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },
  body: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  button: {
    fontFamily: "Inter",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

// Shared styles
export const sharedStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  column: {
    flexDirection: "column",
  },
  spaceBetween: {
    justifyContent: "space-between",
  },
  input: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 4,
    padding: spacing.md,
    minHeight: 43,
    fontSize: 14,
    color: colors.text,
  },
  inputContainer: {
    marginTop: spacing.sm,
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  heading: {
    fontFamily: "Inter",
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xl,
  },
  error: {
    color: colors.error,
    fontFamily: "Inter",
    fontSize: 14,
    marginTop: spacing.xs,
  },
  flexGrow: {
    flexGrow: 1,
  },
  flexShrink: {
    flexShrink: 1,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 4,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 43,
  },
  dropdownText: {
    fontSize: 14,
    color: colors.text,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 40,
  },
  buttonSecondary: {
    backgroundColor: "transparent",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 40,
  },
  buttonTextPrimary: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: "500",
  },
  buttonTextSecondary: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
});
