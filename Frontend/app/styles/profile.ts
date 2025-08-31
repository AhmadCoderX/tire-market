import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const profileStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  profileInfo: {
    alignItems: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5F5F5',
    marginBottom: 12,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  shopName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
  },
  detailsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  contactLabel: {
    width: 80,
    fontSize: 16,
    color: '#666666',
  },
  contactValue: {
    fontSize: 16,
    color: '#000000',
  },
  servicesSection: {
    marginBottom: 24,
  },
  servicesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceTag: {
    backgroundColor: '#E9EDC9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3A5A40',
  },
  serviceText: {
    color: '#3A5A40',
    fontSize: 14,
  },
  adsSection: {
    marginBottom: 24,
  },
  adsScrollView: {
    flexGrow: 0,
  },
  adCard: {
    width: 280,
    marginRight: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  adImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#F5F5F5',
  },
  adDetails: {
    padding: 12,
  },
  adTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  adPrice: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 12,
  },
  addToCartButton: {
    backgroundColor: '#3A5A40',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
}); 