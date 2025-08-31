import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { ensureAbsoluteUrl, getListings, unlistListing, reactivateListing } from '../services/api';
import ListingActionsMenu from './ListingActionsMenu';

interface Listing {
  id: string;
  title: string;
  seller: {
    id: string;
    username: string;
    email: string;
    profile_image_url: string;
  };
  price: string;
  created_at: string;
  is_promoted: boolean;
  is_active: boolean;
  tire_type: string;
  condition: string;
  images: string[];
}

const ListingManagement = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const fallbackImage = require('../../assets/images/profile-placeholder.png');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          setError('No access token found');
          return;
        }

        const response = await axios.get('http://127.0.0.1:8000/api/admin/listings/', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Process the listings to ensure profile images are correctly formatted
        const processedListings = response.data.results.map((listing: any) => {
          if (listing.seller && listing.seller.profile_image_url) {
            try {
              listing.seller.profile_image_url = ensureAbsoluteUrl(listing.seller.profile_image_url);
            } catch (error) {
              console.error('Error processing profile image URL:', error);
            }
          }
          return listing;
        });

        setListings(processedListings);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch listings');
        console.error('Error fetching listings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleViewDetails = (listingId: string) => {
    router.push({
      pathname: '/frame',
      params: { listingId }
    });
  };

  const handleAction = async (action: string, listingId: string) => {
    try {
      console.log('ListingManagement handleAction called with:', action, listingId);
      
      const token = await AsyncStorage.getItem('accessToken');
      console.log('Token retrieved:', token ? `${token.substring(0, 10)}...` : 'not found');
      
      if (!token) {
        console.error('No access token found');
        return;
      }

      switch (action) {
        case 'unlist':
          console.log('Attempting to unlist listing:', listingId);
          await unlistListing(listingId, token);
          console.log('Unlist successful, updating state');
          setListings(prevListings => 
            prevListings.map(listing => 
              listing.id === listingId 
                ? { ...listing, is_active: false }
                : listing
            )
          );
          break;
        case 'reactivate':
          console.log('Attempting to reactivate listing:', listingId);
          await reactivateListing(listingId, token);
          console.log('Reactivate successful, updating state');
          setListings(prevListings => 
            prevListings.map(listing => 
              listing.id === listingId 
                ? { ...listing, is_active: true }
                : listing
            )
          );
          break;
        default:
          console.warn('Unknown action:', action);
      }
    } catch (error) {
      console.error('Error handling action:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#344E41" />
          <Text style={styles.loadingText}>Loading listings...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tableHeader}>
        <View style={styles.nameColumn}>
          <Text style={styles.columnHeader}>Name</Text>
        </View>
        <View style={styles.adsColumn}>
          <Text style={styles.columnHeader}>Ads</Text>
        </View>
        <View style={styles.titleColumn}>
          <Text style={styles.columnHeader}>Title</Text>
        </View>
        <View style={styles.linkColumn}>
          <Text style={styles.columnHeader}>Link</Text>
        </View>
        <View style={styles.statusColumn}>
          <Text style={styles.columnHeader}>Status</Text>
        </View>
        <View style={styles.actionsColumn}>
          <Text style={styles.columnHeader}>Actions</Text>
        </View>
      </View>

      <ScrollView style={styles.listingsContainer}>
        {listings.map((listing, index) => (
          <View key={listing.id} style={[
            styles.listingRow,
            index % 2 === 0 ? styles.evenRow : styles.oddRow
          ]}>
            <View style={[styles.cell, styles.nameColumn]}>
              <View style={styles.profileImageContainer}>
              <Image 
                  source={listing.seller.profile_image_url 
                    ? { uri: listing.seller.profile_image_url } 
                    : fallbackImage} 
                style={styles.profileImage} 
                  defaultSource={fallbackImage}
                  onError={(e) => {
                    console.log('Image error for user:', listing.seller.username);
                  }}
              />
              </View>
              <View style={styles.userInfoContainer}>
                <Text style={styles.name}>{listing.seller.username}</Text>
                <Text style={styles.email}>{listing.seller.email}</Text>
              </View>
            </View>
            <View style={[styles.cell, styles.adsColumn]}>
              <Image 
                source={{ 
                  uri: listing.images?.[0] || 'https://via.placeholder.com/48?text=No+Image'
                }} 
                style={styles.productImage} 
                defaultSource={require('../../assets/images/profile-placeholder.png')}
              />
            </View>
            <Text style={[styles.cell, styles.titleColumn]} numberOfLines={1}>{listing.title}</Text>
            <TouchableOpacity 
              style={[styles.cell, styles.linkColumn]}
              onPress={() => handleViewDetails(listing.id)}
            >
              <Text style={styles.linkText}>View Details</Text>
            </TouchableOpacity>
            <Text style={[styles.cell, styles.statusColumn, listing.is_active ? styles.activeStatus : styles.unlistedStatus]}>
              {listing.is_active ? 'Active' : 'Unlisted'}
            </Text>
            <View style={[styles.cell, styles.actionsColumn]}>
              <ListingActionsMenu 
                listingId={listing.id}
                isActive={listing.is_active}
                onAction={handleAction}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#344E41',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    padding: 24,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
  },
  columnHeader: {
    fontWeight: '600',
    color: '#64748B',
    fontSize: 16,
  },
  listingsContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  listingRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  evenRow: {
    backgroundColor: '#FFFFFF',
  },
  oddRow: {
    backgroundColor: '#F8FAFC',
  },
  cell: {
    justifyContent: 'center',
    paddingVertical: 4,
  },
  nameColumn: {
    flex: 2.5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingRight: 16,
  },
  profileImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    marginRight: 12,
  },
  userInfoContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
  },
  adsColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    paddingHorizontal: 16,
  },
  titleColumn: {
    flex: 2,
    color: '#1E293B',
    paddingHorizontal: 16,
  },
  linkColumn: {
    flex: 1.5,
    paddingHorizontal: 16,
  },
  linkText: {
    color: '#2563EB',
    textDecorationLine: 'none',
  },
  statusColumn: {
    flex: 1,
    paddingHorizontal: 16,
  },
  actionsColumn: {
    flex: 0.7,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  productImage: {
    width: 48,
    height: 48,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
  },
  name: {
    fontWeight: '500',
    color: '#1E293B',
    fontSize: 14,
    marginBottom: 2,
  },
  email: {
    color: '#64748B',
    fontSize: 14,
  },
  approvedStatus: {
    color: '#10B981',
    fontSize: 14,
  },
  activeStatus: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '500',
  },
  removedStatus: {
    color: '#EF4444',
    fontSize: 14,
  },
  actionButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  unlistedStatus: {
    color: '#EF4444',
    fontSize: 14,
  },
});

export default ListingManagement;