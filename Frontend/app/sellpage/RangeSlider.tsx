import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  LayoutChangeEvent,
  ViewStyle,
} from 'react-native';
import { colors, spacing } from './styles';

interface RangeSliderProps {
  label: string;
  minValue: number;
  maxValue: number;
  step: number;
  value: number;
  onValueChange: (value: number) => void;
  error?: string;
  containerStyle?: ViewStyle;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  label,
  minValue,
  maxValue,
  step,
  value,
  onValueChange,
  error,
  containerStyle,
}) => {
  // Animated value for the handle
  const [handlePosition] = useState(new Animated.Value(0));
  
  // Track current position in state for calculations
  const [position, setPosition] = useState(0);
  
  // Track width state for calculations
  const [trackWidth, setTrackWidth] = useState(0);
  
  // Active handle state (for scaling effect)
  const [isActive, setIsActive] = useState(false);
  
  // Calculate handle scale for animation
  const handleScale = new Animated.Value(1);

  // Update position when value changes externally
  useEffect(() => {
    if (trackWidth > 0) {
      // Calculate position based on value
      const pos = ((value - minValue) / (maxValue - minValue)) * trackWidth;
      
      setPosition(pos);
      handlePosition.setValue(pos);
    }
  }, [value, trackWidth, minValue, maxValue]);

  // Handle track layout change
  const onTrackLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setTrackWidth(width);
    
    // Initialize handle position after track width is known
    const pos = ((value - minValue) / (maxValue - minValue)) * width;
    
    setPosition(pos);
    handlePosition.setValue(pos);
  };

  // Helper to convert position to value
  const positionToValue = (position: number): number => {
    // Calculate raw value
    let rawValue = (position / trackWidth) * (maxValue - minValue) + minValue;
    
    // Snap to nearest step
    const steps = Math.round((rawValue - minValue) / step);
    const snappedValue = minValue + steps * step;
    
    // Clamp to min/max range
    return Math.max(minValue, Math.min(maxValue, snappedValue));
  };

  // Handle pan responder
  const handlePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setIsActive(true);
      
      // Scale up the handle
      Animated.spring(handleScale, {
        toValue: 1.3,
        useNativeDriver: true
      }).start();
    },
    onPanResponderMove: (_, gestureState) => {
      // Calculate new position
      let newPosition = gestureState.dx + position;
      
      // Clamp to track bounds
      newPosition = Math.max(0, Math.min(trackWidth, newPosition));
      
      // Update position state
      setPosition(newPosition);
      
      // Update animated value
      handlePosition.setValue(newPosition);
      
      // Calculate and update value
      const newValue = positionToValue(newPosition);
      
      // Only update if change is at least one step
      if (Math.abs(newValue - value) >= step / 2) {
        onValueChange(newValue);
      }
    },
    onPanResponderRelease: () => {
      setIsActive(false);
      
      // Scale down the handle
      Animated.spring(handleScale, {
        toValue: 1,
        useNativeDriver: true
      }).start();
    }
  });

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      
      <View style={styles.sliderContainer}>
        <View 
          style={styles.track} 
          onLayout={onTrackLayout}
          accessibilityRole="adjustable"
          accessibilityValue={{ min: minValue, max: maxValue, now: value }}
        >
          {/* Selected track portion */}
          <Animated.View
            style={[
              styles.selectedTrack,
              {
                width: handlePosition
              }
            ]}
          />
          
          {/* Handle */}
          <Animated.View
            style={[
              styles.handle,
              {
                transform: [
                  { translateX: handlePosition },
                  { scale: handleScale }
                ]
              }
            ]}
            {...handlePanResponder.panHandlers}
          />
        </View>
        
        {/* Static labels */}
        <View style={styles.staticLabelsContainer}>
          <Text style={styles.staticLabel}>{minValue} mm</Text>
          <Text style={styles.selectedValue}>{value.toFixed(1)} mm</Text>
          <Text style={styles.staticLabel}>{maxValue} mm</Text>
        </View>
      </View>
      
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    userSelect: 'none', // Prevent text selection during drag
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: spacing.xs,
    userSelect: 'none', // Prevent text selection
  },
  sliderContainer: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    userSelect: 'none', // Prevent text selection
  },
  track: {
    height: 6, // Made slightly thicker
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    position: 'relative',
    marginHorizontal: 15, // Increased for larger handle
    userSelect: 'none', // Prevent text selection
  },
  selectedTrack: {
    height: 6, // Made slightly thicker
    backgroundColor: colors.primary,
    borderRadius: 3,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  handle: {
    width: 30, // Increased size
    height: 30, // Increased size
    borderRadius: 15, // Half of width/height
    backgroundColor: colors.primary,
    position: 'absolute',
    top: -12, // Center vertically on the track
    marginLeft: -15, // Half width for centering
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4, // Increased elevation
    userSelect: 'none', // Prevent text selection
  },
  handleLabel: {
    position: 'absolute',
    top: -30,
    backgroundColor: colors.primary,
    padding: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    userSelect: 'none', // Prevent text selection
  },
  handleLabelText: {
    color: 'white',
    fontSize: 14, // Increased font size
    fontWeight: '600',
    userSelect: 'none', // Prevent text selection
  },
  staticLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 15, // Match track margins
    userSelect: 'none', // Prevent text selection
  },
  staticLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    userSelect: 'none', // Prevent text selection
  },
  selectedValue: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
    userSelect: 'none',
  },
  error: {
    color: colors.error,
    fontSize: 12,
    marginTop: spacing.xs,
  },
});

export default RangeSlider; 