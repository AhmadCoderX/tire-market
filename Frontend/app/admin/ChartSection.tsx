import React from "react";
import { View, Text, StyleSheet } from "react-native";
import InteractiveChart from "./InteractiveChart";

interface ChartSectionProps {
  title: string;
  chartType: "pie" | "bar";
  chartData: Array<{
    label: string;
    value: number;
    color: string;
  }>;
  showLegend?: boolean;
  showTooltip?: boolean;
}

const ChartSection: React.FC<ChartSectionProps> = ({
  title,
  chartType,
  chartData,
  showLegend = false,
  showTooltip = false,
}) => {
  return (
    <View style={styles.container}>
      <InteractiveChart 
        data={chartData} 
        title={title} 
        type={chartType}
        showLegend={showLegend}
        showTooltip={showTooltip}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexGrow: 1,
    paddingBottom: 25,
    flexDirection: "column",
    alignItems: "stretch",
    fontFamily: "Arial",
    fontSize: 16,
    color: "#000000",
    fontWeight: "600",
  },
});

export default ChartSection;
