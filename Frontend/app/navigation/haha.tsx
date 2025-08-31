// import { View, Text, Image, ScrollView, SafeAreaView, TouchableOpacity, Platform, Modal, TextInput } from "react-native";
// import { useRouter } from "expo-router";
// import { homeStyles } from "./styles/home";
// import { useState, useEffect } from "react";
// import PricingModal from './upgrade';
// import { User, X, ShoppingCart, Search, ChevronDown, Plus, Star } from 'lucide-react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { PanGestureHandler } from 'react-native-gesture-handler';

// type FilterCategory = 'condition' | 'quantity' | 'brand' | 'vehicleType' | 'tireType' | 'ratings';

// interface FiltersState {
//     condition: {
//         new: boolean;
//         used: boolean;
//     };
//     quantity: {
//         single: boolean;
//         double: boolean;
//         setOf4: boolean;
//     };
//     brand: {
//         michelin: boolean;
//         goodyear: boolean;
//         bridgestone: boolean;
//         others: boolean;
//     };
//     vehicleType: {
//         passengerCar: boolean;
//         suv: boolean;
//         truck: boolean;
//         motorcycle: boolean;
//         van: boolean;
//         others: boolean;
//     };
//     tireType: {
//         allSeasons: boolean;
//         winters: boolean;
//         summer: boolean;
//         mudTerrain: boolean;
//         allTerrain: boolean;
//         performance: boolean;
//     };
//     ratings: {
//         five: boolean;
//         four: boolean;
//         three: boolean;
//         two: boolean;
//         one: boolean;
//     };
// }

// const HomeScreen = () => {
//     const router = useRouter();
//     const [showUpgrade, setShowUpgrade] = useState(false);
//     const [showAuthModal, setShowAuthModal] = useState(false);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [searchResults, setSearchResults] = useState<string[]>([]);
//     const [cartItems, setCartItems] = useState(2);
//     const [treadDepth, setTreadDepth] = useState(4);
//     const [showSellerDropdown, setShowSellerDropdown] = useState(false);
//     const [sellerType, setSellerType] = useState('Seller type');
//     const [minPrice, setMinPrice] = useState('');
//     const [maxPrice, setMaxPrice] = useState('');
//     const [width, setWidth] = useState('');
//     const [aspectRatio, setAspectRatio] = useState('');
//     const [diameter, setDiameter] = useState('');
//     const [loadIndex, setLoadIndex] = useState('');
//     const [sortBy, setSortBy] = useState('Sort by');
//     const [showSortDropdown, setShowSortDropdown] = useState(false);
//     const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);

//     const [filters, setFilters] = useState<FiltersState>({
//         condition: {
//             new: false,
//             used: false
//         },
//         quantity: {
//             single: false,
//             double: false,
//             setOf4: false
//         },
//         brand: {
//             michelin: false,
//             goodyear: false,
//             bridgestone: false,
//             others: false
//         },
//         vehicleType: {
//             passengerCar: false,
//             suv: false,
//             truck: false,
//             motorcycle: false,
//             van: false,
//             others: false
//         },
//         tireType: {
//             allSeasons: false,
//             winters: false,
//             summer: false,
//             mudTerrain: false,
//             allTerrain: false,
//             performance: false
//         },
//         ratings: {
//             five: false,
//             four: false,
//             three: false,
//             two: false,
//             one: false
//         }
//     });

//     const handleFilterChange = (category: FilterCategory, item: string) => {
//         setFilters(prev => ({
//             ...prev,
//             [category]: {
//                 ...prev[category],
//                 [item]: !prev[category][item as keyof typeof prev[typeof category]]
//             }
//         }));
//     };

//     const handleTreadDepthGesture = (event: any) => {
//         const { translationX } = event.nativeEvent;
//         const newDepth = Math.round((translationX / 200) * 9) + 1;
//         if (newDepth >= 1 && newDepth <= 10) {
//             setTreadDepth(newDepth);
//         }
//     };

//     const handleProfileClick = async () => {
//         try {
//             const userData = await AsyncStorage.getItem('userData');
//             if (userData) {
//                 router.push('/profileDetails');
//             } else {
//                 setShowAuthModal(true);
//             }
//         } catch (error) {
//             console.error('Error checking user data:', error);
//             setShowAuthModal(true);
//         }
//     };

//     const handleProductClick = (productId: number) => {
//         router.push(`/frame?id=${productId}`);
//     };

//     const handleSellerTypeChange = (type: string) => {
//         setSellerType(type);
//         setShowSellerDropdown(false);
//     };

//     const handleSortByChange = (option: string) => {
//         setSortBy(option);
//         setShowSortDropdown(false);
//     };

//     const handleUpgrade = () => {
//         setShowUpgrade(true);
//     };

//     const handleUpgradeNavigation = () => {
//         setShowUpgrade(false);
//         router.push('/newdetails');
//     };

//     const handleAddToCart = (productId: number, event: any) => {
//         event.stopPropagation();
//         setCartItems(prev => prev + 1);
//     };

//     const handleSearch = (query: string) => {
//         setSearchQuery(query);
//         if (query.length > 0) {
//             // Simulate search results
//             const results = ['Product 1', 'Product 2', 'Product 3'].filter((item) =>
//                 item.toLowerCase().includes(query.toLowerCase())
//             );
//             setSearchResults(results);
//         } else {
//             setSearchResults([]);
//         }
//     };

//     const handleHoverIn = (productId: number) => {
//         setHoveredProductId(productId);
//     };

//     const handleHoverOut = () => {
//         setHoveredProductId(null);
//     };

//     const renderStars = (rating: number) => {
//         const stars = [];
//         const fullStars = Math.floor(rating);
//         const hasHalfStar = rating - fullStars >= 0.5;

//         for (let i = 0; i < 5; i++) {
//             if (i < fullStars) {
//                 stars.push(<Star key={i} size={14} color="#FFD700" fill="#FFD700" style={homeStyles.star} />);
//             } else if (i === fullStars && hasHalfStar) {
//                 stars.push(<Star key={i} size={14} color="#FFD700" fill="#FFD700" style={homeStyles.star} />);
//             } else {
//                 stars.push(<Star key={i} size={14} color="#DDDDDD" fill="#DDDDDD" style={homeStyles.star} />);
//             }
//         }

//         return (
//             <View style={homeStyles.starContainer}>
//                 {stars}
//             </View>
//         );
//     };

//     useEffect(() => {
//         const checkAuth = async () => {
//             try {
//                 const userData = await AsyncStorage.getItem('userData');
//             } catch (error) {
//                 console.error('Error checking auth:', error);
//             }
//         };

//         checkAuth();
//     }, []);

//     return (
//         <SafeAreaView style={homeStyles.container}>
//             <View style={homeStyles.header}>
//                 <View style={homeStyles.logoContainer}>
//                     <Text style={homeStyles.logoText}>Logo</Text>
//                 </View>

//                 <View style={homeStyles.sellerTypeWrapper}>
//                     <TouchableOpacity
//                         style={homeStyles.sellerTypeContainer}
//                         onPress={() => setShowSellerDropdown(!showSellerDropdown)}
//                     >
//                         <Text style={homeStyles.sellerTypeText}>{sellerType}</Text>
//                         <ChevronDown size={16} color="#666" />
//                     </TouchableOpacity>
//                     {showSellerDropdown && (
//                         <View style={homeStyles.sellerDropdownMenu}>
//                             <TouchableOpacity
//                                 style={homeStyles.sellerDropdownItem}
//                                 onPress={() => handleSellerTypeChange('Individual')}
//                             >
//                                 <Text>Individual</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity
//                                 style={homeStyles.sellerDropdownItem}
//                                 onPress={() => handleSellerTypeChange('Business')}
//                             >
//                                 <Text>Business</Text>
//                             </TouchableOpacity>
//                         </View>
//                     )}
//                 </View>

//                 <View style={homeStyles.searchContainer}>
//                     <TextInput
//                         style={homeStyles.searchInput}
//                         placeholder="Search"
//                         value={searchQuery}
//                         onChangeText={handleSearch}
//                     />
//                     <TouchableOpacity style={homeStyles.searchButton}>
//                         <Search size={18} color="#ffffff" />
//                     </TouchableOpacity>
//                     {searchResults.length > 0 && (
//                         <View style={homeStyles.searchDropdown}>
//                             {searchResults.map((result, index) => (
//                                 <TouchableOpacity
//                                     key={index}
//                                     style={homeStyles.searchDropdownItem}
//                                     onPress={() => setSearchQuery(result)}
//                                 >
//                                     <Text>{result}</Text>
//                                 </TouchableOpacity>
//                             ))}
//                         </View>
//                     )}
//                 </View>

//                 <View style={homeStyles.headerButtons}>
//                     <TouchableOpacity
//                         style={homeStyles.upgradeButton}
//                         onPress={handleUpgrade}
//                     >
//                         <Text style={homeStyles.upgradeButtonText}>Upgrade</Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                         style={homeStyles.sellButton}
//                         onPress={() => router.push('/sell')}
//                     >
//                         <Plus size={14} color="#2D4B3A" />
//                         <Text style={homeStyles.sellButtonText}>Sell</Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity style={homeStyles.cartButton}>
//                         <ShoppingCart size={22} color="#2D4B3A" />
//                         {cartItems > 0 && (
//                             <View style={homeStyles.cartBadge}>
//                                 <Text style={homeStyles.cartBadgeText}>{cartItems}</Text>
//                             </View>
//                         )}
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                         style={homeStyles.profileButton}
//                         onPress={handleProfileClick}
//                     >
//                         <View style={homeStyles.profileCircle}>
//                             <User size={22} color="#666666" />
//                         </View>
//                     </TouchableOpacity>
//                 </View>
//             </View>

//             <ScrollView style={homeStyles.mainContent}>
//                 <View style={homeStyles.contentWrapper}>
//                     <View style={homeStyles.filterSection}>
//                         {/* Condition Filter */}
//                         <View style={homeStyles.filterCategory}>
//                             <Text style={homeStyles.filterCategoryTitle}>Condition</Text>
//                             <View style={homeStyles.filterItem}>
//                                 <TouchableOpacity
//                                     style={homeStyles.checkbox}
//                                     onPress={() => handleFilterChange('condition', 'new')}
//                                 >
//                                     {filters.condition.new && (
//                                         <View style={homeStyles.checkedBox} />
//                                     )}
//                                 </TouchableOpacity>
//                                 <Text style={homeStyles.filterItemText}>New</Text>
//                             </View>
//                             <View style={homeStyles.filterItem}>
//                                 <TouchableOpacity
//                                     style={homeStyles.checkbox}
//                                     onPress={() => handleFilterChange('condition', 'used')}
//                                 >
//                                     {filters.condition.used && (
//                                         <View style={homeStyles.checkedBox} />
//                                     )}
//                                 </TouchableOpacity>
//                                 <Text style={homeStyles.filterItemText}>Used</Text>
//                             </View>
//                         </View>

//                         {/* Quantity Filter */}
//                         <View style={homeStyles.filterCategory}>
//                             <Text style={homeStyles.filterCategoryTitle}>Quantity</Text>
//                             <View style={homeStyles.filterItem}>
//                                 <TouchableOpacity
//                                     style={homeStyles.checkbox}
//                                     onPress={() => handleFilterChange('quantity', 'single')}
//                                 >
//                                     {filters.quantity.single && (
//                                         <View style={homeStyles.checkedBox} />
//                                     )}
//                                 </TouchableOpacity>
//                                 <Text style={homeStyles.filterItemText}>Single</Text>
//                             </View>
//                             <View style={homeStyles.filterItem}>
//                                 <TouchableOpacity
//                                     style={homeStyles.checkbox}
//                                     onPress={() => handleFilterChange('quantity', 'double')}
//                                 >
//                                     {filters.quantity.double && (
//                                         <View style={homeStyles.checkedBox} />
//                                     )}
//                                 </TouchableOpacity>
//                                 <Text style={homeStyles.filterItemText}>Double</Text>
//                             </View>
//                             <View style={homeStyles.filterItem}>
//                                 <TouchableOpacity
//                                     style={homeStyles.checkbox}
//                                     onPress={() => handleFilterChange('quantity', 'setOf4')}
//                                 >
//                                     {filters.quantity.setOf4 && (
//                                         <View style={homeStyles.checkedBox} />
//                                     )}
//                                 </TouchableOpacity>
//                                 <Text style={homeStyles.filterItemText}>Set of 4</Text>
//                             </View>
//                         </View>

//                         {/* Brand Filter */}
//                         <View style={homeStyles.filterCategory}>
//                             <Text style={homeStyles.filterCategoryTitle}>Brand</Text>
//                             <View style={homeStyles.filterItem}>
//                                 <TouchableOpacity
//                                     style={homeStyles.checkbox}
//                                     onPress={() => handleFilterChange('brand', 'michelin')}
//                                 >
//                                     {filters.brand.michelin && (
//                                         <View style={homeStyles.checkedBox} />
//                                     )}
//                                 </TouchableOpacity>
//                                 <Text style={homeStyles.filterItemText}>Michelin</Text>
//                             </View>
//                             <View style={homeStyles.filterItem}>
//                                 <TouchableOpacity
//                                     style={homeStyles.checkbox}
//                                     onPress={() => handleFilterChange('brand', 'goodyear')}
//                                 >
//                                     {filters.brand.goodyear && (
//                                         <View style={homeStyles.checkedBox} />
//                                     )}
//                                 </TouchableOpacity>
//                                 <Text style={homeStyles.filterItemText}>Goodyear</Text>
//                             </View>
//                             <View style={homeStyles.filterItem}>
//                                 <TouchableOpacity
//                                     style={homeStyles.checkbox}
//                                     onPress={() => handleFilterChange('brand', 'bridgestone')}
//                                 >
//                                     {filters.brand.bridgestone && (
//                                         <View style={homeStyles.checkedBox} />
//                                     )}
//                                 </TouchableOpacity>
//                                 <Text style={homeStyles.filterItemText}>Bridgestone</Text>
//                             </View>
//                             <View style={homeStyles.filterItem}>
//                                 <TouchableOpacity
//                                     style={homeStyles.checkbox}
//                                     onPress={() => handleFilterChange('brand', 'others')}
//                                 >
//                                     {filters.brand.others && (
//                                         <View style={homeStyles.checkedBox} />
//                                     )}
//                                 </TouchableOpacity>
//                                 <Text style={homeStyles.filterItemText}>Others</Text>
//                             </View>
//                         </View>

//                         {/* Price Range */}
//                         <View style={homeStyles.filterCategory}>
//                             <Text style={homeStyles.filterCategoryTitle}>Price Range</Text>
//                             <View style={homeStyles.priceRangeContainer}>
//                                 <TextInput
//                                     style={homeStyles.priceInput}
//                                     placeholder="Min"
//                                     value={minPrice}
//                                     onChangeText={setMinPrice}
//                                     keyboardType="numeric"
//                                 />
//                                 <Text style={homeStyles.priceRangeDash}>-</Text>
//                                 <TextInput
//                                     style={homeStyles.priceInput}
//                                     placeholder="Max"
//                                     value={maxPrice}
//                                     onChangeText={setMaxPrice}
//                                     keyboardType="numeric"
//                                 />
//                             </View>
//                         </View>

//                         {/* Tire Size */}
//                         <View style={homeStyles.filterCategory}>
//                             <Text style={homeStyles.filterCategoryTitle}>Tire Size</Text>
//                             <TextInput
//                                 style={homeStyles.tireSizeInput}
//                                 placeholder="Width"
//                                 value={width}
//                                 onChangeText={setWidth}
//                             />
//                             <TextInput
//                                 style={homeStyles.tireSizeInput}
//                                 placeholder="Aspect Ratio"
//                                 value={aspectRatio}
//                                 onChangeText={setAspectRatio}
//                             />
//                             <TextInput
//                                 style={homeStyles.tireSizeInput}
//                                 placeholder="Diameter"
//                                 value={diameter}
//                                 onChangeText={setDiameter}
//                             />
//                             <TextInput
//                                 style={homeStyles.tireSizeInput}
//                                 placeholder="Load Index"
//                                 value={loadIndex}
//                                 onChangeText={setLoadIndex}
//                             />
//                         </View>

//                         {/* Tread Depth Slider */}
//                         <View style={homeStyles.filterCategory}>
//                             <Text style={homeStyles.filterCategoryTitle}>Tread Depth</Text>
//                             <View style={homeStyles.treadDepthContainer}>
//                                 <View style={homeStyles.treadDepthTrack}>
//                                     <PanGestureHandler onGestureEvent={handleTreadDepthGesture}>
//                                         <View
//                                             style={[
//                                                 homeStyles.treadDepthThumb,
//                                                 { left: `${(treadDepth - 1) / 9 * 100}%` }
//                                             ]}
//                                         />
//                                     </PanGestureHandler>
//                                     <View
//                                         style={[
//                                             homeStyles.treadDepthProgress,
//                                             { width: `${(treadDepth - 1) / 9 * 100}%` }
//                                         ]}
//                                     />
//                                 </View>
//                                 <View style={homeStyles.treadDepthLabels}>
//                                     <Text style={homeStyles.treadDepthLabel}>1mm</Text>
//                                     <Text style={homeStyles.treadDepthValue}>{treadDepth}mm</Text>
//                                     <Text style={homeStyles.treadDepthLabel}>10mm</Text>
//                                 </View>
//                             </View>
//                         </View>

//                         {/* Vehicle Type Filter */}
//                         <View style={homeStyles.filterCategory}>
//                             <Text style={homeStyles.filterCategoryTitle}>Vehicle Type</Text>
//                             {Object.keys(filters.vehicleType).map((item) => (
//                                 <View key={item} style={homeStyles.filterItem}>
//                                     <TouchableOpacity
//                                         style={homeStyles.checkbox}
//                                         onPress={() => handleFilterChange('vehicleType', item)}
//                                     >
//                                         {filters.vehicleType[item as keyof typeof filters.vehicleType] && (
//                                             <View style={[homeStyles.checkedBox, { backgroundColor: "#666666" }]} />
//                                         )}
//                                     </TouchableOpacity>
//                                     <Text style={homeStyles.filterItemText}>{item}</Text>
//                                 </View>
//                             ))}
//                         </View>

//                         {/* Tire Type Filter */}
//                         <View style={homeStyles.filterCategory}>
//                             <Text style={homeStyles.filterCategoryTitle}>Tire Type</Text>
//                             {Object.keys(filters.tireType).map((item) => (
//                                 <View key={item} style={homeStyles.filterItem}>
//                                     <TouchableOpacity
//                                         style={homeStyles.checkbox}
//                                         onPress={() => handleFilterChange('tireType', item)}
//                                     >
//                                         {filters.tireType[item as keyof typeof filters.tireType] && (
//                                             <View style={[homeStyles.checkedBox, { backgroundColor: "#666666" }]} />
//                                         )}
//                                     </TouchableOpacity>
//                                     <Text style={homeStyles.filterItemText}>{item}</Text>
//                                 </View>
//                             ))}
//                         </View>

//                         {/* Ratings Filter */}
//                         <View style={homeStyles.filterCategory}>
//                             <Text style={homeStyles.filterCategoryTitle}>Ratings</Text>
//                             <View style={homeStyles.filterItem}>
//                                 <TouchableOpacity
//                                     style={homeStyles.checkbox}
//                                     onPress={() => handleFilterChange('ratings', 'five')}
//                                 >
//                                     {filters.ratings.five && (
//                                         <View style={[homeStyles.checkedBox, { backgroundColor: "#666666" }]} />
//                                     )}
//                                 </TouchableOpacity>
//                                 <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                                     {Array(5).fill(0).map((_, i) => (
//                                         <Star key={i} size={14} color="#FFD700" fill="#FFD700" style={homeStyles.star} />
//                                     ))}
//                                 </View>
//                             </View>
//                             <View style={homeStyles.filterItem}>
//                                 <TouchableOpacity
//                                     style={homeStyles.checkbox}
//                                     onPress={() => handleFilterChange('ratings', 'four')}
//                                 >
//                                     {filters.ratings.four && (
//                                         <View style={[homeStyles.checkedBox, { backgroundColor: "#666666" }]} />
//                                     )}
//                                 </TouchableOpacity>
//                                 <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                                     {Array(4).fill(0).map((_, i) => (
//                                         <Star key={i} size={14} color="#FFD700" fill="#FFD700" style={homeStyles.star} />
//                                     ))}
//                                 </View>
//                             </View>
//                             <View style={homeStyles.filterItem}>
//                                 <TouchableOpacity
//                                     style={homeStyles.checkbox}
//                                     onPress={() => handleFilterChange('ratings', 'three')}
//                                 >
//                                     {filters.ratings.three && (
//                                         <View style={[homeStyles.checkedBox, { backgroundColor: "#666666" }]} />
//                                     )}
//                                 </TouchableOpacity>
//                                 <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                                     {Array(3).fill(0).map((_, i) => (
//                                         <Star key={i} size={14} color="#FFD700" fill="#FFD700" style={homeStyles.star} />
//                                     ))}
//                                 </View>
//                             </View>
//                             <View style={homeStyles.filterItem}>
//                                 <TouchableOpacity
//                                     style={homeStyles.checkbox}
//                                     onPress={() => handleFilterChange('ratings', 'two')}
//                                 >
//                                     {filters.ratings.two && (
//                                         <View style={[homeStyles.checkedBox, { backgroundColor: "#666666" }]} />
//                                     )}
//                                 </TouchableOpacity>
//                                 <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                                     {Array(2).fill(0).map((_, i) => (
//                                         <Star key={i} size={14} color="#FFD700" fill="#FFD700" style={homeStyles.star} />
//                                     ))}
//                                 </View>
//                             </View>
//                             <View style={homeStyles.filterItem}>
//                                 <TouchableOpacity
//                                     style={homeStyles.checkbox}
//                                     onPress={() => handleFilterChange('ratings', 'one')}
//                                 >
//                                     {filters.ratings.one && (
//                                         <View style={[homeStyles.checkedBox, { backgroundColor: "#666666" }]} />
//                                     )}
//                                 </TouchableOpacity>
//                                 <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                                     {Array(1).fill(0).map((_, i) => (
//                                         <Star key={i} size={14} color="#FFD700" fill="#FFD700" style={homeStyles.star} />
//                                     ))}
//                                 </View>
//                             </View>
//                         </View>
//                     </View>

//                     {/* Product Grid with Sort By dropdown */}
//                     <View style={homeStyles.productImageContainer}>
//                         {/* Sort By Dropdown */}
//                         <View style={homeStyles.sortByContainer}>
//                             <TouchableOpacity
//                                 style={homeStyles.sortByButton}
//                                 onPress={() => setShowSortDropdown(!showSortDropdown)}
//                             >
//                                 <Text style={homeStyles.sortByText}>{sortBy}</Text>
//                                 <ChevronDown size={16} color="#666" />
//                             </TouchableOpacity>
//                             {showSortDropdown && (
//                                 <View style={homeStyles.sortDropdownMenu}>
//                                     <TouchableOpacity
//                                         style={homeStyles.sellerDropdownItem}
//                                         onPress={() => handleSortByChange('Price: Low to High')}
//                                     >
//                                         <Text>Price: Low to High</Text>
//                                     </TouchableOpacity>
//                                     <TouchableOpacity
//                                         style={homeStyles.sellerDropdownItem}
//                                         onPress={() => handleSortByChange('Price: High to Low')}
//                                     >
//                                         <Text>Price: High to Low</Text>
//                                     </TouchableOpacity>
//                                     <TouchableOpacity
//                                         style={homeStyles.sellerDropdownItem}
//                                         onPress={() => handleSortByChange('Newest First')}
//                                     >
//                                         <Text>Newest First</Text>
//                                     </TouchableOpacity>
//                                     <TouchableOpacity
//                                         style={homeStyles.sellerDropdownItem}
//                                         onPress={() => handleSortByChange('Best Rating')}
//                                     >
//                                         <Text>Best Rating</Text>
//                                     </TouchableOpacity>
//                                 </View>
//                             )}
//                         </View>

//                         {/* Product Grid */}
//                         <View style={homeStyles.productGrid}>
//                             {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
//                                 <TouchableOpacity
//                                     key={item}
//                                     style={[
//                                         homeStyles.productCard,
//                                         hoveredProductId === item && homeStyles.productCardHovered, // Apply hover effect
//                                     ]}
//                                     onPressIn={() => handleHoverIn(item)} // Handle hover in
//                                     onPressOut={handleHoverOut} // Handle hover out
//                                     onPress={() => handleProductClick(item)}
//                                 >
//                                     <View style={homeStyles.productImageContainer}>
//                                         <View style={homeStyles.productImage} />
//                                     </View>
//                                     <View style={homeStyles.productInfo}>
//                                         <Text style={homeStyles.productTitle}>CORE RACING JIVE</Text>
//                                         <Text style={homeStyles.productPrice}>$230.98</Text>
//                                         <View style={homeStyles.ratingContainer}>
//                                             <Text style={homeStyles.ratingText}>4.8</Text>
//                                             <Text style={homeStyles.reviewCount}>(127 reviews)</Text>
//                                         </View>
//                                         <Text style={homeStyles.productSpec}>Bolt Patterns: 5×108, 5×114.3</Text>
//                                         <Text style={homeStyles.productSpec}>Finish: Titanium</Text>
//                                         <Text style={homeStyles.productSpec}>18" x 8.00" | Offset: +40</Text>
//                                         <TouchableOpacity
//                                             style={homeStyles.addToCartButton}
//                                             onPress={(e) => handleAddToCart(item, e)}
//                                         >
//                                             <Text style={homeStyles.addToCartButtonText}>Add to Cart</Text>
//                                         </TouchableOpacity>
//                                     </View>
//                                 </TouchableOpacity>
//                             ))}
//                         </View>
//                     </View>
//                 </View>
//             </ScrollView>

//             {/* Upgrade Modal */}
//             <PricingModal
//                 visible={showUpgrade}
//                 onClose={() => setShowUpgrade(false)}
//                 onUpgradeConfirm={handleUpgradeNavigation}
//             />

//             {/* Auth Modal */}
//             <Modal
//                 visible={showAuthModal}
//                 transparent={true}
//                 animationType="fade"
//                 onRequestClose={() => setShowAuthModal(false)}
//             >
//                 <View style={homeStyles.modalOverlay}>
//                     <View style={homeStyles.modalContent}>
//                         <View style={homeStyles.modalHeader}>
//                             <TouchableOpacity
//                                 style={homeStyles.closeButton}
//                                 onPress={() => setShowAuthModal(false)}
//                             >
//                                 <X size={24} color="#000000" />
//                             </TouchableOpacity>
//                         </View>
//                         <Text style={homeStyles.modalTitle}>Authentication Required</Text>
//                         <Text style={homeStyles.modalText}>Please login or signup to view profile</Text>
//                         <View style={homeStyles.modalButtons}>
//                             <TouchableOpacity
//                                 style={[homeStyles.modalButton, homeStyles.loginButton]}
//                                 onPress={() => {
//                                     setShowAuthModal(false);
//                                     router.push('/login');
//                                 }}
//                             >
//                                 <Text style={homeStyles.modalButtonText}>Login</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity
//                                 style={[homeStyles.modalButton, homeStyles.signupButton]}
//                                 onPress={() => {
//                                     setShowAuthModal(false);
//                                     router.push('/signup');
//                                 }}
//                             >
//                                 <Text style={homeStyles.modalButtonText}>Sign Up</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </View>
//             </Modal>
//         </SafeAreaView>
//     );
// };

// export default HomeScreen;