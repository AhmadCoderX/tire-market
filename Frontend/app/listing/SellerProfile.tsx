import * as React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import TabSelector from "./TabSelector";
import { useResponsiveLayout } from "./useResponsiveLayout";

interface SellerProfileProps {
  style?: object;
}

const SellerProfile: React.FC<SellerProfileProps> = ({ style }) => {
  const [activeTab, setActiveTab] = React.useState("services");
  const { isSmallScreen } = useResponsiveLayout();

  const tabOptions = [
    { id: "services", label: "Services" },
    { id: "businessHours", label: "Business Hours" },
  ];

  const renderServiceTags = () => {
    // This would typically come from a data source
    const serviceTags = Array(9).fill("Business");

    return (
      <View style={styles.tagsContainer}>
        {serviceTags.map((tag, index) => (
          <View key={index} style={styles.tagItem}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View
      style={[styles.container, style]}
      accessibilityRole="none"
      accessibilityLabel="Seller Profile"
    >
      <View style={styles.innerContainer}>
        <View
          style={[
            styles.profileHeader,
            isSmallScreen && styles.profileHeaderSmall,
          ]}
        >
          <View style={styles.profileInfo}>
            <View style={styles.avatarPlaceholder} />
            <View style={styles.shopInfo}>
              <Text
                style={[styles.shopName, isSmallScreen && styles.shopNameSmall]}
                accessibilityRole="header"
              >
                TireMax Pro Shop
              </Text>
              <View style={styles.ratingContainer}>
                <View style={styles.ratingScore}>
                  <Image
                    source={{
                      uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/7e8d529db7767f094fa39e175f33e238ff018befe3eb38d6d423770c33a75743?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f",
                    }}
                    style={styles.starIcon}
                    accessibilityLabel="Star rating icon"
                  />
                  <Text style={styles.ratingValue}>4.8</Text>
                </View>
                <Text style={styles.reviewCount}>(127 reviews)</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.messageButton}
            accessibilityRole="button"
            accessibilityLabel="Message seller"
          >
            <Image
              source={{
                uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/a1c2c0a0d6f1f44d7575e3be7cc5696a63c5838c0bc9b9c21e23a66856095a8e?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f",
              }}
              style={styles.messageIcon}
              accessibilityLabel="Message icon"
            />
            <Text style={styles.messageText}>Message</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabsSection}>
          <TabSelector
            options={tabOptions}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {activeTab === "services" && (
            <>
              <View style={styles.serviceSection}>{renderServiceTags()}</View>
              <View style={styles.serviceSection}>{renderServiceTags()}</View>
              <View style={styles.serviceSection}>{renderServiceTags()}</View>
              <View style={styles.serviceSection}>{renderServiceTags()}</View>
            </>
          )}

          {activeTab === "businessHours" && (
            <View style={styles.businessHoursContainer}>
              <Text style={styles.businessHoursText}>
                Monday - Friday: 8:00 AM - 6:00 PM{"\n"}
                Saturday: 9:00 AM - 5:00 PM{"\n"}
                Sunday: Closed
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "stretch",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    backgroundColor: "#F5F5F5",
    alignSelf: "stretch",
    minWidth: 240,
    padding: 24,
    flexDirection: "column",
    justifyContent: "center",
  },
  innerContainer: {
    width: "100%",
  },
  profileHeader: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 100,
  },
  profileHeaderSmall: {
    flexDirection: "column",
    gap: 16,
  },
  profileInfo: {
    flexDirection: "row",
    minWidth: 240,
    gap: 12,
  },
  avatarPlaceholder: {
    borderRadius: 50,
    width: 72,
    height: 72,
    backgroundColor: "#E0E0E0",
  },
  shopInfo: {
    flexDirection: "column",
    minWidth: 240,
    width: 297,
  },
  shopName: {
    color: "#2B2B2B",
    fontSize: 32,
    fontWeight: "600",
    lineHeight: 32,
    letterSpacing: -0.75,
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
  },
  shopNameSmall: {
    fontSize: 24,
    lineHeight: 28,
  },
  ratingContainer: {
    flexDirection: "row",
    marginTop: 8,
    alignItems: "center",
    gap: 4,
    fontSize: 16,
  },
  ratingScore: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    color: "#09090B",
    fontWeight: "700",
  },
  starIcon: {
    width: 20,
    height: 20,
    aspectRatio: 1,
  },
  ratingValue: {
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 16,
    fontWeight: "700",
    color: "#09090B",
  },
  reviewCount: {
    color: "#344E41",
    fontWeight: "400",
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 16,
  },
  messageButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    backgroundColor: "#5B7560",
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 4,
    height: 32,
    alignSelf: "flex-start",
  },
  messageIcon: {
    width: 16,
    height: 16,
    aspectRatio: 1,
  },
  messageText: {
    color: "#E6E6E6",
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 14,
  },
  tabsSection: {
    marginTop: 24,
    width: "100%",
  },
  serviceSection: {
    marginTop: 8,
    width: "100%",
    color: "#3A593F",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    alignItems: "center",
    gap: 8,
  },
  tagItem: {
    borderRadius: 9999,
    backgroundColor: "#EBEEEC",
    paddingHorizontal: 11,
    paddingVertical: 3,
  },
  tagText: {
    color: "#3A593F",
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 12,
    fontWeight: "500",
  },
  businessHoursContainer: {
    marginTop: 16,
    padding: 16,
  },
  businessHoursText: {
    color: "#3A593F",
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 14,
    lineHeight: 24,
  },
});

export default SellerProfile;
