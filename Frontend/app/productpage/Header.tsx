import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Chat: undefined;
  ProfileDetails: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Header = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.leftSection}>
          <TouchableOpacity 
            style={styles.logoContainer}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.logo}>TireMarket</Text>
          </TouchableOpacity>
          <View style={styles.searchContainer}>
            <View style={styles.sellerTypeContainer}>
              <Text style={styles.sellerTypeText}>Seller type</Text>
              <Image
                source={{
                  uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/a8ccea4db181b6b3ca326188ee9b1c53f9adba96298f8203b52168dcaad82ed6?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f",
                }}
                style={styles.dropdownIcon}
                accessibilityLabel="Dropdown icon"
              />
            </View>
            <View style={styles.searchInputContainer}>
              <View style={styles.searchInput}>
                <Image
                  source={{
                    uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/1a209168d066adb781f02ef1f6936c4d00d0e5cf099e44c21de63c2d16b2dd11?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f",
                  }}
                  style={styles.searchIcon}
                  accessibilityLabel="Search icon"
                />
                <Text style={styles.searchPlaceholder}>Search</Text>
              </View>
              <View style={styles.searchButton}>
                <Image
                  source={{
                    uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/4042a0577268773c8b6f18022fe2988c49935b374fff9bc3f213796693054677?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f",
                  }}
                  style={styles.searchButtonIcon}
                  accessibilityLabel="Search button"
                />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.rightSection}>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.upgradeButton}
              accessibilityRole="button"
              accessibilityLabel="Upgrade"
            >
              <Text style={styles.upgradeButtonText}>Upgrade</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sellButton}
              accessibilityRole="button"
              accessibilityLabel="Sell"
            >
              <Image
                source={{
                  uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/378673f37b0c474ed0eb4c5812a7372bb15e1a9c7b8f5f79b8f7297054e072be?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f",
                }}
                style={styles.sellIcon}
                accessibilityLabel="Sell icon"
              />
              <Text style={styles.sellButtonText}>Sell</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />
          <View style={styles.profileSection}>
            <View style={styles.profileImageContainer} />
            <Image
              source={{
                uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/a8ccea4db181b6b3ca326188ee9b1c53f9adba96298f8203b52168dcaad82ed6?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f",
              }}
              style={styles.profileIcon}
              accessibilityLabel="Profile icon"
            />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>2</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('Chat')}
          >
            <Text style={styles.buttonText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('ProfileDetails')}
          >
            <Text style={styles.buttonText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#E6E6E6",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 16,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    flexWrap: "wrap",
    minWidth: 240,
  },
  logoContainer: {
    flex: 1,
  },
  logo: {
    fontFamily: "Inter",
    fontSize: 14,
    fontWeight: "400",
    color: "#000",
  },
  searchContainer: {
    minWidth: 240,
    flexDirection: "column",
    gap: 12,
  },
  sellerTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#6B6B6B",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  sellerTypeText: {
    fontFamily: "Inter",
    fontSize: 14,
    fontWeight: "500",
    color: "#6B6B6B",
  },
  dropdownIcon: {
    width: 16,
    height: 16,
  },
  searchInputContainer: {
    width: 314,
  },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#A1A1A1",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 4,
  },
  searchIcon: {
    width: 16,
    height: 16,
  },
  searchPlaceholder: {
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
    minWidth: 240,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 2,
  },
  sellIcon: {
    width: 16,
    height: 16,
  },
  sellButtonText: {
    fontFamily: "Inter",
    fontSize: 14,
    fontWeight: "500",
    color: "#5B7560",
  },
  divider: {
    height: 24,
    width: 1,
    backgroundColor: "#E6E6E6",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  profileImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profileIcon: {
    width: 16,
    height: 16,
  },
  notificationBadge: {
    position: "absolute",
    top: 4,
    right: 76,
    width: 14,
    height: 14,
    backgroundColor: "#3A593F",
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  notificationCount: {
    fontFamily: "Inter",
    fontSize: 12,
    fontWeight: "500",
    color: "#FDFDFD",
    textAlign: "center",
    lineHeight: 12,
  },
  button: {
    backgroundColor: '#4F6C46',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Arial',
  },
});

export default Header;
