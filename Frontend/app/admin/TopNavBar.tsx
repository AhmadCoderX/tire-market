import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const TopNavBar: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Logo</Text>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Image
            source={{
              uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/5f37f81f95fca4a7aa65d8be5883b7896d7852238c27eda5aa9cb229304707d2?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f",
            }}
            style={styles.actionIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Image
            source={{
              uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/0cc23690fc3b8d4b2f97aaaeb1c27e8cbd706dc4c10fd079d3e031431215d9dd?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f",
            }}
            style={styles.actionIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Image
            source={{
              uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/3bda09a282a2244da81b62825878e60c339effe72ec01b036db7459ed5245e6c?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f",
            }}
            style={styles.actionIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: "100%",
    paddingLeft: 16,
    paddingRight: 33,
    paddingTop: 15,
    paddingBottom: 15,
    alignItems: "center",
    gap: 20,
    flexWrap: "wrap",
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logoContainer: {
    color: "#000000",
    fontSize: 18,
    fontFamily: "Arial",
    fontWeight: "600",
    lineHeight: 28,
    marginTop: "auto",
    marginBottom: "auto",
  },
  logoText: {
    fontFamily: "Arial",
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  actionsContainer: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    flexDirection: "row",
  },
  actionButton: {
    borderRadius: 6,
    display: "flex",
    minHeight: 36,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 8,
    paddingBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionIcon: {
    aspectRatio: 1,
    width: 20,
    height: 20,
    alignSelf: "stretch",
    marginTop: "auto",
    marginBottom: "auto",
  },
});

export default TopNavBar;
