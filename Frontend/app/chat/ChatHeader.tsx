import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";

// Simplified icon components for the chat header
const ChevronDownIcon = () => (
  <View style={{ width: 16, height: 16 }}>
    <Image
      source={{
        uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/a8ccea4db181b6b3ca326188ee9b1c53f9adba96298f8203b52168dcaad82ed6?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f",
      }}
      style={{ width: 16, height: 16 }}
      accessibilityLabel="Dropdown icon"
    />
  </View>
);

const SearchIcon = ({ color }: { color: string }) => (
  <View style={{ width: 20, height: 20 }}>
    <Image
      source={{
        uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/e28ad5d43bab4de34652f910640edc25d88a120bbf1ab3a9ab10095730c8fac3?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f",
      }}
      style={{ width: 20, height: 20 }}
      accessibilityLabel="Search icon"
    />
  </View>
);

const ShoppingCartIcon = () => (
  <View style={{ width: 20, height: 20 }}>
    <Image
      source={{
        uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/6b3d5e0af1f2139eefadaaceba9d948381d1afd99c262b2c663cb0b340bf09be?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f",
      }}
      style={{ width: 20, height: 20 }}
      accessibilityLabel="Cart icon"
    />
  </View>
);

const PlusIcon = ({ color }: { color: string }) => (
  <View style={{ width: 16, height: 16 }}>
    <Image
      source={{
        uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/378673f37b0c474ed0eb4c5812a7372bb15e1a9c7b8f5f79b8f7297054e072be?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f",
      }}
      style={{ width: 16, height: 16 }}
      accessibilityLabel="Plus icon"
    />
  </View>
);

interface ChatHeaderProps {
  onSearch: (query: string) => void;
  onProfilePress: () => void;
  isLoggedIn: boolean;
  userEmail?: string;
  onLogout: () => void;
  onLogin: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  onSearch,
  onProfilePress,
  isLoggedIn,
  userEmail,
  onLogout,
  onLogin,
}) => {
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [showSellerTypeDropdown, setShowSellerTypeDropdown] = useState(false);
  const [sellerType, setSellerType] = useState("Seller type");
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Mock database of searchable items for chat
  const searchDatabase = [
    "tire discussions",
    "price inquiries",
    "shipping questions",
    "product availability",
    "tire specifications",
    "payment methods",
    "return policy",
    "warranty information",
  ];

  // Generate suggestions based on user input
  useEffect(() => {
    if (searchText.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filteredSuggestions = searchDatabase.filter((item) =>
      item.toLowerCase().includes(searchText.toLowerCase())
    );

    setSuggestions(filteredSuggestions);
    onSearch(searchText);
  }, [searchText]);

  const handleUpgradeClick = () => {
    setShowUpgradePopup(true);
  };

  const handleSellClick = () => {
    // Navigate to sell page
  };

  const handleSellerTypeSelect = (type: string) => {
    setSellerType(type);
    setShowSellerTypeDropdown(false);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setSearchText(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
  };

  const handleSearchFocus = () => {
    if (searchText.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    setShowSuggestions(text.length > 0);
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>Logo</Text>
          </View>
          <View style={styles.searchSection}>
            <View style={styles.dropdownContainer}>
              <TouchableOpacity
                style={styles.sellerType}
                onPress={() => setShowSellerTypeDropdown(!showSellerTypeDropdown)}
                accessibilityRole="button"
                accessibilityLabel="Select seller type"
                accessibilityHint="Opens dropdown to select seller type"
              >
                <Text style={styles.sellerTypeText}>{sellerType}</Text>
                <ChevronDownIcon />
              </TouchableOpacity>

              {showSellerTypeDropdown && (
                <View style={styles.dropdown}>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => handleSellerTypeSelect("Individual")}
                    accessibilityRole="menuitem"
                    accessibilityLabel="Individual seller"
                  >
                    <Text style={styles.dropdownText}>Individual</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => handleSellerTypeSelect("Business")}
                    accessibilityRole="menuitem"
                    accessibilityLabel="Business seller"
                  >
                    <Text style={styles.dropdownText}>Business</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.searchBoxContainer}>
              <View style={styles.searchBox}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search conversations"
                  placeholderTextColor="#A1A1A1"
                  value={searchText}
                  onChangeText={handleSearchChange}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  accessibilityLabel="Search conversations"
                  accessibilityHint="Enter text to search through conversations"
                />
                <TouchableOpacity
                  style={styles.searchButton}
                  accessibilityRole="button"
                  accessibilityLabel="Search"
                >
                  <SearchIcon color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {showSuggestions && suggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                  <FlatList
                    data={suggestions}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.suggestionItem}
                        onPress={() => handleSuggestionSelect(item)}
                        accessibilityRole="button"
                        accessibilityLabel={`Suggestion: ${item}`}
                      >
                        <Text style={styles.suggestionText}>{item}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.upgradeBtn}
            onPress={handleUpgradeClick}
            accessibilityRole="button"
            accessibilityLabel="Upgrade account"
          >
            <Text style={styles.upgradeBtnText}>Upgrade</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sellBtn}
            onPress={handleSellClick}
            accessibilityRole="button"
            accessibilityLabel="Sell item"
          >
            <PlusIcon color="#5B7560" />
            <Text style={styles.sellBtnText}>Sell</Text>
          </TouchableOpacity>
          <View style={styles.cartWrapper}>
            <ShoppingCartIcon />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>2</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.profile}
            onPress={onProfilePress}
            accessibilityRole="button"
            accessibilityLabel="Profile menu"
          >
            <View style={styles.profileImg} />
            <ChevronDownIcon />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e6e6e6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 64,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 1200,
    padding: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 16,
  },
  logo: {
    marginRight: 16,
  },
  logoText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    maxWidth: 600,
    gap: 8,
  },
  dropdownContainer: {
    position: "relative",
    minWidth: 140,
  },
  sellerType: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    gap: 8,
  },
  sellerTypeText: {
    fontSize: 14,
    color: "#000000",
  },
  searchBoxContainer: {
    flex: 1,
    position: "relative",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#000000",
    paddingVertical: 8,
    marginLeft: 8,
  },
  searchButton: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  upgradeBtn: {
    backgroundColor: "#000000",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  upgradeBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
  sellBtn: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e6e6e6",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sellBtnText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "500",
  },
  cartWrapper: {
    position: "relative",
    marginLeft: 6,
  },
  cartBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#5B7560",
    alignItems: "center",
    justifyContent: "center",
  },
  cartBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  profileImg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E5E5E5",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e6e6e6",
    marginTop: 4,
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 12,
  },
  dropdownText: {
    fontSize: 14,
    color: "#000000",
  },
  suggestionsContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e6e6e6",
    marginTop: 4,
    maxHeight: 200,
    zIndex: 1000,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e6e6e6",
  },
  suggestionText: {
    fontSize: 14,
    color: "#000000",
  },
});

export default ChatHeader;