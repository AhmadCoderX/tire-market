import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";

interface ChartDataItem {
  label: string;
  value: number;
  color: string;
}

interface InteractiveChartProps {
  data: ChartDataItem[];
  title: string;
  type: "pie" | "bar";
  showLegend?: boolean;
  showTooltip?: boolean;
}

const InteractiveChart: React.FC<InteractiveChartProps> = ({
  data,
  title,
  type,
  showLegend = false,
  showTooltip = false,
}) => {
  const [activeSegment, setActiveSegment] = useState<number | null>(null);
  // Calculate total, ensuring a non-zero value to prevent division by zero
  const total = Math.max(data.reduce((sum, item) => sum + item.value, 0), 1);

  const renderPieChart = () => {
    let startAngle = 0;
    const segments = data.map((item, index) => {
      const percentage = (item.value / total) * 100;
      const angle = data.length === 1 && percentage === 100 ? 360 : (percentage / 100) * 360;
      const isActive = activeSegment === index;

      // Calculate coordinates for the tooltip
      const midAngle = startAngle + angle / 2;
      const radius = 60;
      const x = Math.cos((midAngle * Math.PI) / 180) * radius + 100;
      const y = Math.sin((midAngle * Math.PI) / 180) * radius + 100;

      const segment = (
        <View key={index} style={styles.chartSegmentContainer}>
          <TouchableWithoutFeedback
            onPress={() =>
              setActiveSegment(index === activeSegment ? null : index)
            }
          >
            <View
              style={[
                styles.pieSegment,
                {
                  backgroundColor: item.color,
                  transform: [
                    { rotate: `${startAngle}deg` },
                    { translateX: isActive ? 5 : 0 },
                    { translateY: isActive ? -5 : 0 },
                  ],
                  zIndex: isActive ? 10 : 1,
                  width: isActive ? 210 : 200,
                  height: isActive ? 210 : 200,
                },
              ]}
            >
              {!(data.length === 1 && percentage === 100) && (
                <View
                  style={[
                    styles.pieSegmentInner,
                    {
                      transform: [{ rotate: `${angle}deg` }],
                    },
                  ]}
                />
              )}
            </View>
          </TouchableWithoutFeedback>

          {showTooltip && isActive && (
            <View
              style={[
                styles.tooltip,
                {
                  left: x,
                  top: y,
                },
              ]}
            >
              <Text style={styles.tooltipText}>{percentage.toFixed(1)}%</Text>
            </View>
          )}
        </View>
      );

      startAngle += angle;
      return segment;
    });

    return (
      <View style={styles.pieChartContainer}>
        <View style={styles.pieChart}>{segments}</View>
        {showLegend && (
          <View style={styles.legend}>
            {data.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View
                  style={[styles.legendColor, { backgroundColor: item.color }]}
                />
                <Text style={styles.legendText}>{item.label}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderBarChart = () => {
    // Find the maximum value for better scaling
    const maxValue = Math.max(...data.map(item => item.value), 1);
    
    // Log the data and calculated values for debugging
    console.log('Bar chart data:', JSON.stringify(data, null, 2));
    console.log('Max value for scaling:', maxValue);
    
    return (
      <View style={styles.barChartContainer}>
        <View style={styles.barChart}>
          {data.map((item, index) => {
            // Calculate height based on the maximum value rather than total
            const heightPercentage = (item.value / maxValue) * 100;
            const isActive = activeSegment === index;
            
            // Ensure a minimum height for visibility (higher value ensures very small bars are still visible)
            const barHeight = Math.max(heightPercentage, 15);
            
            console.log(`Bar ${item.label}: value=${item.value}, height=${barHeight}%`);
            
            // Format the label with a line break if needed
            const formattedLabel = item.label.includes('Active') ? 
              item.label.replace('Listings', '\nListings') : 
              item.label;

            return (
              <TouchableWithoutFeedback
                key={index}
                onPress={() =>
                  setActiveSegment(index === activeSegment ? null : index)
                }
              >
                <View style={styles.barItemContainer}>
                  <View style={styles.barContent}>
                    <Text style={styles.barValue}>{item.value}</Text>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: `${barHeight}%`, // Use the calculated height with minimum
                          backgroundColor: item.color,
                          width: isActive ? 45 : 40,
                        },
                      ]}
                    />
                  </View>
                  <Text numberOfLines={2} style={styles.barLabel}>{formattedLabel}</Text>
                  {showTooltip && isActive && (
                    <View style={styles.barTooltip}>
                      <Text style={styles.tooltipText}>
                        {((item.value / total) * 100).toFixed(1)}%
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableWithoutFeedback>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {type === "pie" ? renderPieChart() : renderBarChart()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    height: 340,
    borderColor: "#E5E7EB",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 16,
    textAlign: "center",
  },
  pieChartContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pieChart: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: "hidden",
    position: "relative",
  },
  chartSegmentContainer: {
    position: "absolute",
    width: 200,
    height: 200,
  },
  pieSegment: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: "hidden",
  },
  pieSegmentInner: {
    position: "absolute",
    width: "100%",
    height: "100%",
    left: "50%",
    top: 0,
    backgroundColor: "#FFFFFF",
  },
  tooltip: {
    position: "absolute",
    backgroundColor: "rgba(30, 41, 59, 0.85)",
    padding: 6,
    borderRadius: 4,
    zIndex: 100,
    minWidth: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  tooltipText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 14,
    color: "#1E293B",
  },
  barChartContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginTop: 10,
  },
  barChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    height: 200,
    marginBottom: 40,
  },
  barItemContainer: {
    alignItems: "center",
    width: 70,
    position: "relative",
    height: "100%",
    justifyContent: "flex-end",
  },
  barContent: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
  },
  bar: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minHeight: 10, // Ensure visibility even for zero values
  },
  barValue: {
    marginBottom: 5,
    fontSize: 14,
    fontWeight: "bold",
    color: "#1E293B",
  },
  barLabel: {
    marginTop: 8,
    fontSize: 13,
    textAlign: "center",
    color: "#64748B",
    maxWidth: 70,
    position: "absolute",
    bottom: -35,
    height: 35, // Increase height to accommodate two lines
  },
  barTooltip: {
    position: "absolute",
    top: -30,
    backgroundColor: "rgba(30, 41, 59, 0.85)",
    padding: 6,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default InteractiveChart;
