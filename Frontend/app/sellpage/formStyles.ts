import { StyleSheet, Dimensions } from "react-native";
import { colors, spacing } from "./styles";

const isSmallScreen = Dimensions.get('window').width < 640;

// Refined typography scale
export const typography = {
  sectionHeader: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: "600",
    lineHeight: 24,
    color: colors.text,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 8,
  },
  inputText: {
    fontSize: 16,
    fontWeight: "normal",
    color: colors.text,
  },
  helperText: {
    fontSize: 12,
    fontWeight: "400",
    color: colors.textLight,
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    fontWeight: "400",
    color: colors.error,
    marginTop: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.white,
  }
};

// Form layout and spacing
export const formStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginBottom: 32,
    padding: 32,
  },
  sectionHeader: {
    ...typography.sectionHeader,
    marginBottom: 32,
  },
  sectionContent: {
    gap: 32,
  },
  formGrid: {
    gap: 32,
  },
  row: {
    flexDirection: isSmallScreen ? "column" : "row",
    gap: isSmallScreen ? 16 : 32,
    marginBottom: isSmallScreen ? 16 : 32,
    alignItems: "flex-start",
  },
  column: {
    flex: 1,
    minWidth: isSmallScreen ? "100%" : "48%",
    display: "flex",
    flexDirection: "column",
  },
  fullWidth: {
    width: "100%",
  },
  fieldContainer: {
    marginBottom: isSmallScreen ? 16 : 24,
    width: "100%",
  },
  fieldLabel: {
    ...typography.fieldLabel,
    marginBottom: isSmallScreen ? 4 : 8,
  },
  input: {
    height: isSmallScreen ? 40 : 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: isSmallScreen ? 12 : 16,
    fontSize: isSmallScreen ? 14 : 16,
    backgroundColor: colors.white,
    width: "100%",
  },
  buttonBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: isSmallScreen ? 8 : 16,
    marginTop: isSmallScreen ? 24 : 40,
    paddingTop: isSmallScreen ? 16 : 32,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelButton: {
    height: isSmallScreen ? 40 : 48,
    paddingHorizontal: isSmallScreen ? 16 : 24,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  cancelButtonText: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  publishButton: {
    height: isSmallScreen ? 40 : 48,
    paddingHorizontal: isSmallScreen ? 16 : 24,
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  publishButtonText: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: "500",
    color: colors.white,
  },
  errorMessage: {
    ...typography.errorText,
  },
  helperText: {
    ...typography.helperText,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 24,
  },
});

export default formStyles; 