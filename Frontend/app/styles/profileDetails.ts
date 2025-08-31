import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';

interface Styles {
  safeArea: ViewStyle;
  container: ViewStyle;
  header: ViewStyle;
  logoContainer: ViewStyle;
  headerProfileContainer: ViewStyle;
  profileName: TextStyle;
  contactDetails: ViewStyle;
  contactItem: ViewStyle;
  contactText: TextStyle;
  servicesSection: ViewStyle;
  servicesList: ViewStyle;
  serviceTag: ViewStyle;
  serviceText: TextStyle;
  publishedAdsSection: ViewStyle;
  publishedAdsHeader: ViewStyle;
  publishedAdsTitle: TextStyle;
  adsCount: TextStyle;
  adsGrid: ViewStyle;
  adCard: ViewStyle;
  adImageContainer: ViewStyle;
  adImage: ImageStyle;
  placeholderIcon: ImageStyle;
  placeholder: ImageStyle;
  featuredBadge: ViewStyle;
  featuredText: TextStyle;
  adDetails: ViewStyle;
  adTitle: TextStyle;
  adPrice: TextStyle;
  ratingContainer: ViewStyle;
  rating: TextStyle;
  addToCartButton: ViewStyle;
  addToCartText: TextStyle;
  profileSection: ViewStyle;
  profileSectionHorizontal: ViewStyle;
  avatarContainer: ViewStyle;
  largeAvatarImage: ImageStyle;
  avatarImage: ImageStyle;
  profileInfo: ViewStyle;
  profileType: TextStyle;
  editButton: ViewStyle;
  editButtonText: TextStyle;
  contentContainer: ViewStyle;
  leftSection: ViewStyle;
  detailsSection: ViewStyle;
  sectionTitle: TextStyle;
  contactValue: TextStyle;
  rightSection: ViewStyle;
  businessHoursSection: ViewStyle;
  emptyText: TextStyle;
  modalOverlay: ViewStyle;
  modalContent: ViewStyle;
  modalHeader: ViewStyle;
  closeButton: ViewStyle;
  editFormContainer: ViewStyle;
  editImageSection: ViewStyle;
  editAvatarContainer: ViewStyle;
  editAvatar: ImageStyle;
  changeLink: TextStyle;
  editFormSection: ViewStyle;
  editField: ViewStyle;
  fieldLabel: TextStyle;
  fieldValue: TextStyle;
  editInputContainer: ViewStyle;
  editInputText: TextStyle;
  saveButton: ViewStyle;
  saveButtonText: TextStyle;
  editFieldForm: ViewStyle;
  ratingWrapper: ViewStyle;
  ratingText: TextStyle;
  buttonText: TextStyle;
  separator: ViewStyle;
  verticalSeparator: ViewStyle;
  verticalSeparatorModal: ViewStyle;
  editLayoutContainer: ViewStyle;
  smallSaveButton: ViewStyle;
  saveChangesButton: ViewStyle;
  saveChangesButtonText: TextStyle;
  card: ViewStyle;
  imageContainer: ViewStyle;
  details: ViewStyle;

  title: TextStyle;
  priceTag: ViewStyle;
  price: TextStyle;
  ratingScore: TextStyle;
  addButton: ViewStyle;
  addButtonText: TextStyle;
}

export const profileDetailsStyles = StyleSheet.create<Styles>({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerProfileContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#E5E5E5',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  contactDetails: {
    marginBottom: 24,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 16,
    color: '#666666',
    marginLeft: 12,
  },
  servicesSection: {
    marginBottom: 24,
    marginTop: 8,
  },
  servicesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceTag: {
    backgroundColor: '#4A5D4A',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginBottom: 8,
    marginRight: 8,
  },
  serviceText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  publishedAdsSection: {
    flex: 1,
  },
  publishedAdsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  publishedAdsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  adsCount: {
    fontSize: 18,
    color: '#666666',
    marginLeft: 8,
  },
  adsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  adCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfbdbd',
    overflow: 'hidden',
    marginBottom: 16,
  },
  adImageContainer: {
    width: '100%',
    height: 160,
    backgroundColor: '#F5F5F5',
    position: 'relative',
  },
  adImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  placeholderIcon: {
    width: 48,
    height: 48,
    opacity: 0.3,
  },
  placeholder: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    opacity: 0.5,
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#B4A04E',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  featuredText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  adDetails: {
    padding: 12,
  },
  adTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 8,
  },
  adPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  rating: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },
  addToCartButton: {
    backgroundColor: '#4A5D4A',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  profileSection: {
    padding: 16,
    backgroundColor: '#fff',
  },
  profileSectionHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e5e5e5',
    overflow: 'hidden',
    marginRight: 16,
  },
  largeAvatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  profileInfo: {
    flex: 1,
  },
  profileType: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#f5f5f5',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    marginLeft: 8,
    color: '#333',
    fontSize: 14,
  },
  contentContainer: {
    flexDirection: 'row',
  },
  leftSection: {
    flex: 1,
    padding: 16,
    paddingRight: 8,
  },
  detailsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333333',
  },
  contactValue: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  rightSection: {
    flex: 2,
    padding: 16,
    paddingLeft: 8,
  },
  businessHoursSection: {
    marginBottom: 24,
  },
  emptyText: {
    color: '#666',
    fontStyle: 'italic',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    width: '90%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  modalHeader: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  closeButton: {
    padding: 8,
  },
  editFormContainer: {
    padding: 16,
    flex: 1,
  },
  editImageSection: {
    alignItems: 'center',
    width: '30%',
  },
  editAvatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
    marginBottom: 16,
  },
  editAvatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  editFormSection: {
    marginBottom: 16,
  },
  editField: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#9E9E9E',
    marginBottom: 4,
    fontWeight: '500',
  },
  fieldValue: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 4,
  },
  changeLink: {
    color: '#4B6BFB',
    fontSize: 14,
  },
  editInputContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  editInputText: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#4A5D4A',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editFieldForm: {
    padding: 16,
  },
  ratingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    color: '#666',
    fontSize: 14,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#e8e8e8',
    width: '100%',
  },
  verticalSeparator: {
    width: 1,
    backgroundColor: '#e8e8e8',
    alignSelf: 'stretch',
  },
  verticalSeparatorModal: {
    width: 1,
    backgroundColor: '#e8e8e8',
    alignSelf: 'stretch',
    marginHorizontal: 24,
  },
  editLayoutContainer: {
    flexDirection: 'row',
    gap: 32,
  },
  smallSaveButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
  saveChangesButton: {
    backgroundColor: '#4B6BFB',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  saveChangesButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
    card: {
      width: 200, // Define a value for cardWidth
      borderWidth: 1,
      borderColor: "#E4E4E7",
      borderRadius: 8,
      overflow: "hidden",
      marginHorizontal: 6, // Reduced from 8 to match image spacing
      marginBottom: 16,
      backgroundColor: "#FFFFFF",
    },
    imageContainer: {
      height: 160,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#F7F7F7", // Changed from #EAEAEA to match image
    },
    details: {
      padding: 12,
    },
  
    title: {
      color: "#2B2B2B",
      fontSize: 16,
      fontWeight: "600",
      flex: 1,
      marginRight: 8,
    },
    priceTag: {
      paddingVertical: 4,
      paddingHorizontal: 8,
      backgroundColor: "#588157",
      borderRadius: 4,
    },
    price: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "600",
    },
    ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginBottom: 8,
    },
    ratingScore: {
      color: "#09090B",
      fontWeight: "700",
      fontSize: 14,
    },
    addButton: {
      padding: 10,
      backgroundColor: "#3A593F",
      alignItems: "center",
    },
    addButtonText: {
      color: "#FFFFFF", // Changed from #DAD7CD to match image
      fontSize: 14,
      fontWeight: "500",
    },
});