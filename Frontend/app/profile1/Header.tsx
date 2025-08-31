import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";

const Header: React.FC = () => {
  return (
    <View style={styles.header} accessibilityRole="none">
      <View style={styles.headerContent}>
        <View style={styles.leftSection}>
          <Text style={styles.logo} accessibilityRole="text">
            Logo
          </Text>
          <View style={styles.searchSection}>
            <TouchableOpacity
              style={styles.sellerTypeButton}
              accessibilityRole="button"
              accessibilityLabel="Select seller type"
            >
              <Text style={styles.sellerTypeText}>Seller type</Text>
              <Image
                source={{
                  uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/905ecf454767645711050bfd4df136374cca7b95ca9f9b582e9c043a003d2145?placeholderIfAbsent=true&apiKey=12d7f7129f4044a9bb76564f490dda4e",
                }}
                style={styles.chevronIcon}
                accessibilityLabel="Dropdown icon"
              />
            </TouchableOpacity>
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <Image
                  source={{
                    uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/104405b5990e2426505e705bc88eb9b61ec9ee18a6d6d4bc8e9db1e0e47425c1?placeholderIfAbsent=true&apiKey=12d7f7129f4044a9bb76564f490dda4e",
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
                    uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/bfaa7115e649b18fd2216bc4f07a737cd4875d58ebf6fd91f2193213a574ed0b?placeholderIfAbsent=true&apiKey=12d7f7129f4044a9bb76564f490dda4e",
                  }}
                  style={styles.searchButtonIcon}
                  accessibilityLabel="Search button icon"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.rightSection}>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.upgradeButton}
              accessibilityRole="button"
              accessibilityLabel="Upgrade account"
            >
              <Text style={styles.upgradeButtonText}>Upgrade</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sellButton}
              accessibilityRole="button"
              accessibilityLabel="Sell item"
            >
              <Image
                source={{
                  uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/5317640ef69733083670882d9a6e9d8cb6e0a23d5c696b1af7e4ad354dd61369?placeholderIfAbsent=true&apiKey=12d7f7129f4044a9bb76564f490dda4e",
                }}
                style={styles.plusIcon}
                accessibilityLabel="Plus icon"
              />
              <Text style={styles.sellButtonText}>Sell</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.notificationDot} />
          <View style={styles.profileSection}>
            <View style={styles.profileImageContainer} />
            <Image
              source={{
                uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/905ecf454767645711050bfd4df136374cca7b95ca9f9b582e9c043a003d2145?placeholderIfAbsent=true&apiKey=12d7f7129f4044a9bb76564f490dda4e",
              }}
              style={styles.profileChevron}
              accessibilityLabel="Profile dropdown"
            />
          </View>
          <Text
            style={styles.notificationCount}
            accessibilityLabel="2 notifications"
          >
            2
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#E6E6E6",
    paddingHorizontal: 44,
    paddingVertical: 12,
    backgroundColor: "#F5F5F5",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    flexWrap: "wrap",
  },
  logo: {
    fontFamily: "Inter",
    fontSize: 14,
    fontWeight: "400",
    color: "#000",
  },
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minWidth: 240,
  },
  sellerTypeButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#6B6B6B",
    borderRadius: 8,
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 8,
    gap: 12,
  },
  sellerTypeText: {
    fontFamily: "Inter",
    fontSize: 14,
    fontWeight: "500",
    color: "#6B6B6B",
  },
  chevronIcon: {
    width: 16,
    height: 16,
  },
  searchContainer: {
    width: 314,
    position: "relative",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#A1A1A1",
    borderRadius: 8,
    paddingLeft: 8,
    paddingRight: 16,
    paddingVertical: 8,
    gap: 4,
  },
  searchIcon: {
    width: 16,
    height: 16,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Inter",
    fontSize: 14,
    fontWeight: "500",
    color: "#A1A1A1",
  },
  searchButton: {
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "#5B7560",
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    width: 33,
    height: 33,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  searchButtonIcon: {
    width: 20,
    height: 20,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    position: "relative",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    zIndex: 0,
  },
  upgradeButton: {
    backgroundColor: "#5B7560",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  upgradeButtonText: {
    fontFamily: "Inter",
    fontSize: 14,
    fontWeight: "500",
    color: "#FDFDFD",
    textAlign: "center",
  },
  sellButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#5B7560",
    borderRadius: 4,
    paddingLeft: 8,
    paddingRight: 12,
    paddingVertical: 8,
    gap: 2,
  },
  plusIcon: {
    width: 16,
    height: 16,
  },
  sellButtonText: {
    fontFamily: "Inter",
    fontSize: 14,
    fontWeight: "500",
    color: "#5B7560",
  },
  notificationDot: {
    position: "absolute",
    backgroundColor: "#3A593F",
    width: 14,
    height: 14,
    borderRadius: 50,
    zIndex: 0,
    top: 4,
    right: 73,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    zIndex: 0,
  },
  profileImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  profileChevron: {
    width: 16,
    height: 16,
  },
  notificationCount: {
    position: "absolute",
    color: "#FDFDFD",
    fontFamily: "Inter",
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 12,
    zIndex: 0,
    right: 76,
    top: 5,
    width: 8,
    height: 12,
  },
});

export default Header;
