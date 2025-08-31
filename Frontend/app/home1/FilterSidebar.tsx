import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import FilterOption from "./FilterOption";
import PriceRangeFilter from "./PriceRangeFilter";
import TireSizeFilter from "./TireSizeFilter";
import TreadDepthFilter from "./TreadDepthFilter";
import StarRatingFilter from "./StarRatingFilter";
import SpeedRatingFilter from "./SpeedRatingFilter";
import LoadIndexFilter from "./LoadIndexFilter";
import BrandFilter from "./BrandFilter";
import SellerTypeFilter from "./SellerTypeFilter";
import { FilterParams } from "../types";

interface FilterSidebarProps {
  filters: FilterParams;
  onFilterChange: (newFilters: FilterParams) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onFilterChange }) => {
  const handleConditionChange = (condition: string) => {
    const currentConditions = filters.condition || [];
    let newConditions: ('new' | 'used')[];
    
    if (currentConditions.includes(condition as 'new' | 'used')) {
      // Remove the condition if it's already selected
      newConditions = currentConditions.filter(c => c !== condition);
    } else {
      // Add the condition if it's not selected
      newConditions = [...currentConditions, condition as 'new' | 'used'];
    }
    
    // If the array is empty, set condition to undefined to remove the filter
    onFilterChange({ 
      ...filters, 
      condition: newConditions.length > 0 ? newConditions : undefined 
    });
  };

  const handleQuantityChange = (quantity: string) => {
    const currentQuantities = filters.quantity || [];
    let newQuantities: ('single' | 'double' | 'set4')[];
    
    if (currentQuantities.includes(quantity as 'single' | 'double' | 'set4')) {
      // Remove the quantity if it's already selected
      newQuantities = currentQuantities.filter((q: string) => q !== quantity);
    } else {
      // Add the quantity if it's not selected
      newQuantities = [...currentQuantities, quantity as 'single' | 'double' | 'set4'];
    }
    
    // If the array is empty, set quantity to undefined to remove the filter
    onFilterChange({ 
      ...filters, 
      quantity: newQuantities.length > 0 ? newQuantities : undefined 
    });
  };

  const handleTireTypeChange = (tireType: string) => {
    const currentTypes = filters.tire_type || [];
    let newTypes: ('all_season' | 'winter' | 'summer' | 'performance' | 'mud_terrain' | 'all_terrain')[];
    
    if (currentTypes.includes(tireType as any)) {
      // Remove the tire type if it's already selected
      newTypes = currentTypes.filter(t => t !== tireType);
    } else {
      // Add the tire type if it's not selected
      newTypes = [...currentTypes, tireType as any];
    }
    
    // If the array is empty, set tire_type to undefined to remove the filter
    onFilterChange({ 
      ...filters, 
      tire_type: newTypes.length > 0 ? newTypes : undefined 
    });
  };

  const handleBrandChange = (brand: string | undefined) => {
    // Convert single brand to array format for API compatibility
    const brandArray = brand ? [brand] : undefined;
    onFilterChange({ 
      ...filters, 
      brand: brandArray
    });
  };

  const handleSellerTypeChange = (sellerTypes: string[]) => {
    // Convert array to single value for API compatibility
    const sellerType = sellerTypes.length > 0 ? sellerTypes[0] : undefined;
    onFilterChange({ 
      ...filters, 
      seller_type: sellerType
    });
  };

  const handleVehicleTypeChange = (vehicleType: string) => {
    const currentTypes = filters.vehicle_type || [];
    let newTypes: ('passenger' | 'suv' | 'truck' | 'motorcycle' | 'van' | 'others')[];
    
    if (currentTypes.includes(vehicleType as any)) {
      // Remove the vehicle type if it's already selected
      newTypes = currentTypes.filter(t => t !== vehicleType);
    } else {
      // Add the vehicle type if it's not selected
      newTypes = [...currentTypes, vehicleType as any];
    }
    
    // If the array is empty, set vehicle_type to undefined to remove the filter
    onFilterChange({ 
      ...filters, 
      vehicle_type: newTypes.length > 0 ? newTypes : undefined 
    });
  };

  const handleTireSizeSelect = (sizeString: string) => {
    // Clear filters if empty string
    if (!sizeString) {
      onFilterChange({
        ...filters,
        width: undefined,
        aspect_ratio: undefined,
        diameter: undefined
      });
      return;
    }

    // Parse size string (format: "width/aspectRatio/diameter")
    const [width, aspectRatio, diameter] = sizeString.split('/').map(Number);

    // Validate values
    const isValidWidth = !isNaN(width) && width >= 120 && width <= 395;
    const isValidAspectRatio = !isNaN(aspectRatio) && aspectRatio >= 25 && aspectRatio <= 85;
    const isValidDiameter = !isNaN(diameter) && diameter >= 13 && diameter <= 24;

    if (!isValidWidth || !isValidAspectRatio || !isValidDiameter) {
      console.error('Invalid tire size values:', { width, aspectRatio, diameter });
      return;
    }

    // Update filters with validated values
    onFilterChange({
      ...filters,
      width,
      aspect_ratio: aspectRatio,
      diameter
    });
  };

  const handleTreadDepthChange = (low: number, high: number) => {
    // Only apply filter if not at default range (1-10)
    onFilterChange({
      ...filters,
      tread_depth_min: low === 1 && high === 10 ? undefined : low,
      tread_depth_max: low === 1 && high === 10 ? undefined : high
    });
  };

  const handleSpeedRatingChange = (speedRatings: string[]) => {
    onFilterChange({ 
      ...filters, 
      speed_rating: speedRatings.length > 0 ? speedRatings : undefined 
    });
  };

  const handleLoadIndexChange = (loadIndices: string[]) => {
    onFilterChange({ 
      ...filters, 
      load_index: loadIndices.length > 0 ? loadIndices : undefined 
    });
  };

  // Get the selected brand from the array format
  const selectedBrand = filters.brand && filters.brand.length > 0 ? filters.brand[0] : undefined;

  // Get the selected seller types from the single value format
  const selectedSellerTypes = filters.seller_type ? [filters.seller_type] : [];

  return (
    <View style={styles.sidebarWrapper}>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <TireSizeFilter onSizeSelect={handleTireSizeSelect} />
        </View>

        <View style={styles.section}>
          <SpeedRatingFilter 
            selectedSpeedRatings={filters.speed_rating || []}
            onSpeedRatingChange={handleSpeedRatingChange}
          />
        </View>

        <View style={styles.section}>
          <LoadIndexFilter 
            selectedLoadIndices={filters.load_index || []}
            onLoadIndexChange={handleLoadIndexChange}
          />
        </View>

        <View style={styles.section}>
          <BrandFilter 
            selectedBrand={selectedBrand}
            onBrandChange={handleBrandChange}
          />
        </View>

        <View style={styles.section}>
          <SellerTypeFilter 
            selectedSellerTypes={selectedSellerTypes}
            onSellerTypeChange={handleSellerTypeChange}
          />
        </View>

        <View style={styles.section}>
          <FilterOption
            title="Condition"
            options={[
              { label: "New", value: "new" },
              { label: "Used", value: "used" },
            ]}
            selectedValues={filters.condition}
            onSelect={handleConditionChange}
            multiSelect={true}
          />
        </View>

        <View style={styles.section}>
          <FilterOption
            title="Quantity"
            options={[
              { label: "Single", value: "single" },
              { label: "Double", value: "double" },
              { label: "Set of 4", value: "set4" },
            ]}
            selectedValues={filters.quantity}
            onSelect={handleQuantityChange}
            multiSelect={true}
          />
        </View>

        <View style={styles.section}>
          <PriceRangeFilter 
            filters={filters}
            onFilterChange={onFilterChange}
          />
        </View>

        <View style={styles.section}>
          <TreadDepthFilter 
            onValueChange={handleTreadDepthChange}
            initialLow={filters.tread_depth_min ?? 1}
            initialHigh={filters.tread_depth_max ?? 10}
          />
        </View>

        <View style={styles.section}>
          <FilterOption
            title="Vehicle Type"
            options={[
              { label: "Passenger Car", value: "passenger" },
              { label: "SUV", value: "suv" },
              { label: "Truck", value: "truck" },
              { label: "Motorcycle", value: "motorcycle" },
              { label: "Van", value: "van" },
              { label: "Others", value: "others" },
            ]}
            selectedValues={filters.vehicle_type}
            onSelect={handleVehicleTypeChange}
            multiSelect={true}
          />
        </View>

        <View style={styles.section}>
          <FilterOption
            title="Tire Type"
            options={[
              { label: "All Season", value: "all_season" },
              { label: "Winter", value: "winter" },
              { label: "Summer", value: "summer" },
              { label: "Mud Terrain", value: "mud_terrain" },
              { label: "All Terrain", value: "all_terrain" },
              { label: "Performance", value: "performance" },
            ]}
            selectedValues={filters.tire_type || []}
            onSelect={handleTireTypeChange}
            multiSelect={true}
          />
        </View>

        <View style={styles.section}>
          <StarRatingFilter 
            filters={filters}
            onFilterChange={onFilterChange}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebarWrapper: {
    width: "100%",
    height: "100%",
    borderRightWidth: 1,
    borderRightColor: "#E0E0E0",
    backgroundColor: "#F5F5F5",
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
    paddingLeft: 20,
    backgroundColor: "#F5F5F5",
  },
});

export default FilterSidebar;