import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
  Text,
  TouchableOpacity,
  Modal,
} from "react-native";
import Header from "../header/Header";
import ImageUploadSection from "./ImageUploadSection";
import BasicInfoSection from "./BasicInfoSection";
import SpecificationsSection from "./SpecificationsSection";
import ActionButtons from "./ActionButtons";
import { colors, spacing } from "./styles";
import { createListing } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import SuccessPopup from "../components/SuccessPopup";

const ProductListingForm: React.FC = () => {
  // Form state
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  // Specifications state
  const [brand, setBrand] = useState<string>("");
  const [model, setModel] = useState("");
  const [tireType, setTireType] = useState<string[]>([]);
  const [width, setWidth] = useState("");
  const [aspectRatio, setAspectRatio] = useState("");
  const [diameter, setDiameter] = useState("");
  const [loadIndex, setLoadIndex] = useState("");
  const [speedRating, setSpeedRating] = useState("");
  const [condition, setCondition] = useState("new");
  const [treadDepth, setTreadDepth] = useState("8");
  const [quantity, setQuantity] = useState("1");
  const [mileage, setMileage] = useState("");
  const [mileageUnit, setMileageUnit] = useState("mi");
  const [vehicleType, setVehicleType] = useState("passenger");

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Add new state for success popup
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Add new state for upgrade modal
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [isBusinessUser, setIsBusinessUser] = useState(false);

  const router = useRouter();

  // Fetch user type on component mount
  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) return;

        const response = await fetch('http://127.0.0.1:8000/api/profile/listings-info/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          // If listings_limit is null, it means the user is a business user
          setIsBusinessUser(data.listings_limit === null);
        }
      } catch (error) {
        console.error('Error fetching user type:', error);
      }
    };

    fetchUserType();
  }, []);

  // Handle image upload
  const handleAddImage = (uri: string) => {
    if (images.length < 12) {
      setImages([...images, uri]);
      // Clear any image-related error
      if (errors.images) {
        const newErrors = { ...errors };
        delete newErrors.images;
        setErrors(newErrors);
      }
    } else {
      Alert.alert("Maximum Images", "You can only upload up to 12 images.");
    }
  };

  // Handle image removal
  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  // Update brand selection handler to set a single brand
  const handleBrandChange = (brands: string[]) => {
    // If brands array has items, set the first one as the selected brand
    // Otherwise, set empty string
    setBrand(brands.length > 0 ? brands[0] : "");
  };

  // Handle form submission
  const handlePublish = async () => {
    console.log("Starting form submission...");
    console.log("Current form values:", {
      title,
      price,
      description,
      condition,
      tireType,
      width,
      aspectRatio,
      diameter,
      loadIndex,
      speedRating,
      treadDepth,
      brand,
      model,
      quantity,
      mileage,
      mileageUnit,
      vehicleType
    });

    if (!validateForm()) {
      console.log("Form validation failed.");
      console.log("Errors:", errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('accessToken');
      console.log('Token retrieved:', token ? 'Yes' : 'No');

      if (!token) {
        Alert.alert('Error', 'Please log in to create a listing');
        setIsSubmitting(false);
        return;
      }

      // Check if user is normal and already has 5 listings
      if (isBusinessUser) {
        // Fetch the user's current listing count from the backend
        try {
          const response = await fetch('http://127.0.0.1:8000/api/profile/listings-info/', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            const data = await response.json();
            if (data.listings_limit && data.total_listings >= data.listings_limit) {
              setShowLimitModal(true);
              setIsSubmitting(false);
              return;
            }
          }
        } catch (err) {
          // fallback: allow publish if API fails
        }
      }

      // For tire_type, use the first selected value or a default
      const primaryTireType = tireType.length > 0 ? tireType[0] : 'all_season';

      // Format price to ensure it has exactly 2 decimal places
      const formattedPrice = Number(parseFloat(price).toFixed(2));
      if (isNaN(formattedPrice) || formattedPrice <= 0) {
        Alert.alert('Error', 'Please enter a valid price');
        setIsSubmitting(false);
        return;
      }

      // Validate numeric fields
      const numericWidth = parseInt(width);
      const numericAspectRatio = parseInt(aspectRatio);
      const numericDiameter = parseInt(diameter);
      const numericLoadIndex = parseInt(loadIndex);
      const numericQuantity = parseInt(quantity);
      const numericTreadDepth = parseFloat(treadDepth);

      // Validate required numeric fields
      if (isNaN(numericWidth) || isNaN(numericAspectRatio) || isNaN(numericDiameter) ||
        isNaN(numericLoadIndex) || isNaN(numericQuantity) || isNaN(numericTreadDepth)) {
        Alert.alert('Error', 'Please ensure all numeric fields are valid numbers');
        setIsSubmitting(false);
        return;
      }

      const listingData = {
        title: title.trim(),
        price: formattedPrice,
        description: description.trim(),
        condition: condition.toLowerCase() as 'new' | 'used',
        tire_type: primaryTireType as 'all_season' | 'summer' | 'winter' | 'performance' | 'mud_terrain' | 'all_terrain' | 'highway' | 'commercial' | 'racing',
        vehicle_type: vehicleType as 'passenger' | 'suv' | 'truck' | 'motorcycle' | 'van' | 'bus' | 'trailer' | 'atv' | 'utv' | 'tractor' | 'construction' | 'industrial' | 'others',
        width: numericWidth,
        aspect_ratio: numericAspectRatio,
        diameter: numericDiameter,
        load_index: numericLoadIndex,
        speed_rating: speedRating.trim(),
        tread_depth: numericTreadDepth,
        brand: brand.trim(),
        model: model.trim() || undefined,
        quantity: numericQuantity,
        mileage: mileage ? parseInt(mileage) : undefined
      };

      console.log("Sending listing data:", listingData);

      try {
        const response = await createListing(token, listingData, images);
        console.log("Listing created successfully:", response);

        // Show success popup
        setShowSuccessPopup(true);

        // Reset form
        setImages([]);
        setTitle('');
        setPrice('');
        setDescription('');
        setBrand("");
        setModel('');
        setTireType([]);
        setWidth('');
        setAspectRatio('');
        setDiameter('');
        setLoadIndex('');
        setSpeedRating('');
        setCondition('new');
        setTreadDepth('8');
        setQuantity('1');
        setMileage('');
        setMileageUnit('mi');
        setVehicleType('passenger');

        // Navigate to home page after delay
        setTimeout(() => {
          setShowSuccessPopup(false);
          router.replace("/home");
        }, 2000);
      } catch (error: any) {
        console.error('Error creating listing:', error);
        let errorMessage = 'Failed to create listing. ';

        if (error instanceof Error) {
          errorMessage = error.message;

          // Check for listing limit error
          if (errorMessage.includes('maximum limit') && errorMessage.includes('Upgrade to a business account')) {
            Alert.alert(
              "Listing Limit Reached",
              errorMessage,
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Upgrade Account",
                  style: "default",
                  onPress: () => {
                    // Navigate to upgrade page
                    router.push("/");
                  }
                }
              ]
            );
            return;
          }
        }

        Alert.alert("Error", errorMessage);
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      Alert.alert("Error", "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form cancellation
  const handleCancel = () => {
    // In a real app, this would navigate back or clear the form
    Alert.alert(
      "Cancel Listing",
      "Are you sure you want to cancel? All entered information will be lost.",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => console.log("Form cancelled")
        }
      ]
    );
  };

  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Validate required fields
    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(price))) {
      newErrors.price = "Price must be a number";
    } else if (Number(price) < 0.01) {
      newErrors.price = "Price must be at least 0.01";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!brand) {
      newErrors.brand = "Select a brand";
    }

    if (!tireType || tireType.length === 0) {
      newErrors.tireType = "Select at least one tire type";
    }

    // Validate tire size components
    if (!width) {
      newErrors.width = "Width is required";
    }

    if (!aspectRatio) {
      newErrors.aspectRatio = "Aspect ratio is required";
    }

    if (!diameter) {
      newErrors.diameter = "Diameter is required";
    }

    // if (!loadIndex) {
    //   newErrors.loadIndex = "Load index is required";
    // }

    // if (!speedRating) {
    //   newErrors.speedRating = "Speed rating is required";
    // }

    if (!treadDepth) {
      newErrors.treadDepth = "Tread depth is required";
    } else if (isNaN(Number(treadDepth))) {
      newErrors.treadDepth = "Tread depth must be a number";
    } else if (Number(treadDepth) < 1 || Number(treadDepth) > 10) {
      newErrors.treadDepth = "Tread depth must be between 1mm and 10mm";
    }

    if (!quantity) {
      newErrors.quantity = "Quantity is required";
    } else if (isNaN(Number(quantity))) {
      newErrors.quantity = "Quantity must be a number";
    }

    if (mileage && isNaN(Number(mileage))) {
      newErrors.mileage = "Mileage must be a number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <Header
          onSearch={() => { }}
          onProfilePress={() => { }}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            {/* Banner for normal users */}
            {!isBusinessUser && (
              <View style={{
                backgroundColor: '#FFF8E1',
                borderColor: '#F5E6B8',
                borderWidth: 1,
                borderRadius: 12,
                padding: 16,
                marginBottom: 24,
                marginTop: 0,
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.04,
                shadowRadius: 2,
                elevation: 1,
              }}>
                <Text style={{ color: '#7C5E10', fontSize: 15, fontWeight: '500', textAlign: 'center' }}>
                  You are allowed a maximum of 5 listings. To add more, please{' '}
                  <Text
                    style={{ color: '#3A593F', textDecorationLine: 'underline', fontWeight: '600' }}
                    onPress={handleUpgradeClick}
                  >
                    upgrade
                  </Text>
                  .
                </Text>
              </View>
            )}

            <BasicInfoSection
              title={title}
              onTitleChange={setTitle}
              price={price}
              onPriceChange={setPrice}
              description={description}
              onDescriptionChange={setDescription}
              errors={{
                title: errors.title,
                price: errors.price,
                description: errors.description,
              }}
            />

            <SpecificationsSection
              brand={brand ? [brand] : []}
              onBrandChange={handleBrandChange}
              model={model}
              onModelChange={setModel}
              tireType={tireType}
              onTireTypeChange={setTireType}
              width={width}
              onWidthChange={setWidth}
              aspectRatio={aspectRatio}
              onAspectRatioChange={setAspectRatio}
              diameter={diameter}
              onDiameterChange={setDiameter}
              loadIndex={loadIndex}
              onLoadIndexChange={setLoadIndex}
              speedRating={speedRating}
              onSpeedRatingChange={setSpeedRating}
              condition={condition}
              onConditionChange={setCondition}
              treadDepth={treadDepth}
              onTreadDepthChange={(value) => {
                setTreadDepth(value.toString());
              }}
              quantity={quantity}
              onQuantityChange={setQuantity}
              mileage={mileage}
              onMileageChange={setMileage}
              mileageUnit={mileageUnit}
              onMileageUnitChange={setMileageUnit}
              vehicleType={vehicleType}
              onVehicleTypeChange={setVehicleType}
              errors={errors}
            />

            <ImageUploadSection
              images={images}
              onAddImage={handleAddImage}
              onRemoveImage={handleRemoveImage}
              error={errors.images}
            />

            <View style={styles.actionsContainer}>
              <ActionButtons
                onCancel={handleCancel}
                onPublish={handlePublish}
                isSubmitting={isSubmitting}
              />
            </View>
          </View>
        </ScrollView>

        {/* Add Success Popup */}
        <SuccessPopup visible={showSuccessPopup} message="Ad added successfully" />
        {/* Upgrade modal (pseudo-code, replace with your actual modal) */}
        {showUpgradeModal && (
          <View style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.3)", zIndex: 1000, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: "#fff", padding: 32, borderRadius: 12, maxWidth: 400, width: '90%', boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }}>
              <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 12 }}>Upgrade Your Account</Text>
              <Text style={{ fontSize: 15, marginBottom: 20 }}>Upgrade to a business account to add unlimited listings and unlock more features.</Text>
              <TouchableOpacity onPress={() => setShowUpgradeModal(false)} style={{ marginTop: 8, paddingVertical: 10, borderRadius: 6, backgroundColor: "#3A593F", alignItems: 'center' }}>
                <Text style={{ color: "#fff", fontWeight: '600', fontSize: 16 }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {/* Listing limit modal */}
        <Modal
          visible={showLimitModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowLimitModal(false)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#fff', padding: 32, borderRadius: 12, maxWidth: 400, width: '90%', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 4 }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#B91C1C', marginBottom: 12, textAlign: 'center' }}>Listing Limit Reached</Text>
              <Text style={{ fontSize: 15, marginBottom: 20, color: '#222', textAlign: 'center' }}>
                You have reached the maximum of 5 listings allowed for your account. Upgrade to a business account to add unlimited listings and unlock more features.
              </Text>
              <TouchableOpacity onPress={() => { setShowLimitModal(false); setShowUpgradeModal(true); }} style={{ marginTop: 8, paddingVertical: 10, borderRadius: 6, backgroundColor: "#3A593F", alignItems: 'center', width: '100%' }}>
                <Text style={{ color: "#fff", fontWeight: '600', fontSize: 16 }}>Upgrade Now</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowLimitModal(false)} style={{ marginTop: 8, paddingVertical: 10, borderRadius: 6, backgroundColor: "#E5E7EB", alignItems: 'center', width: '100%' }}>
                <Text style={{ color: "#222", fontWeight: '500', fontSize: 15 }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 50,
  },
  formContainer: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 1192,
    marginTop: 10,
    paddingHorizontal: 5,
  },
  actionsContainer: {
    alignItems: "flex-end",
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },
});

export default ProductListingForm;