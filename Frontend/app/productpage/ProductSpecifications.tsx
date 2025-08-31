import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SpecificationRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const ProductSpecifications = () => {
  return (
    <View style={styles.container}>
      <View style={styles.column}>
        <SpecificationRow label="Brand" value="Michelin" />
        <SpecificationRow label="Type" value="Summer Performance" />
        <SpecificationRow label="Load Index" value="97" />
        <SpecificationRow label="Tread Depth" value="8.5mm" />
        <SpecificationRow label="Quantity" value="4" />
      </View>
      <View style={styles.column}>
        <SpecificationRow label="Model" value="Pilot Sport 4S" />
        <SpecificationRow label="Size" value="245/40R18" />
        <SpecificationRow label="Speed Rating" value="Y" />
        <SpecificationRow label="Mileage" value="0 miles" />
        <SpecificationRow label="Vehicle Type" value="Passenger Car" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    gap: 24,
  },
  column: {
    flex: 1,
  },
  row: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Arial',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
    fontFamily: 'Arial',
  },
});

export default ProductSpecifications;
