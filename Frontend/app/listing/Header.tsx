import * as React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useResponsiveLayout } from "./useResponsiveLayout";

const Header: React.FC = () => {
  const { isSmallScreen, isMediumScreen } = useResponsiveLayout();

  return (
    <View style={styles.headerContainer}>
      <View
        style={[
          styles.headerContent,
          isSmallScreen && styles.headerContentSmall,
        ]}
      >
        <View
          style={[
            styles.leftSection,
            isSmallScreen && styles.leftSectionSmall,
            isMediumScreen && styles.leftSectionMedium,
          ]}
        >
          <View style={styles.logo} accessibilityRole="image">
            <Text>Logo</Text>
          </View>
          <View
            style={[
              styles.searchSection,
              isSmallScreen && styles.searchSectionSmall,
            ]}
          >
            {!isSmallScreen && (
              <TouchableOpacity
                style={styles.sellerTypeButton}
                accessibilityRole="button"
              >
                <Text style={styles.sellerTypeText}>Seller type</Text>
                <Image
                  source={{
                    uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/a5d65c107365998ff301d337494e827e1a0738fb4f50365f69e7bd7066163b7d?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f",
                  }}
                  style={styles.dropdownIcon}
                  accessibilityLabel="Dropdown icon"
                />
              </TouchableOpacity>
            )}
            <View
              style={[
                styles.searchContainer,
                isSmallScreen && styles.searchContainerSmall,
              ]}
            >
              <View style={styles.searchBar}>
                <Image
                  source={{
                    uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/bdf7a78a7df5244cce2569cd480eed2fe0fdb690da6ed7bea47c5238b0df5be2?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f",
                  }}
                  style={styles.searchIcon}
                  accessibilityLabel="Search icon"
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search"
                  placeholderTextColor="#A1A1A1"
                  accessibilityLabel="Search input"
                />
              </View>
              <TouchableOpacity
                style={styles.searchButton}
                accessibilityRole="button"
                accessibilityLabel="Search button"
              >
                <Image
                  source={{
                    uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/856dffb39e9bef0aff09a7bf9716a0f73d4ef1a4b572054b02df119250b6714e?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f",
                  }}
                  style={styles.searchButtonIcon}
                  accessibilityLabel="Search button icon"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View
          style={[
            styles.rightSection,
            isSmallScreen && styles.rightSectionSmall,
          ]}
        >
          <View
            style={[
              styles.actionButtons,
              isSmallScreen && styles.actionButtonsSmall,
            ]}
          >
            <TouchableOpacity
              style={styles.upgradeButton}
              accessibilityRole="button"
            >
              <Text style={styles.upgradeButtonText}>Upgrade</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sellButton}
              accessibilityRole="button"
            >
              <Image
                source={{
                  uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/c2c9fec92f44394c5289f15d6e04952c2a9de8e60c555449321364ba8b6d9d82?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f",
                }}
                style={styles.sellIcon}
                accessibilityLabel="Sell icon"
              />
              <Text style={styles.sellButtonText}>Sell</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.notificationDot} />
          <TouchableOpacity
            style={styles.profileButton}
            accessibilityRole="button"
          >
            <View style={styles.profileAvatar} />
            <Image
              source={{
                uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/0fb32c3f40976f19be150754a4bc08e80b63cce018a6ed82216e4aaec0f3d6f6?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f",
              }}
              style={styles.profileIcon}
              accessibilityLabel="Profile icon"
            />
          </TouchableOpacity>
          <Text style={styles.notificationCount}>2</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#E6E6E6",
    paddingHorizontal: 44,
    paddingVertical: 12,
    justifyContent: "center",
  },
  headerContent: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 100,
  },
  headerContentSmall: {
    flexDirection: "column",
    gap: 16,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    flexWrap: "wrap",
    alignSelf: "stretch",
    minWidth: 240,
  },
  leftSectionSmall: {
    width: "100%",
    justifyContent: "center",
  },
  leftSectionMedium: {
    gap: 16,
  },
  logo: {
    alignSelf: "stretch",
    justifyContent: "center",
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 14,
    fontWeight: "400",
    color: "#000",
  },
  searchSection: {
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minWidth: 240,
  },
  searchSectionSmall: {
    width: "100%",
    marginTop: 12,
  },
  sellerTypeButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#6B6B6B",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 14,
    color: "#6B6B6B",
    fontWeight: "500",
    textAlign: "center",
  },
  sellerTypeText: {
    color: "#6B6B6B",
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 14,
    fontWeight: "500",
  },
  dropdownIcon: {
    width: 16,
    height: 16,
    aspectRatio: 1,
  },
  searchContainer: {
    flex: 1,
    minWidth: 240,
    width: 314,
  },
  searchContainerSmall: {
    width: "100%",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#A1A1A1",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 4,
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 14,
    color: "#A1A1A1",
    fontWeight: "500",
    textAlign: "center",
  },
  searchIcon: {
    width: 16,
    height: 16,
    aspectRatio: 1,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 14,
    color: "#A1A1A1",
    fontWeight: "500",
  },
  searchButton: {
    position: "absolute",
    right: 0,
    top: 0,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: "#5B7560",
    zIndex: 10,
    width: 33,
    height: 33,
    paddingHorizontal: 4,
  },
  searchButtonIcon: {
    width: 20,
    height: 20,
    aspectRatio: 1,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    position: "relative",
    alignSelf: "stretch",
    minWidth: 240,
  },
  rightSectionSmall: {
    width: "100%",
    justifyContent: "center",
    marginTop: 12,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  actionButtonsSmall: {
    width: "100%",
    justifyContent: "center",
  },
  upgradeButton: {
    borderRadius: 4,
    backgroundColor: "#5B7560",
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: "stretch",
    height: 32,
  },
  upgradeButtonText: {
    color: "#FDFDFD",
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  sellButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#5B7560",
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 2,
    height: 32,
  },
  sellIcon: {
    width: 16,
    height: 16,
    aspectRatio: 1,
  },
  sellButtonText: {
    color: "#5B7560",
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  notificationDot: {
    position: "absolute",
    backgroundColor: "#3A593F",
    borderRadius: 50,
    width: 14,
    height: 14,
    left: 190,
    top: 4,
    zIndex: 1,
  },
  profileButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  profileAvatar: {
    borderRadius: 50,
    width: 40,
    height: 40,
  },
  profileIcon: {
    width: 16,
    height: 16,
    aspectRatio: 1,
  },
  notificationCount: {
    position: "absolute",
    color: "#FDFDFD",
    textAlign: "center",
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 12,
    right: 76,
    top: 5,
    width: 8,
    height: 12,
    zIndex: 1,
  },
});

export default Header;
