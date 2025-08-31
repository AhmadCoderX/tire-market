import React, { useCallback, useState, memo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import RangeSlider from 'rn-range-slider';

// Custom components for the slider
const Thumb = () => (
  <View style={styles.thumb} />
);

const Rail = () => (
  <View style={styles.rail} />
);

const RailSelected = () => (
  <View style={styles.railSelected} />
);

const Label = ({ text }: { text: string }) => (
  <View style={styles.labelContainer}>
    <Text style={styles.labelText}>{text}mm</Text>
  </View>
);

const Notch = () => (
  <View style={styles.notch} />
);

interface TreadDepthFilterProps {
  onValueChange: (low: number, high: number) => void;
  initialLow?: number;
  initialHigh?: number;
}

// Define constants for default values
const DEFAULT_MIN = 1;
const DEFAULT_MAX = 10;

const TreadDepthFilter: React.FC<TreadDepthFilterProps> = ({
  onValueChange,
  initialLow = DEFAULT_MIN,
  initialHigh = DEFAULT_MAX
}) => {
  const [low, setLow] = useState(initialLow);
  const [high, setHigh] = useState(initialHigh);
  const debounceTimeout = useRef<NodeJS.Timeout>();
  const previousValues = useRef<{ low: number; high: number }>({ low: initialLow, high: initialHigh });
  const isDragging = useRef(false);
  
  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback((value: number) => <Label text={value.toFixed(1)} />, []);
  const renderNotch = useCallback(() => <Notch />, []);
  
  const handleValueChange = useCallback((l: number, h: number) => {
    setLow(l);
    setHigh(h);
    isDragging.current = true;
    
    // Clear any existing timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    
    // Set a new timeout to call onValueChange after the user stops dragging
    debounceTimeout.current = setTimeout(() => {
      isDragging.current = false;
      
      // Only trigger if values have actually changed
      if (l !== previousValues.current.low || h !== previousValues.current.high) {
        onValueChange(l, h);
        previousValues.current = { low: l, high: h };
      }
    }, 500); // Reduced to 500ms for better responsiveness
  }, [onValueChange]);

  const handleReset = useCallback(() => {
    setLow(DEFAULT_MIN);
    setHigh(DEFAULT_MAX);
    previousValues.current = { low: DEFAULT_MIN, high: DEFAULT_MAX };
    onValueChange(DEFAULT_MIN, DEFAULT_MAX);
  }, [onValueChange]);

  useEffect(() => {
    if (initialLow !== low || initialHigh !== high) {
      setLow(initialLow);
      setHigh(initialHigh);
      previousValues.current = { low: initialLow, high: initialHigh };
    }
  }, [initialLow, initialHigh]);

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  const isDefaultRange = low === DEFAULT_MIN && high === DEFAULT_MAX;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Tread Depth</Text>
        {!isDefaultRange && (
          <View style={styles.resetButtonContainer}>
            <Pressable 
              onPress={handleReset}
              style={({ pressed }) => [
                styles.resetButton,
                pressed && styles.resetButtonPressed
              ]}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.resetText}>Reset</Text>
            </Pressable>
          </View>
        )}
      </View>
      
      <View style={styles.sliderContainer}>
        <RangeSlider
          style={styles.slider}
          min={DEFAULT_MIN}
          max={DEFAULT_MAX}
          step={0.5}
          floatingLabel
          renderThumb={renderThumb}
          renderRail={renderRail}
          renderRailSelected={renderRailSelected}
          renderLabel={renderLabel}
          renderNotch={renderNotch}
          onValueChanged={handleValueChange}
          low={low}
          high={high}
        />
      </View>
      
      <View style={styles.labelsContainer}>
        <Text style={styles.label}>{DEFAULT_MIN}mm</Text>
        <Text style={styles.selectedRange}>
          {low.toFixed(1)}mm - {high.toFixed(1)}mm
        </Text>
        <Text style={styles.label}>{DEFAULT_MAX}mm</Text>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 8,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
  },
  resetButtonContainer: {
    minWidth: 60,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  resetButtonPressed: {
    backgroundColor: '#F1F5F9',
  },
  resetText: {
    fontSize: 12,
    color: '#5B7560',
    fontWeight: '500',
    textAlign: 'center',
  },
  sliderContainer: {
    width: '100%',
    height: 40,
    marginBottom: 8,
  },
  slider: {
    flex: 1,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  label: {
    fontSize: 12,
    color: '#64748B',
  },
  selectedRange: {
    fontSize: 12,
    color: '#1E293B',
    fontWeight: '500',
  },
  thumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#5B7560',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
  },
  rail: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
  },
  railSelected: {
    height: 4,
    backgroundColor: '#5B7560',
    borderRadius: 2,
  },
  labelContainer: {
    alignItems: 'center',
    backgroundColor: '#5B7560',
    padding: 4,
    borderRadius: 4,
  },
  labelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  notch: {
    width: 8,
    height: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#5B7560',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 4,
    marginTop: -1,
  },
});

export default memo(TreadDepthFilter);
