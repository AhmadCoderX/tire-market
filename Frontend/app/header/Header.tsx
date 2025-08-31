import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Alert,
  Image,
  useWindowDimensions,
  Animated,
} from "react-native";
import {
  ChevronDownIcon,
  SearchIcon,
  PlusIcon,
} from "../figmahomepage/icons";
import PricingModal from "./Upgradepopup";
import { useRouter } from "expo-router";
import MaterialIcons from "react-native-vector-icons/MaterialIcons"; // Import MaterialIcons
import { debounce } from 'lodash'; // You may need to install this: npm install lodash
import { getSearchSuggestions, getUserProfile } from "../services/api";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ChatHeaderProps {
  onSearch: (query: string, sellerType: string) => void;
  onProfilePress?: () => void;  // Optional since it's not always used
  onUpgrade?: () => void;  // Optional callback for upgrade button
  onSell?: () => void;  // Optional callback for sell button
  onMessage?: () => void;  // Optional callback for message button
  isLoggedIn?: boolean;  // Optional prop to control logged in state externally
  initialSellerType?: string;  // Optional prop to set initial seller type
  currentPage?: 'tires' | 'shops';  // New prop to indicate current page
}

const Header: React.FC<ChatHeaderProps> = ({ onSearch, onProfilePress, onUpgrade, onSell, onMessage, isLoggedIn, initialSellerType, currentPage }) => {
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [showSellerTypeDropdown, setShowSellerTypeDropdown] = useState(false);
  const [sellerType, setSellerType] = useState(initialSellerType || "Individual");
  const [searchText, setSearchText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedInState, setIsLoggedIn] = useState(isLoggedIn || false);
  const router = useRouter();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const { width } = useWindowDimensions();
  const fadeAnim = new Animated.Value(0);
  const searchFadeAnim = new Animated.Value(0);
  
  // Determine if we're on mobile based on screen width
  const isMobile = width < 768;

  // Create a debounced function for fetching suggestions
  const debouncedFetchSuggestions = useCallback(
    debounce(async (text: string) => {
      if (text.length >= 2) {
        setIsLoading(true);
        try {
          const results = await getSearchSuggestions(text);
          setSuggestions(results);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 300), // 300ms debounce time
    []
  );

  // Call the debounced function when searchText changes
  useEffect(() => {
    debouncedFetchSuggestions(searchText);
    
    // Clean up the debounced function on component unmount
    return () => {
      debouncedFetchSuggestions.cancel();
    };
  }, [searchText, debouncedFetchSuggestions]);

  // Add useEffect to check login status
  useEffect(() => {
    checkLoginStatus();
  }, []);

  // Add useEffect to fetch user profile when logged in
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          const profile = await getUserProfile(token);
          console.log('User profile data:', profile);
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (isLoggedInState) {
      fetchUserProfile();
    }
  }, [isLoggedInState]);

  // Add useEffect for menu fade animation
  useEffect(() => {
    if (showMobileMenu) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [showMobileMenu]);

  // Add useEffect for search fade animation
  useEffect(() => {
    if (showMobileSearch) {
      Animated.timing(searchFadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(searchFadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [showMobileSearch]);

  const checkLoginStatus = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      setIsLoggedIn(!!accessToken);
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoggedIn(false);
    }
  };

  const handleUpgradeClick = () => {
    setShowUpgradePopup(true);
    setShowMobileMenu(false);
  };

  const handleUpgradeClose = () => {
    setShowUpgradePopup(false);
  };

  const handleSellClick = () => {
    router.push("/sell");
    setShowMobileMenu(false);
  };

  const handleMessageClick = () => {
    router.push("/chat"); // Navigate to the chat page
    setShowMobileMenu(false);
  };

  const handleSellerTypeSelect = (type: string) => {
    setSellerType(type);
    setShowSellerTypeDropdown(false);
    
    // Perform the search again with the new seller type
    if (searchText) {
      onSearch(searchText, type);
    }
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setSearchText(suggestion);
    setShowSuggestions(false);
    
    // Perform search with the selected suggestion
    onSearch(suggestion, sellerType);
  };

  const handleSearchFocus = () => {
    if (searchText.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    setShowSuggestions(text.length > 0);
    
    // Trigger search immediately as user types
    if (text.length >= 2) { // Only search if at least 2 characters
      onSearch(text, sellerType);
    } else if (text.length === 0) {
      onSearch('', sellerType); // Clear search when input is empty
    }
  };

  const handleSearchBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const handleSearchSubmit = () => {
      setShowSuggestions(false);
    if (searchText.length > 0) {
      onSearch(searchText, sellerType);
    }
  };

  const handleLoginClick = () => {
    router.push("/login");
    setShowMobileMenu(false);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      setIsLoggedIn(false);
      setUserProfile(null);
      setShowProfileDropdown(false);
      // Navigate to login page or home page after logout
      router.push("/login");
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleNavigationToggle = (page: 'tires' | 'shops') => {
    if (page !== currentPage) {
      if (page === 'tires') {
        router.push("/home");
      } else {
        router.push("/shops");
      }
    }
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  // Check if user is a business user
  const isBusinessUser = userProfile?.is_business === true;

  // Check if user is an admin/superuser
  const isAdmin = userProfile?.is_superuser === true;

  const getStyles = () => {
    const isMobileWidth = width < 768;
    return StyleSheet.create({
      header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#E6E6E6",
        backgroundColor: "#FFFFFF",
        zIndex: 1,
      },
      headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        zIndex: 2,
      },
      logo: {
        justifyContent: "center",
        marginRight: 4,
      },
      logoText: {
        color: "#000",
        fontSize: 14,
        fontWeight: "500",
      },
      navigationToggle: {
        flexDirection: "row",
        backgroundColor: "#F5F5F5",
        borderRadius: 8,
        padding: 2,
        marginLeft: 16,
      },
      navigationButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        marginHorizontal: 1,
      },
      navigationButtonActive: {
        backgroundColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      },
      navigationButtonInactive: {
        backgroundColor: "transparent",
      },
      navigationButtonText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#666666",
      },
      navigationButtonTextActive: {
        color: "#333333",
        fontWeight: "600",
      },
      searchSection: {
        flexDirection: "row",
        gap: 8,
        zIndex: 3,
      },
      searchBoxContainer: {
        position: "relative",
        flexDirection: "column",
        width: 320,
        zIndex: 4,
      },
      searchBox: {
        flexDirection: "row",
        alignItems: "center",
        height: 36,
        borderWidth: 1,
        borderColor: "#D1D1D1",
        borderRadius: 4,
        overflow: "hidden",
      },
      searchInput: {
        flex: 1,
        color: "#333333",
        fontSize: 14,
        paddingHorizontal: 12,
        paddingVertical: 8,
        height: "100%",
      },
      searchButton: {
        height: "100%",
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#5B7560",
      },
      searchIcon: {
        width: 14,
        height: 14,
      },
      suggestionsContainer: {
        position: "absolute",
        top: 36,
        left: 0,
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E6E6E6",
        borderTopWidth: 0,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 10,
        maxHeight: 200,
      },
      suggestionItem: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
      },
      suggestionText: {
        fontSize: 14,
        color: "#333",
      },
      headerRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        zIndex: 1,
      },
      mobileHeaderRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
      },
      mobileSearchButton: {
        padding: 8,
      },
      mobileMenuButton: {
        padding: 8,
      },
      upgradeBtn: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: "#5B7560",
        borderRadius: 4,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
      },
      upgradeBtnText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "500",
      },
      sellBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: "#5B7560",
        borderRadius: 4,
        height: 36,
        backgroundColor: "#FFFFFF",
      },
      sellBtnText: {
        color: "#5B7560",
        fontSize: 14,
        fontWeight: "500",
      },
      messageBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: "#5B7560",
        borderRadius: 4,
        height: 36,
        backgroundColor: "#FFFFFF",
      },
      messageBtnText: {
        color: "#5B7560",
        fontSize: 14,
        fontWeight: "500",
      },
      profile: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingVertical: 4,
        paddingHorizontal: 4,
      },
      profileImg: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#E5E5E5',
        borderWidth: 2,
        borderColor: '#3A593F',
      },
      profileImgPlaceholder: {
        backgroundColor: '#5B7560',
        alignItems: 'center',
        justifyContent: 'center',
      },
      loginBtn: {
        backgroundColor: '#5B7560',
        width: 100, // Add specific width for login button
      },
      profileContainer: {
        position: 'relative',
      },
      profileDropdown: {
        position: 'absolute',
        top: 40,
        right: 0,
        width: 180,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E6E6E6',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        zIndex: 10,
        overflow: 'hidden',
      },
      profileDropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        backgroundColor: '#FFFFFF',
      },
      profileDropdownText: {
        marginLeft: 12,
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
        fontFamily: 'Arial',
      },
      logoutText: {
        color: '#D32F2F',
      },
      mobileMenuContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      mobileMenuContent: {
        backgroundColor: '#FFFFFF',
        marginTop: isMobileWidth ? 40 : 50,
        padding: isMobileWidth ? 12 : 16,
        width: isMobileWidth ? '90%' : '100%',
        alignSelf: 'center',
      },
      mobileMenuHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: isMobileWidth ? 12 : 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E6E6E6',
        marginBottom: isMobileWidth ? 12 : 16,
      },
      mobileMenuTitle: {
        fontSize: isMobileWidth ? 16 : 18,
        fontWeight: '600',
        color: '#333',
      },
      mobileMenuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: isMobileWidth ? 12 : 16,
        paddingHorizontal: isMobileWidth ? 16 : 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
      },
      mobileMenuButtonText: {
        marginLeft: 12,
        fontSize: isMobileWidth ? 14 : 16,
        color: '#333',
        fontWeight: '500',
        fontFamily: 'Arial',
      },
      mobileMenuLogoutButton: {
        borderBottomWidth: 0,
      },
      mobileMenuLogoutText: {
        color: '#D32F2F',
      },
      mobileSearchContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      mobileSearchContent: {
        backgroundColor: '#FFFFFF',
        marginTop: isMobileWidth ? 40 : 50,
        padding: isMobileWidth ? 12 : 16,
        width: isMobileWidth ? '90%' : '100%',
        alignSelf: 'center',
      },
      mobileSearchHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: isMobileWidth ? 12 : 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E6E6E6',
        marginBottom: isMobileWidth ? 12 : 16,
      },
      mobileSearchTitle: {
        fontSize: isMobileWidth ? 16 : 18,
        fontWeight: '600',
        color: '#333',
      },
      mobileSearchBoxContainer: {
        flexDirection: 'column',
        gap: isMobileWidth ? 12 : 16,
      },
      profileRingWeb: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E5E5E5',
        alignItems: 'center',
        justifyContent: 'center',
      },
      searchDropdown: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 4,
        marginTop: 4,
        zIndex: 1000,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        width: '100%',
        maxHeight: 300,
      },
      mobileMenu: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 4,
        marginTop: 4,
        zIndex: 1000,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        width: '100%',
      },
      mobileNavigationSection: {
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        marginBottom: 8,
        paddingBottom: 8,
      },
      mobileNavigationItem: {
        backgroundColor: 'transparent',
      },
      mobileNavigationItemActive: {
        backgroundColor: '#F5F5F5',
      },
      mobileNavigationTextActive: {
        color: '#3A593F',
        fontWeight: '600',
      },
    });
  };

  const styles = getStyles();

  return (
    <>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.logo}
            onPress={() => router.push("/home")}
          >
            <Text style={styles.logoText}>Logo</Text>
          </TouchableOpacity>
          
          {!isMobile && (
            <View style={styles.searchSection}>
              <View style={styles.searchBoxContainer}>
                <View style={styles.searchBox}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    placeholderTextColor="#A1A1A1"
                    value={searchText}
                    onChangeText={handleSearchChange}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                    onSubmitEditing={handleSearchSubmit}
                    returnKeyType="search"
                  />
                  <TouchableOpacity 
                    style={styles.searchButton}
                    onPress={handleSearchSubmit}
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
                        >
                          <Text style={styles.suggestionText}>{item}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Navigation Toggle - Moved after search */}
          {!isMobile && (
            <View style={styles.navigationToggle}>
              <TouchableOpacity
                style={[
                  styles.navigationButton,
                  currentPage === 'tires' ? styles.navigationButtonActive : styles.navigationButtonInactive
                ]}
                onPress={() => handleNavigationToggle('tires')}
              >
                <Text style={[
                  styles.navigationButtonText,
                  currentPage === 'tires' && styles.navigationButtonTextActive
                ]}>
                  Find Tires
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.navigationButton,
                  currentPage === 'shops' ? styles.navigationButtonActive : styles.navigationButtonInactive
                ]}
                onPress={() => handleNavigationToggle('shops')}
              >
                <Text style={[
                  styles.navigationButtonText,
                  currentPage === 'shops' && styles.navigationButtonTextActive
                ]}>
                  Find Shops
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        {isMobile ? (
          <View style={styles.mobileHeaderRight}>
            <TouchableOpacity 
              style={styles.mobileSearchButton}
              onPress={toggleMobileSearch}
            >
              <SearchIcon color="#5B7560" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.mobileMenuButton}
              onPress={toggleMobileMenu}
            >
              <MaterialIcons name="menu" size={24} color="#5B7560" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.headerRight}>
            {isLoggedInState ? (
              // Logged in state
              <>
                {/* Only show upgrade button if user is not a business user */}
                {!isBusinessUser && (
                  <TouchableOpacity
                    style={styles.upgradeBtn}
                    onPress={handleUpgradeClick}
                  >
                    <Text style={styles.upgradeBtnText}>Upgrade</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.sellBtn} onPress={handleSellClick}>
                  <PlusIcon color="#5B7560" />
                  <Text style={styles.sellBtnText}>Sell</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.messageBtn}
                  onPress={handleMessageClick}
                >
                  <MaterialIcons name="message" size={20} color="#5B7560" />
                  <Text style={styles.messageBtnText}>Inbox</Text>
                </TouchableOpacity>
                <View style={styles.profileContainer}>
                  <TouchableOpacity style={styles.profile} onPress={handleProfileClick}>
                    {userProfile?.profile_image_url ? (
                      <View style={styles.profileRingWeb}>
                        <Image
                          source={{ uri: userProfile.profile_image_url }}
                          style={styles.profileImg}
                        />
                      </View>
                    ) : (
                      <View style={[styles.profileImg, styles.profileImgPlaceholder]}>
                        <MaterialIcons name="person" size={20} color="#FFFFFF" />
                      </View>
                    )}
                    <MaterialIcons name="keyboard-arrow-down" size={24} color="#666" />
                  </TouchableOpacity>
                  {showProfileDropdown && (
                    <View style={styles.profileDropdown}>
                      <TouchableOpacity
                        style={styles.profileDropdownItem}
                        onPress={() => {
                          setShowProfileDropdown(false);
                          router.push("/profileDetails");
                        }}
                      >
                        <MaterialIcons name="person" size={20} color="#333" />
                        <Text style={styles.profileDropdownText}>Profile</Text>
                      </TouchableOpacity>

                      {/* Admin option - only visible for admins */}
                      {isAdmin && (
                        <TouchableOpacity
                          style={styles.profileDropdownItem}
                          onPress={() => {
                            setShowProfileDropdown(false);
                            router.push("/admin");
                          }}
                        >
                          <MaterialIcons name="admin-panel-settings" size={20} color="#333" />
                          <Text style={styles.profileDropdownText}>Admin</Text>
                        </TouchableOpacity>
                      )}

                      <TouchableOpacity
                        style={styles.profileDropdownItem}
                        onPress={() => {
                          setShowProfileDropdown(false);
                          handleLogout();
                        }}
                      >
                        <MaterialIcons name="logout" size={20} color="#D32F2F" />
                        <Text style={[styles.profileDropdownText, styles.logoutText]}>Logout</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </>
            ) : (
              // Logged out state
              <TouchableOpacity
                style={[styles.upgradeBtn, styles.loginBtn]}
                onPress={handleLoginClick}
              >
                <Text style={styles.upgradeBtnText}>Login</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Mobile Search Modal */}
      {isMobile && showMobileSearch && (
        <Modal
          visible={showMobileSearch}
          transparent={true}
          animationType="fade"
          onRequestClose={toggleMobileSearch}
        >
          <Animated.View style={[styles.mobileSearchContainer, { opacity: searchFadeAnim }]}>
            <View style={styles.mobileSearchContent}>
              <View style={styles.mobileSearchHeader}>
                <Text style={styles.mobileSearchTitle}>Search</Text>
                <TouchableOpacity onPress={toggleMobileSearch}>
                  <MaterialIcons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.mobileSearchBoxContainer}>
                <View style={styles.searchBoxContainer}>
                  <View style={styles.searchBox}>
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search"
                      placeholderTextColor="#A1A1A1"
                      value={searchText}
                      onChangeText={handleSearchChange}
                      onFocus={handleSearchFocus}
                      onBlur={handleSearchBlur}
                      onSubmitEditing={handleSearchSubmit}
                      returnKeyType="search"
                    />
                    <TouchableOpacity 
                      style={styles.searchButton}
                      onPress={handleSearchSubmit}
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
          </Animated.View>
        </Modal>
      )}

      {/* Mobile Menu Modal */}
      {isMobile && showMobileMenu && (
        <Modal
          visible={showMobileMenu}
          transparent={true}
          animationType="fade"
          onRequestClose={toggleMobileMenu}
        >
          <Animated.View style={[styles.mobileMenuContainer, { opacity: fadeAnim }]}>
            <View style={styles.mobileMenuContent}>
              <View style={styles.mobileMenuHeader}>
                <Text style={styles.mobileMenuTitle}>Menu</Text>
                <TouchableOpacity onPress={toggleMobileMenu}>
                  <MaterialIcons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              
              {/* Mobile Navigation Toggle */}
              <View style={styles.mobileNavigationSection}>
                <TouchableOpacity
                  style={[
                    styles.mobileMenuItem,
                    styles.mobileNavigationItem,
                    currentPage === 'tires' && styles.mobileNavigationItemActive
                  ]}
                  onPress={() => {
                    handleNavigationToggle('tires');
                    toggleMobileMenu();
                  }}
                >
                  <MaterialIcons 
                    name="tire-repair" 
                    size={20} 
                    color={currentPage === 'tires' ? "#3A593F" : "#333"} 
                  />
                  <Text style={[
                    styles.mobileMenuButtonText,
                    currentPage === 'tires' && styles.mobileNavigationTextActive
                  ]}>
                    Find Tires
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.mobileMenuItem,
                    styles.mobileNavigationItem,
                    currentPage === 'shops' && styles.mobileNavigationItemActive
                  ]}
                  onPress={() => {
                    handleNavigationToggle('shops');
                    toggleMobileMenu();
                  }}
                >
                  <MaterialIcons 
                    name="store" 
                    size={20} 
                    color={currentPage === 'shops' ? "#3A593F" : "#333"} 
                  />
                  <Text style={[
                    styles.mobileMenuButtonText,
                    currentPage === 'shops' && styles.mobileNavigationTextActive
                  ]}>
                    Find Shops
                  </Text>
                </TouchableOpacity>
              </View>
              
              {isLoggedInState ? (
                <>
                  {/* Only show upgrade button in mobile menu if user is not a business user */}
                  {!isBusinessUser && (
                    <TouchableOpacity
                      style={styles.mobileMenuItem}
                      onPress={handleUpgradeClick}
                    >
                      <MaterialIcons name="upgrade" size={20} color="#333" />
                      <Text style={styles.mobileMenuButtonText}>Upgrade</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.mobileMenuItem}
                    onPress={handleSellClick}
                  >
                    <MaterialIcons name="add" size={20} color="#333" />
                    <Text style={styles.mobileMenuButtonText}>Sell</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.mobileMenuItem}
                    onPress={handleMessageClick}
                  >
                    <MaterialIcons name="message" size={20} color="#333" />
                    <Text style={styles.mobileMenuButtonText}>Messages</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.mobileMenuItem}
                    onPress={() => {
                      router.push("/profileDetails");
                      setShowMobileMenu(false);
                    }}
                  >
                    <MaterialIcons name="person" size={20} color="#333" />
                    <Text style={styles.mobileMenuButtonText}>Profile</Text>
                  </TouchableOpacity>
                  
                  {/* Admin option in mobile menu - only visible for admins */}
                  {isAdmin && (
                    <TouchableOpacity
                      style={styles.mobileMenuItem}
                      onPress={() => {
                        router.push("/admin");
                        setShowMobileMenu(false);
                      }}
                    >
                      <MaterialIcons name="admin-panel-settings" size={20} color="#333" />
                      <Text style={styles.mobileMenuButtonText}>Admin</Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity
                    style={[styles.mobileMenuItem, styles.mobileMenuLogoutButton]}
                    onPress={handleLogout}
                  >
                    <MaterialIcons name="logout" size={20} color="#D32F2F" />
                    <Text style={[styles.mobileMenuButtonText, styles.mobileMenuLogoutText]}>Logout</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.mobileMenuItem}
                  onPress={handleLoginClick}
                >
                  <Text style={styles.mobileMenuButtonText}>Login</Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </Modal>
      )}

      <PricingModal
        visible={showUpgradePopup}
        onClose={handleUpgradeClose}
        onUpgradeConfirm={handleUpgradeClose}
      />
    </>
  );
};

export default Header;