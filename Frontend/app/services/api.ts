import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { FilterParams, TireListingResponse } from "../types";

export const API_BASE_URL = 'http://127.0.0.1:8000/api';
const MEDIA_BASE_URL = 'http://127.0.0.1:8000/';

// Helper function to ensure URLs are absolute
export const ensureAbsoluteUrl = (url: string | undefined | null | { uri: string }) => {
  // Use our custom placeholder if no URL is provided
  if (!url) {
    try {
      return require('../../assets/images/profile-placeholder.png');
    } catch (error) {
      console.error('Error loading placeholder image:', error);
      return 'https://via.placeholder.com/150';
    }
  }
  
  // If url is an object with uri property (like from require())
  if (typeof url === 'object' && url !== null && 'uri' in url) {
    return url;
  }
  
  // Ensure url is a string
  const urlString = String(url);
  console.log('Original URL:', urlString);
  
  // If it's already an absolute URL, return it as is
  if (urlString.startsWith('http://') || urlString.startsWith('https://')) {
    console.log('URL is already absolute:', urlString);
    return urlString;
  }
  
  // If it starts with a slash, append it to the media base URL
  if (urlString.startsWith('/')) {
    const fullUrl = `${MEDIA_BASE_URL}${urlString}`;
    console.log('Converted to absolute URL:', fullUrl);
    return fullUrl;
  }
  
  // If it doesn't start with a slash, add one and append to media base URL
  const fullUrl = `${MEDIA_BASE_URL}/${urlString}`;
  console.log('Converted to absolute URL with added slash:', fullUrl);
  return fullUrl;
};

export const loginUser = async (username: string, password: string) => {
  try {
    console.log('Attempting login with:', { username, password });
    
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    console.log('Login response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Login error:', errorData);
      throw new Error(errorData.detail || 'Login failed');
    }

    const data = await response.json();
    console.log('Login successful, received tokens');
    return data; // This should include access and refresh tokens
  } catch (error) {
    console.error('Login request failed:', error);
    throw error;
  }
};

export const registerUser = async (userData: {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  phone: string;
  is_business: boolean;
}) => {
  try {
    console.log('Attempting registration with:', { ...userData, password: '***', confirm_password: '***' });
    
    const response = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(userData),
    });

    console.log('Registration response status:', response.status);
    
    // Try to parse response as JSON
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
      throw new Error('Server error: Invalid response format');
    }
    
    if (!response.ok) {
      console.error('Registration error:', errorData);
      
      // Format error messages for better display
      if (typeof errorData === 'object') {
        // Check specifically for email errors
        if (errorData.email) {
          throw new Error(`email: ${Array.isArray(errorData.email) ? errorData.email.join(', ') : errorData.email}`);
        }
        
        const errorMessages = Object.entries(errorData)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join('\n');
        throw new Error(errorMessages || 'Registration failed');
      }
      
      throw new Error(errorData.detail || 'Registration failed');
    }

    console.log('Registration successful');
    return errorData;
  } catch (error) {
    console.error('Registration request failed:', error);
    throw error;
  }
};

export const verifyOTP = async (email: string, otp: string) => {
  try {
    console.log('Attempting OTP verification for:', email);
    
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, otp }),
    });

    console.log('OTP verification response status:', response.status);
    
    // First try to parse the response as JSON
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
      throw new Error('Server error: Invalid response format');
    }

    // Now check if the response was successful
    if (!response.ok) {
      console.error('OTP verification error:', errorData);
      throw new Error(errorData.error || errorData.detail || 'OTP verification failed');
    }

    console.log('OTP verification successful');
    return errorData;
  } catch (error) {
    console.error('OTP verification request failed:', error);
    throw error;
  }
};

export const resendOTP = async (email: string) => {
  try {
    console.log('Requesting new OTP for:', email);
    
    const response = await fetch(`${API_BASE_URL}/auth/resend-otp/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    console.log('Resend OTP response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Resend OTP error:', errorData);
      throw new Error(errorData.detail || 'Failed to resend OTP');
    }

    const data = await response.json();
    console.log('New OTP sent successfully');
    return data;
  } catch (error) {
    console.error('Resend OTP request failed:', error);
    throw error;
  }
};

export const requestPasswordReset = async (email: string) => {
  try {
    console.log('Requesting password reset for:', email);
    
    const response = await fetch(`${API_BASE_URL}/auth/request-reset/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    console.log('Password reset request response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Password reset request error:', errorData);
      throw new Error(errorData.detail || 'Failed to request password reset');
    }

    const data = await response.json();
    console.log('Password reset email sent successfully');
    return data;
  } catch (error) {
    console.error('Password reset request failed:', error);
    throw error;
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    console.log('Resetting password with token');
    
    const response = await fetch(`${API_BASE_URL}/auth/reset-password/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        token,
        new_password: newPassword 
      }),
    });

    console.log('Password reset response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Password reset error:', errorData);
      throw new Error(errorData.detail || 'Failed to reset password');
    }

    const data = await response.json();
    console.log('Password reset successful');
    return data;
  } catch (error) {
    console.error('Password reset failed:', error);
    throw error;
  }
};

export const getUserProfile = async (token: string) => {
  try {
    // First get the basic user profile
    const response = await fetch(`${API_BASE_URL}/profile/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const userData = await response.json();
    
    
    // Ensure profile_image_url is absolute
    if (userData.profile_image_url) {
      userData.profile_image_url = ensureAbsoluteUrl(userData.profile_image_url);
    }

    // Get user reviews count
    try {
      const reviewsResponse = await fetch(`${API_BASE_URL}/users/${userData.id}/reviews/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (reviewsResponse.ok) {
        const reviewsData = await reviewsResponse.json();
        userData.total_reviews = reviewsData.total_reviews;
      }
    } catch (error) {
      console.error('Error fetching reviews count:', error);
    }

    // If user is a business, fetch business profile data
    if (userData.is_business) {
      try {
        const businessResponse = await fetch(`${API_BASE_URL}/profile/business/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (businessResponse.ok) {
          const businessData = await businessResponse.json();
          console.log("Business profile data:", JSON.stringify(businessData, null, 2));
          
          // Ensure business_hours is properly processed
          let processedBusinessHours = businessData.business_hours;
          
          // If it's a string, parse it to an object
          if (typeof processedBusinessHours === 'string') {
            try {
              processedBusinessHours = JSON.parse(processedBusinessHours);
              console.log("Parsed business hours from string");
            } catch (parseError) {
              console.error("Error parsing business hours:", parseError);
              // Keep it as is if parsing fails
            }
          }
          
          // Merge business data with user data
          return {
            ...userData,
            services: businessData.services || [],
            business_hours: processedBusinessHours,
            shop_name: businessData.shop_name,
            shop_address: businessData.address
          };
        }
      } catch (error) {
        console.error('Error fetching business profile:', error);
      }
    }

    return userData;
  } catch (error) {
    throw error;
  }
};

// Search for listings based on query
export const searchListings = async (query: string, sellerType: string = 'Individual') => {
  try {
    console.log('Searching for:', query, 'with seller type:', sellerType);
    
    const response = await fetch(`${API_BASE_URL}/listings/search/?query=${encodeURIComponent(query)}&seller_type=${encodeURIComponent(sellerType)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Search response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Search error:', errorData);
      throw new Error(errorData.detail || 'Search failed');
    }

    const data = await response.json();
    console.log('Search successful, results:', data.results?.length || 0);
    return data;
  } catch (error) {
    console.error('Search request failed:', error);
    throw error;
  }
};

// Get search suggestions based on partial query
export const getSearchSuggestions = async (query: string): Promise<string[]> => {
  if (!query || query.length < 2) return [];
  
  try {
    // This could be a separate API endpoint for suggestions, but we'll use the search endpoint
    const response = await fetch(`${API_BASE_URL}/listings/search/?query=${encodeURIComponent(query)}&limit=5`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    
    // Extract and return unique terms from search results
    // This depends on your API's response format
    const resultsArray = data.results as Array<any> || [];
    const suggestions: string[] = resultsArray.map((item: any) => {
      const title = (item.title as string) || '';
      const brand = (item.brand as string) || '';
      const model = (item.model as string) || '';
      return title || brand || model;
    });
    
    return [...new Set(suggestions)].slice(0, 5); // Return up to 5 unique suggestions
  } catch (error) {
    console.error('Search suggestions request failed:', error);
    return [];
  }
};

export const updateBusinessProfile = async (token: string, profileData: {
  shop_name: string;
  address: string;
  business_hours: {
    [key: string]: { isOpen: boolean; from: string; to: string };
  };
  services: string[];
  timezone: string;
}) => {
  try {
    console.log('Making API request to update business profile...');
    console.log('Token:', token ? 'exists' : 'missing');
    console.log('Profile data:', profileData);

    const response = await fetch(`${API_BASE_URL}/profile/business/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    console.log('API Response status:', response.status);
    const responseData = await response.json();
    console.log('API Response data:', responseData);

    if (!response.ok) {
      throw new Error(responseData.detail || 'Failed to update business profile');
    }

    return responseData;
  } catch (error) {
    console.error('Error in updateBusinessProfile:', error);
    throw error;
  }
};

export const getListings = async (filters: FilterParams = {}): Promise<TireListingResponse> => {
  try {
    const queryParams = new URLSearchParams();

    if (filters.condition && filters.condition.length > 0) {
      filters.condition.forEach((condition: string) => {
        queryParams.append('condition', condition);
      });
    }

    if (filters.quantity && filters.quantity.length > 0) {
      filters.quantity.forEach((quantity: string) => {
        queryParams.append('quantity', quantity);
      });
    }

    if (filters.brand && filters.brand.length > 0) {
      filters.brand.forEach((brand: string) => {
        // Preserve the proper capitalization for brand names
        const capitalizedBrand = brand === 'others' ? 'Others' : 
          brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase();
        queryParams.append('brand', capitalizedBrand);
      });
    }

    if (filters.vehicle_type && filters.vehicle_type.length > 0) {
      filters.vehicle_type.forEach((type: string) => {
        queryParams.append('vehicle_type', type);
      });
    }

    if (filters.tire_type && filters.tire_type.length > 0) {
      filters.tire_type.forEach((type: string) => {
        queryParams.append('tire_type', type);
      });
    }

    if (filters.price_min !== undefined) {
      queryParams.append('price_min', filters.price_min.toString());
    }

    if (filters.price_max !== undefined) {
      queryParams.append('price_max', filters.price_max.toString());
    }

    if (filters.seller_type) {
      queryParams.append('seller_type', filters.seller_type);
    }

    if (filters.sort_by) {
      queryParams.append('sort_by', filters.sort_by);
    }

    if (filters.search) {
      queryParams.append('search', filters.search);
    }

    if (filters.page) {
      queryParams.append('page', filters.page.toString());
    }

    if (filters.page_size) {
      queryParams.append('page_size', filters.page_size.toString());
    }

    if (filters.width) {
      queryParams.append('width', filters.width.toString());
    }

    if (filters.aspect_ratio) {
      queryParams.append('aspect_ratio', filters.aspect_ratio.toString());
    }

    if (filters.diameter) {
      queryParams.append('diameter', filters.diameter.toString());
    }

    if (filters.tread_depth_min) {
      queryParams.append('tread_depth_min', filters.tread_depth_min.toString());
    }

    if (filters.tread_depth_max) {
      queryParams.append('tread_depth_max', filters.tread_depth_max.toString());
    }

    if (filters.rating_min) {
      queryParams.append('rating_min', filters.rating_min.toString());
    }

    if (filters.speed_rating && filters.speed_rating.length > 0) {
      filters.speed_rating.forEach((rating: string) => {
        queryParams.append('speed_rating', rating);
      });
    }

    if (filters.load_index && filters.load_index.length > 0) {
      filters.load_index.forEach((loadIndex: string) => {
        queryParams.append('load_index', loadIndex);
      });
    }

    const response = await axios.get(`${API_BASE_URL}/listings/?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching listings:', error);
    throw error;
  }
};

export const createListing = async (
  token: string,
  listingData: {
    title: string;
    price: number;
    condition: 'new' | 'used';
    tire_type: 'all_season' | 'winter' | 'summer' | 'performance' | 'mud_terrain' | 'all_terrain';
    width: number;
    aspect_ratio: number;
    diameter: number;
    load_index: number;
    speed_rating: string;
    tread_depth: number;
    brand: string;
    quantity: number;
    description?: string;
    mileage?: number;
    model?: string;
    vehicle_type: 'passenger' | 'suv' | 'truck' | 'motorcycle' | 'van' | 'others';
  },
  images?: string[]
) => {
  try {
    // Create FormData instance
    const formData = new FormData();

    // Append listing data as JSON string
    formData.append('data', JSON.stringify(listingData));

    // Process images synchronously if they exist
    if (images && images.length > 0) {
      console.log(`Processing ${images.length} images...`);
      
      for (let i = 0; i < images.length; i++) {
        const imageUri = images[i];
        console.log(`Processing image ${i+1}/${images.length}: ${imageUri.substring(0, 30)}...`);
        
        try {
          // For web platform, fetch the image and convert it to a blob
          const response = await fetch(imageUri);
          const blob = await response.blob();
          
          // Generate a unique filename
          const filename = `image_${Date.now()}_${i}.jpg`;
          
          // Create a File object from the blob
          const file = new File([blob], filename, { type: 'image/jpeg' });
          
          // Append to form data
          formData.append('images', file);
          console.log(`Successfully added image ${i+1} to form data`);
        } catch (error) {
          console.error(`Error processing image ${i+1}:`, error);
        }
      }
    }

    console.log('Sending form data to server...');
    const response = await fetch(`${API_BASE_URL}/listings/create/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    });

    // Parse the response
    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
      throw new Error('Server error: Invalid response format');
    }

    // Check for errors
    if (!response.ok) {
      console.error('Error in createListing:', responseData);
      
      // Check for listing limit error (status 403)
      if (response.status === 403 && responseData.error && responseData.error.includes('maximum limit')) {
        throw new Error(responseData.error);
      }
      
      throw new Error(responseData.error || 'Failed to create listing');
    }

    return responseData;
  } catch (error) {
    console.error('Error in createListing:', error);
    throw error;
  }
};

const createNewListing = async () => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) throw new Error('No access token found');

    const listingData = {
      title: "Michelin Pilot Sport 4S",
      price: 299.99,
      condition: "new" as const,
      tire_type: "performance" as const,
      width: 245,
      aspect_ratio: 40,
      diameter: 18,
      load_index: 97,
      speed_rating: "Y",
      tread_depth: 8.5,
      brand: "Michelin",
      quantity: 4,
      description: "Brand new performance tires",
      model: "Pilot Sport 4S",
      vehicle_type: "passenger" as const
    };

    const response = await createListing(token, listingData);
    console.log('Listing created:', response);
  } catch (error) {
    console.error('Failed to create listing:', error);
  }
};

export const updateProfile = async (token: string, profileData: {
  username?: string;
  email?: string;
  phone?: string;
  profile_image_url?: string;
  is_business?: boolean;
  address?: string;
  shop_name?: string;
  shop_address?: string;
  business_hours?: string | object;
}) => {
  try {
    console.log('Updating profile with data:', profileData);
    
    // Separate business and regular user fields
    const regularUserFields: Record<string, string | boolean | undefined> = {
      username: profileData.username,
      email: profileData.email,
      phone: profileData.phone,
      profile_image_url: profileData.profile_image_url,
      is_business: profileData.is_business
    };

    // Remove undefined fields
    Object.keys(regularUserFields).forEach(key => 
      regularUserFields[key] === undefined && delete regularUserFields[key]
    );

    // Update regular user profile first
    const userResponse = await fetch(`${API_BASE_URL}/profile/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(regularUserFields),
    });

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      throw new Error(errorText || 'Failed to update user profile');
    }

    // If this is a business user and we have business fields to update
    if (profileData.is_business && (profileData.shop_name || profileData.shop_address || profileData.business_hours)) {
      const businessFields: Record<string, string | object | undefined> = {
        shop_name: profileData.shop_name,
        address: profileData.shop_address, // Note: using shop_address as address for business profile
        business_hours: profileData.business_hours
      };

      // Remove undefined fields
      Object.keys(businessFields).forEach(key => 
        businessFields[key] === undefined && delete businessFields[key]
      );

      // If we have any business fields to update
      if (Object.keys(businessFields).length > 0) {
        const businessResponse = await fetch(`${API_BASE_URL}/profile/business/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(businessFields),
        });

        if (!businessResponse.ok) {
          const errorText = await businessResponse.text();
          throw new Error(errorText || 'Failed to update business profile');
        }
      }
    }

    // Return the updated user profile
    const userData = await userResponse.json();
    return userData;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const uploadProfileImage = async (token: string, imageUri: string) => {
  try {
    // Create form data
    const formData = new FormData();
    
    // For web platform, we need to fetch the image and convert it to a blob
    const response = await fetch(imageUri);
    const blob = await response.blob();
    
    // Create a File object from the blob
    const file = new File([blob], 'profile_image.jpg', { type: 'image/jpeg' });
    
    // Append the file to form data
    formData.append('image', file);

    const uploadResponse = await fetch(`${API_BASE_URL}/profile/upload-image/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Let the browser set the Content-Type header with boundary
      },
      body: formData,
    });

    console.log('Upload response status:', uploadResponse.status);
    const responseText = await uploadResponse.text();
    console.log('Upload response text:', responseText);

    if (!uploadResponse.ok) {
      let errorMessage;
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.detail || 'Failed to upload profile image';
      } catch {
        errorMessage = 'Failed to upload profile image';
      }
      throw new Error(errorMessage);
    }

    try {
      const jsonResponse = JSON.parse(responseText);
      // Ensure the image URL is absolute
      if (jsonResponse.image_url) {
        jsonResponse.image_url = ensureAbsoluteUrl(jsonResponse.image_url);
      }
      return jsonResponse;
    } catch {
      return { message: 'Image uploaded successfully' };
    }
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
};

export interface TireListing {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: 'new' | 'used';
  tire_type: string;
  width: number;
  aspect_ratio: number;
  diameter: number;
  load_index: number;
  speed_rating: string;
  tread_depth: number;
  brand: string;
  model: string;
  quantity: number;
  mileage?: number;
  is_promoted: boolean;
  seller: {
    id: string;
    username: string;
    profile_image_url?: string;
    rating: number;
  };
  images: {
    id: string;
    image_url: string;
    thumbnail_url?: string;
    is_primary: boolean;
    position: number;
  }[];
  primary_image?: {
    id: string;
    image_url: string;
    thumbnail_url?: string;
  };
  created_at: string;
  updated_at: string;
  promotion_end_date: string | null;
  seller_name: string;
  seller_rating: number;
}

export const getListingDetails = async (listingId: string, token?: string) => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Only add Authorization header if token is provided
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/listings/${listingId}/`, {
      headers
    });

    if (!response.ok) {
      throw new Error('Failed to fetch listing details');
    }

    const data = await response.json();
    
    // Process seller profile image
    if (data.seller && data.seller.profile_image_url) {
      data.seller.profile_image_url = ensureAbsoluteUrl(data.seller.profile_image_url);
    }
    
    // Process all image URLs
    if (data.images && Array.isArray(data.images)) {
      data.images = data.images.map((image: any) => {
        if (image.image_url) {
          image.image_url = ensureAbsoluteUrl(image.image_url);
        }
        if (image.thumbnail_url) {
          image.thumbnail_url = ensureAbsoluteUrl(image.thumbnail_url);
        }
        return image;
      });
    }
    
    // Process primary image if it exists
    if (data.primary_image) {
      if (data.primary_image.image_url) {
        data.primary_image.image_url = ensureAbsoluteUrl(data.primary_image.image_url);
      }
      if (data.primary_image.thumbnail_url) {
        data.primary_image.thumbnail_url = ensureAbsoluteUrl(data.primary_image.thumbnail_url);
      }
    }
    
    return data as TireListing;
  } catch (error) {
    console.error('Error fetching listing details:', error);
    throw error;
  }
};

export interface AdminDashboardStats {
  user_stats: {
    total_users: number;
    active_users: number;
    new_users: number;
  };
  marketplace_activity: {
    active_listings: number;
    total_messages: number;
    total_reviews: number;
    new_users: number;
  };
  seller_performance: {
    business: {
      total_users: number;
      average_rating: number;
    };
    individual: {
      total_users: number;
      average_rating: number;
    };
  };
}

export const getAdminDashboardStats = async (token: string): Promise<AdminDashboardStats> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch admin dashboard stats');
    }

    const data = await response.json();
    
    // Add debug logging to see what's coming from the backend
    console.log('Dashboard stats from API:', JSON.stringify(data, null, 2));
    
    // Ensure active_listings has a valid value
    if (data && data.marketplace_activity) {
      
      // Make sure active_listings is a number
      if (data.marketplace_activity.active_listings === undefined || 
          data.marketplace_activity.active_listings === null) {
        data.marketplace_activity.active_listings = 0;
      } else {
        // Convert to number if it's a string
        data.marketplace_activity.active_listings = Number(data.marketplace_activity.active_listings);
      }
    }

    return data;
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    throw error;
  }
};

export interface Review {
  id: string;
  reviewer: {
    id: string;
    username: string;
    profile_image_url?: string;
  };
  rating: number;
  comment: string;
  created_at: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  average_rating: number;
  total_reviews: number;
}

export const getUserReviews = async (userId: string, token?: string): Promise<ReviewsResponse> => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Only add Authorization header if token is provided
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/users/${userId}/reviews/`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch user reviews');
    }

    const data = await response.json();
    
    // Ensure all profile image URLs are absolute
    if (data.reviews && Array.isArray(data.reviews)) {
      data.reviews = data.reviews.map((review: Review) => {
        if (review.reviewer && review.reviewer.profile_image_url) {
          review.reviewer.profile_image_url = ensureAbsoluteUrl(review.reviewer.profile_image_url);
        }
        return review;
      });
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    throw error;
  }
};

export const createUserReview = async (
  userId: string,
  token: string,
  reviewData: {
    rating: number;
    comment: string;
  }
): Promise<Review> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/reviews/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create review');
    }

    return data;
  } catch (error: any) {
    console.error('Error creating review:', error);
    throw error;
  }
};

// Admin user management functions
export const updateUserStatus = async (userId: string, action: string, token: string): Promise<void> => {
  try {
    console.log('Updating user status:', { userId, action });
    const response = await axios.post(
      `${API_BASE_URL}/admin/users/${userId}/status/`,
      { action },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      }
    );

    if (response.status !== 200) {
      throw new Error(response.data.error || 'Failed to update user status');
    }

    console.log('User status updated:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error updating user status:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || error.message || 'Failed to update user status');
  }
};

export const getUserListings = async (userId: string, token?: string) => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Only add Authorization header if token is provided
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/listings/?seller=${userId}`, {
      headers
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user listings');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user listings:', error);
    throw error;
  }
};

export const getUserReviewHistory = async (userId: string, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/reviews/history/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch user review history');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user review history:', error);
    throw error;
  }
};

// Admin listing management functions
export const updateListingStatus = async (listingId: string, action: string, token: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/listings/${listingId}/update/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update listing status');
    }
  } catch (error) {
    console.error('Error updating listing status:', error);
    throw error;
  }
};

// Admin review management functions
export const getReportedReviews = async (token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/reviews/reported/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch reported reviews');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching reported reviews:', error);
    throw error;
  }
};

// Fetch another user's public profile
export const getSellerProfile = async (userId: string, token?: string) => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Only add Authorization header if token is provided
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/users/${userId}/profile/`, {
      headers
    });

    if (!response.ok) {
      throw new Error('Failed to fetch seller profile');
    }

    const data = await response.json();
    
    // Ensure profile image URL is absolute
    if (data.profile_image_url) {
      data.profile_image_url = ensureAbsoluteUrl(data.profile_image_url);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching seller profile:', error);
    throw error;
  }
};

export const moderateReview = async (reviewId: string, action: string, token: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/reviews/${reviewId}/moderate/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to moderate review');
    }
  } catch (error) {
    console.error('Error moderating review:', error);
    throw error;
  }
};

export const getTireWidths = async (): Promise<number[]> => {
  const response = await fetch(`${API_BASE_URL}/tire-sizes/widths/`);
  if (!response.ok) throw new Error('Failed to fetch tire widths');
  const data = await response.json();
  return data.widths;
};

export const getTireAspectRatios = async (width: number): Promise<number[]> => {
  const response = await fetch(`${API_BASE_URL}/tire-sizes/aspect-ratios/?width=${width}`);
  if (!response.ok) throw new Error('Failed to fetch aspect ratios');
  const data = await response.json();
  return data.aspect_ratios;
};

export const getTireDiameters = async (width: number, aspectRatio: number): Promise<number[]> => {
  const response = await fetch(`${API_BASE_URL}/tire-sizes/diameters/?width=${width}&aspect_ratio=${aspectRatio}`);
  if (!response.ok) throw new Error('Failed to fetch diameters');
  const data = await response.json();
  return data.diameters;
};

export const getSpeedRatings = async (): Promise<string[]> => {
  const response = await fetch(`${API_BASE_URL}/tire-sizes/speed-ratings/`);
  if (!response.ok) throw new Error('Failed to fetch speed ratings');
  const data = await response.json();
  return data.speed_ratings;
};

export const getLoadIndices = async (): Promise<number[]> => {
  const response = await fetch(`${API_BASE_URL}/tire-sizes/load-indices/`);
  if (!response.ok) throw new Error('Failed to fetch load indices');
  const data = await response.json();
  return data.load_indices;
};

// Create a new conversation with another user
export const createConversation = async (receiverId: string, token: string) => {
  try {
    console.log('Creating new conversation with user:', receiverId);
    // Send an initial system message to create the conversation
    const response = await fetch(`${API_BASE_URL}/messages/send/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        receiver: receiverId,
        content: "Hello! I'm interested in your listing."
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create conversation');
    }

    const data = await response.json();
    console.log('Conversation created:', data);
    return data;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
};

// Admin listing management functions
export const unlistListing = async (listingId: string, token: string): Promise<void> => {
  try {
    console.log('API unlistListing called with ID:', listingId);
    const endpoint = `${API_BASE_URL}/admin/listings/${listingId}/update/`;
    console.log('Using endpoint:', endpoint);
    
    const response = await axios.post(endpoint, 
      { action: 'unlist' },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      }
    );

    console.log('Unlist response:', response.status, response.data);
  } catch (error: any) {
    console.error('Error unlisting listing. Status:', error.response?.status);
    console.error('Error response:', error.response?.data);
    console.error('Error message:', error.message);
    throw new Error(error.response?.data?.error || error.message || 'Failed to unlist listing');
  }
};

export const reactivateListing = async (listingId: string, token: string): Promise<void> => {
  try {
    console.log('API reactivateListing called with ID:', listingId);
    const endpoint = `${API_BASE_URL}/admin/listings/${listingId}/update/`;
    console.log('Using endpoint:', endpoint);
    
    const response = await axios.post(endpoint, 
      { action: 'reactivate' },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      }
    );

    console.log('Reactivate response:', response.status, response.data);
  } catch (error: any) {
    console.error('Error reactivating listing. Status:', error.response?.status);
    console.error('Error response:', error.response?.data);
    console.error('Error message:', error.message);
    throw new Error(error.response?.data?.error || error.message || 'Failed to reactivate listing');
  }
};

export interface UserListingInfo {
  total_listings: number;
  listings_limit: number | null;
  can_create_more: boolean;
  remaining: number | null;
}

export const getUserListingInfo = async (token: string): Promise<UserListingInfo> => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/listings-info/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user listing info');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user listing info:', error);
    throw error;
  }
};

// Shops API interface
export interface Shop {
  id: string;
  user_id: string;
  name: string;
  business_type: string;
  address: string;
  phone: string;
  rating: number;
  review_count: number;
  services: string[];
  operating_hours: any; // Can be string or object format
  image_url: string | null;
  is_featured: boolean;
}

export interface ShopsResponse {
  results: Shop[];
  count: number;
}

export interface ShopFilters {
  services?: string[];
  rating_min?: number;
  operating_hours?: string[];
  search?: string;
}

export const getShops = async (filters: ShopFilters = {}): Promise<ShopsResponse> => {
  try {
    const params = new URLSearchParams();
    
    if (filters.services && filters.services.length > 0) {
      filters.services.forEach(service => params.append('services', service));
    }
    
    if (filters.rating_min) {
      params.append('rating_min', filters.rating_min.toString());
    }
    
    if (filters.operating_hours && filters.operating_hours.length > 0) {
      filters.operating_hours.forEach(hour => params.append('operating_hours', hour));
    }
    
    if (filters.search) {
      params.append('search', filters.search);
    }

    const url = `${API_BASE_URL}/shops/${params.toString() ? `?${params.toString()}` : ''}`;
    console.log('Fetching shops from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });

    console.log('Shops response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Shops fetch error:', errorData);
      throw new Error(errorData.error || 'Failed to fetch shops');
    }

    const data = await response.json();
    console.log('Shops fetched successfully:', data.count, 'shops found');
    
    // Process image URLs to ensure they're absolute
    const processedShops = data.results.map((shop: Shop) => ({
      ...shop,
      image_url: shop.image_url ? ensureAbsoluteUrl(shop.image_url) : null
    }));
    
    return {
      results: processedShops,
      count: data.count
    };
  } catch (error) {
    console.error('Error fetching shops:', error);
    throw error;
  }
};

export interface ServicesResponse {
  services: string[];
  count: number;
}

export const getServicesList = async (): Promise<ServicesResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/shops/services/`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching services list:', error);
    throw error;
  }
};

