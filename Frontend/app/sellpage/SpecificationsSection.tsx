import React from "react";
import { View, Text, StyleSheet, Dimensions, ViewStyle, TextStyle, useWindowDimensions } from "react-native";
import FormField from "./FormField";
import DropdownField from "./DropdownField";
import TireSizeSelector from "./TireSizeSelector";
import RangeSlider from "./RangeSlider";
import PillToggle from "./PillToggle";
import MultiSelectPill from "./MultiSelectPill";
import MileageInput from "./MileageInput";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { tireBrands } from "./tireBrands";
import { colors, spacing } from "./styles";
import { typography, formStyles } from "./formStyles";

const isSmallScreen = Dimensions.get('window').width < 768;

// Sample options for dropdowns
const tireTypeOptions = [
  { label: "All Season", value: "all_season" },
  { label: "Summer", value: "summer" },
  { label: "Winter", value: "winter" },
  { label: "Performance", value: "performance" },
  { label: "Mud Terrain", value: "mud_terrain" },
  { label: "All Terrain", value: "all_terrain" },
  { label: "Highway", value: "highway" },
  { label: "Commercial", value: "commercial" },
  { label: "Racing", value: "racing" },
];

const aspectRatioOptions = [
  { label: "30", value: "30" },
  { label: "35", value: "35" },
  { label: "40", value: "40" },
  { label: "45", value: "45" },
  { label: "50", value: "50" },
  { label: "55", value: "55" },
];

const conditionOptions = [
  { label: "New", value: "new" },
  { label: "Used", value: "used" },
];

const quantityOptions = [
  { label: "Single", value: "1" },
  { label: "Pair", value: "2" },
  { label: "Set of 4", value: "4" },
];

const vehicleTypeOptions = [
  { label: "SUV", value: "suv" },
  { label: "Truck", value: "truck" },
  { label: "Motorcycle", value: "motorcycle" },
  { label: "Van", value: "van" },
  { label: "Bus", value: "bus" },
  { label: "Trailer", value: "trailer" },
  { label: "ATV", value: "atv" },
  { label: "UTV", value: "utv" },
  { label: "Tractor", value: "tractor" },
  { label: "Construction", value: "construction" },
  { label: "Industrial", value: "industrial" },
];

// Update the Speed Rating options array with tooltips
const speedRatingOptions = [
  { value: "A1", label: "A1 – 3 mph", tooltip: "A1: max 3 mph" },
  { value: "A2", label: "A2 – 6 mph", tooltip: "A2: max 6 mph" },
  { value: "A3", label: "A3 – 9 mph", tooltip: "A3: max 9 mph" },
  { value: "A4", label: "A4 – 12 mph", tooltip: "A4: max 12 mph" },
  { value: "A5", label: "A5 – 16 mph", tooltip: "A5: max 16 mph" },
  { value: "A6", label: "A6 – 19 mph", tooltip: "A6: max 19 mph" },
  { value: "A7", label: "A7 – 22 mph", tooltip: "A7: max 22 mph" },
  { value: "A8", label: "A8 – 25 mph", tooltip: "A8: max 25 mph" },
  { value: "B", label: "B – 31 mph", tooltip: "B: max 31 mph" },
  { value: "C", label: "C – 37 mph", tooltip: "C: max 37 mph" },
  { value: "D", label: "D – 40 mph", tooltip: "D: max 40 mph" },
  { value: "E", label: "E – 43 mph", tooltip: "E: max 43 mph" },
  { value: "F", label: "F – 50 mph", tooltip: "F: max 50 mph" },
  { value: "G", label: "G – 56 mph", tooltip: "G: max 56 mph" },
  { value: "J", label: "J – 62 mph", tooltip: "J: max 62 mph" },
  { value: "K", label: "K – 68 mph", tooltip: "K: max 68 mph" },
  { value: "L", label: "L – 75 mph", tooltip: "L: max 75 mph" },
  { value: "M", label: "M – 81 mph", tooltip: "M: max 81 mph" },
  { value: "N", label: "N – 87 mph", tooltip: "N: max 87 mph" },
  { value: "P", label: "P – 93 mph", tooltip: "P: max 93 mph" },
  { value: "Q", label: "Q – 99 mph", tooltip: "Q: max 99 mph" },
  { value: "R", label: "R – 106 mph", tooltip: "R: max 106 mph" },
  { value: "S", label: "S – 112 mph", tooltip: "S: max 112 mph" },
  { value: "T", label: "T – 118 mph", tooltip: "T: max 118 mph" },
  { value: "U", label: "U – 124 mph", tooltip: "U: max 124 mph" },
  { value: "H", label: "H – 130 mph", tooltip: "H: max 130 mph" },
  { value: "V", label: "V – 149 mph", tooltip: "V: max 149 mph" },
  { value: "W", label: "W – 168 mph", tooltip: "W: max 168 mph" },
  { value: "Y", label: "Y – 186 mph", tooltip: "Y: max 186 mph" },
  { value: "(Y)", label: "(Y) – >186 mph", tooltip: "(Y): exceeds 186 mph" },
];

// Generate Load Index options array (1-150)
const loadIndexOptions = Array.from({ length: 150 }, (_, i) => ({
  value: String(i + 1),
  label: String(i + 1),
}));

interface SpecificationsSectionProps {
  brand: string[];
  onBrandChange: (brands: string[]) => void;
  model: string;
  onModelChange: (text: string) => void;
  tireType: string[];
  onTireTypeChange: (value: string[]) => void;
  width: string;
  onWidthChange: (text: string) => void;
  aspectRatio: string;
  onAspectRatioChange: (value: string) => void;
  diameter: string;
  onDiameterChange: (text: string) => void;
  loadIndex: string;
  onLoadIndexChange: (text: string) => void;
  speedRating: string;
  onSpeedRatingChange: (text: string) => void;
  condition: string;
  onConditionChange: (value: string) => void;
  treadDepth: string;
  onTreadDepthChange: (value: number) => void;
  quantity: string;
  onQuantityChange: (text: string) => void;
  mileage: string;
  onMileageChange: (text: string) => void;
  mileageUnit: string;
  onMileageUnitChange: (unit: string) => void;
  vehicleType: string;
  onVehicleTypeChange: (value: string) => void;
  errors?: {
    [key: string]: string;
  };
}

const SpecificationsSection: React.FC<SpecificationsSectionProps> = ({
  brand,
  onBrandChange,
  model,
  onModelChange,
  tireType,
  onTireTypeChange,
  width,
  onWidthChange,
  aspectRatio,
  onAspectRatioChange,
  diameter,
  onDiameterChange,
  loadIndex,
  onLoadIndexChange,
  speedRating,
  onSpeedRatingChange,
  condition,
  onConditionChange,
  treadDepth,
  onTreadDepthChange,
  quantity,
  onQuantityChange,
  mileage,
  onMileageChange,
  mileageUnit,
  onMileageUnitChange,
  vehicleType,
  onVehicleTypeChange,
  errors = {},
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 768;

  // Function to handle toggling a tire type option
  const handleToggleTireType = (value: string) => {
    if (tireType.includes(value)) {
      // Remove the value if it's already selected
      onTireTypeChange(tireType.filter(type => type !== value));
    } else {
      // Add the value if it's not selected
      onTireTypeChange([...tireType, value]);
    }
  };

  return (
    <View
      style={{
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 0 : 32,
        width: '100%',
        paddingHorizontal: isMobile ? 16 : 0,
      }}
    >
      {isMobile ? (
        // Mobile: all fields in one column
        <View style={{ flex: 1 }}>
          <MultiSelectDropdown
            label="Brand (Select One)"
            options={tireBrands}
            selectedValues={brand}
            onSelectionChange={onBrandChange}
            placeholder="Select tire brand..."
            clearable={true}
            error={errors.brand}
            containerStyle={styles.inputField}
          />
          <FormField
            label="Model"
            value={model}
            onChangeText={onModelChange}
            placeholder="Enter model name"
            error={errors.model}
            containerStyle={styles.inputField}
          />
          <TireSizeSelector
            width={width}
            aspectRatio={aspectRatio}
            diameter={diameter}
            onWidthChange={onWidthChange}
            onAspectRatioChange={onAspectRatioChange}
            onDiameterChange={onDiameterChange}
            error={errors.width}
          />
          <DropdownField
            label="Load Index"
            options={loadIndexOptions}
            selectedValue={loadIndex}
            onSelect={onLoadIndexChange}
            placeholder="Select Load Index"
            error={errors.loadIndex}
            containerStyle={styles.inputField}
            searchable={false}
            clearable={true}
          />
          <DropdownField
            label="Speed Rating"
            options={speedRatingOptions}
            selectedValue={speedRating}
            onSelect={onSpeedRatingChange}
            placeholder="Select Speed Rating"
            error={errors.speedRating}
            containerStyle={styles.inputField}
            searchable={false}
            clearable={true}
          />
          <MultiSelectPill
            label="Tire Type"
            options={tireTypeOptions}
            selectedValues={tireType}
            onToggleOption={handleToggleTireType}
            helperText="Select one or more tire types"
            error={errors.tireType}
            containerStyle={styles.inputField}
          />
          <PillToggle
            label="Condition"
            options={conditionOptions}
            selectedValue={condition}
            onSelect={onConditionChange}
            error={errors.condition}
            containerStyle={styles.inputField}
          />
          <RangeSlider
            label="Tread Depth (mm)"
            minValue={1}
            maxValue={10}
            step={0.5}
            value={parseFloat(treadDepth) || 1}
            onValueChange={onTreadDepthChange}
            error={errors.treadDepth}
            containerStyle={styles.smallRangeSlider}
          />
          <PillToggle
            label="Quantity"
            options={quantityOptions}
            selectedValue={quantity}
            onSelect={onQuantityChange}
            error={errors.quantity}
            containerStyle={styles.inputField}
          />
          <MileageInput
            label="Mileage"
            value={mileage}
            onValueChange={onMileageChange}
            unit={mileageUnit}
            onUnitChange={onMileageUnitChange}
            error={errors.mileage}
            containerStyle={styles.inputField}
          />
          <MultiSelectPill
            label="Vehicle Type"
            options={vehicleTypeOptions}
            selectedValues={[vehicleType]}
            onToggleOption={(value) => onVehicleTypeChange(value)}
            helperText="Select vehicle type"
            error={errors.vehicleType}
            containerStyle={styles.inputField}
          />
        </View>
      ) : (
        // Desktop: two columns
        <>
          <View style={{ flex: 1, marginBottom: 0 }}>
            <MultiSelectDropdown
              label="Brand (Select One)"
              options={tireBrands}
              selectedValues={brand}
              onSelectionChange={onBrandChange}
              placeholder="Select tire brand..."
              clearable={true}
              error={errors.brand}
              containerStyle={styles.inputField}
            />
            <FormField
              label="Model"
              value={model}
              onChangeText={onModelChange}
              placeholder="Enter model name"
              error={errors.model}
              containerStyle={styles.inputField}
            />
            <TireSizeSelector
              width={width}
              aspectRatio={aspectRatio}
              diameter={diameter}
              onWidthChange={onWidthChange}
              onAspectRatioChange={onAspectRatioChange}
              onDiameterChange={onDiameterChange}
              error={errors.width}
            />
            <DropdownField
              label="Load Index"
              options={loadIndexOptions}
              selectedValue={loadIndex}
              onSelect={onLoadIndexChange}
              placeholder="Select Load Index"
              error={errors.loadIndex}
              containerStyle={styles.inputField}
              searchable={false}
              clearable={true}
            />
          </View>
          <View style={{ flex: 1 }}>
            <DropdownField
              label="Speed Rating"
              options={speedRatingOptions}
              selectedValue={speedRating}
              onSelect={onSpeedRatingChange}
              placeholder="Select Speed Rating"
              error={errors.speedRating}
              containerStyle={styles.inputField}
              searchable={false}
              clearable={true}
            />
            <MultiSelectPill
              label="Tire Type"
              options={tireTypeOptions}
              selectedValues={tireType}
              onToggleOption={handleToggleTireType}
              helperText="Select one or more tire types"
              error={errors.tireType}
              containerStyle={styles.inputField}
            />
            <PillToggle
              label="Condition"
              options={conditionOptions}
              selectedValue={condition}
              onSelect={onConditionChange}
              error={errors.condition}
              containerStyle={styles.inputField}
            />
            <RangeSlider
              label="Tread Depth (mm)"
              minValue={1}
              maxValue={10}
              step={0.5}
              value={parseFloat(treadDepth) || 1}
              onValueChange={onTreadDepthChange}
              error={errors.treadDepth}
              containerStyle={styles.smallRangeSlider}
            />
            <PillToggle
              label="Quantity"
              options={quantityOptions}
              selectedValue={quantity}
              onSelect={onQuantityChange}
              error={errors.quantity}
              containerStyle={styles.inputField}
            />
            <MileageInput
              label="Mileage"
              value={mileage}
              onValueChange={onMileageChange}
              unit={mileageUnit}
              onUnitChange={onMileageUnitChange}
              error={errors.mileage}
              containerStyle={styles.inputField}
            />
            <MultiSelectPill
              label="Vehicle Type"
              options={vehicleTypeOptions}
              selectedValues={[vehicleType]}
              onToggleOption={(value) => onVehicleTypeChange(value)}
              helperText="Select vehicle type"
              error={errors.vehicleType}
              containerStyle={styles.inputField}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: isSmallScreen ? 16 : 24,
    marginBottom: isSmallScreen ? 16 : 32,
  },
  heading: {
    fontSize: isSmallScreen ? 16 : 20,
    fontWeight: "600" as const,
    lineHeight: isSmallScreen ? 20 : 24,
    color: colors.text,
    marginBottom: isSmallScreen ? 16 : 24,
    marginLeft: -4,
  },
  row: {
    flexDirection: isSmallScreen ? "column" : "row",
    gap: isSmallScreen ? 16 : 24,
    marginBottom: isSmallScreen ? 16 : 24,
  },
  column: {
    flex: isSmallScreen ? 1 : 1,
    width: isSmallScreen ? "100%" : "48%",
  },
  fullWidth: {
    flex: 1,
    width: "100%",
  },
  inputField: {
    marginBottom: isSmallScreen ? 12 : 16,
  },
  sizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isSmallScreen ? 8 : 16,
    marginBottom: isSmallScreen ? 4 : 8,
  },
  sizeField: {
    flex: 1,
  },
  sizeSeparator: {
    fontSize: isSmallScreen ? 14 : 16,
    color: colors.text,
  },
  smallRangeSlider: {
    marginBottom: isSmallScreen ? 12 : 16,
    height: isSmallScreen ? 50 : 60,
  },
  rightColumnFirstField: {
    marginTop: 0,
  },
});

export default SpecificationsSection;