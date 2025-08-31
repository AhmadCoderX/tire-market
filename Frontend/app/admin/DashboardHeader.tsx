import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface DashboardHeaderProps {
  title: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title }) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 33,
    width: "100%",
  },
  headerContent: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    fontFamily: "Arial",
    flexDirection: "row",
  },
  titleContainer: {
    marginTop: "auto",
    marginBottom: "auto",
  },
  title: {
    fontFamily: "Arial",
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
    lineHeight: 32,
  },
});

export default DashboardHeader;
