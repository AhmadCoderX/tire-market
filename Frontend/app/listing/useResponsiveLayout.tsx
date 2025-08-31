import { useState, useEffect } from "react";
import { Dimensions, ScaledSize } from "react-native";

// Define breakpoints
export const BREAKPOINTS = {
  SMALL: 480,
  MEDIUM: 768,
  LARGE: 1024,
};

export type ScreenSize = "small" | "medium" | "large";

export interface ResponsiveLayout {
  width: number;
  height: number;
  isSmallScreen: boolean;
  isMediumScreen: boolean;
  isLargeScreen: boolean;
  screenSize: ScreenSize;
}

export const useResponsiveLayout = (): ResponsiveLayout => {
  const [dimensions, setDimensions] = useState<ScaledSize>(
    Dimensions.get("window")
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions(window);
    });

    return () => subscription.remove();
  }, []);

  const { width, height } = dimensions;
  const isSmallScreen = width < BREAKPOINTS.MEDIUM;
  const isMediumScreen =
    width >= BREAKPOINTS.MEDIUM && width < BREAKPOINTS.LARGE;
  const isLargeScreen = width >= BREAKPOINTS.LARGE;

  let screenSize: ScreenSize = "large";
  if (isSmallScreen) screenSize = "small";
  else if (isMediumScreen) screenSize = "medium";

  return {
    width,
    height,
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    screenSize,
  };
};
