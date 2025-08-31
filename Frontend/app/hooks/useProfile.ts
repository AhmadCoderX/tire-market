import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserProfile } from '../services/api';

export interface ProfileData {
  username: string;
  email: string;
  phone: string;
  profile_image_url?: string;
  rating?: number;
  is_business: boolean;
  shop_address?: string;
  services?: string[];
  business_hours?: {
    [key: string]: {
      isOpen: boolean;
      from: string;
      to: string;
    };
  };
  shop_name?: string;
  total_reviews?: number;
  // Add other profile fields as needed
}

export const useProfile = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('No access token found');
      }

      const data = await getUserProfile(token);
      console.log("Received profile data:", JSON.stringify(data, null, 2));
      
      // Log business hours if they exist
      if (data?.business_hours) {
        console.log("Business hours structure:", typeof data.business_hours);
        console.log("Business hours keys:", Object.keys(data.business_hours));
      }
      
      setProfileData(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profileData, loading, error, refreshProfile };
}; 