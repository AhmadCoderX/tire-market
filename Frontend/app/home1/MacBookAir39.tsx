import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Header from "../header/Header";
import FilterSidebar from "./FilterSidebar";
import ProductGrid from "./ProductGrid";

const MacBookAir39 = () => {
  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityLabel="E-commerce marketplace page"
    >
      <Header />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        accessible={true}
        accessibilityLabel="Main content"
      >
        <View style={styles.mainContent}>
          <FilterSidebar />
          <ProductGrid />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    alignItems: "stretch",
  },
  content: {
    flex: 1,
    paddingBottom: 79,
  },
  contentContainer: {
    paddingTop: 24,
  },
  mainContent: {
    flexDirection: "row",
    alignSelf: "center",
    width: "100%",
    maxWidth: 1076,
    gap: 20,
  },
});

export default MacBookAir39;
