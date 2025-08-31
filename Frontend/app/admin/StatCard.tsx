import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";

interface StatCardProps {
  title: string;
  value: string;
  iconSource: ImageSourcePropType;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, iconSource }) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.textContainer}>
          <Text style={styles.valueText}>{value}</Text>
          <Text style={styles.titleText}>{title}</Text>
        </View>
        <Image source={iconSource} style={styles.icon} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "stretch",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#8A9891",
    backgroundColor: "#EBEDEC",
    alignSelf: "stretch",
    display: "flex",
    minWidth: 240,
    marginTop: "auto",
    marginBottom: "auto",
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 40,
    paddingBottom: 40,
    flexDirection: "column",
    overflow: "hidden",
    justifyContent: "center",
    flexGrow: 1,
    flexShrink: 1,
    width: 250,
  },
  contentWrapper: {
    display: "flex",
    width: "100%",
    gap: 48,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  textContainer: {
    width: 185,
  },
  valueText: {
    color: "#354E41",
    fontSize: 32,
    fontFamily: "Arial",
    fontWeight: "600",
    lineHeight: 39,
  },
  titleText: {
    color: "#6B6B6B",
    fontSize: 16,
    fontFamily: "Arial",
    fontWeight: "500",
    marginTop: 8,
    lineHeight: 19,
  },
  icon: {
    aspectRatio: 1,
    width: 32,
    height: 32,
    flexShrink: 0,
  },
});

export default StatCard;
