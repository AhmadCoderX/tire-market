export interface TireListing {
  id: string;
  seller: {
    id: string;
    username: string;
    profile_image_url: string | null;
    date_joined: string | null;
    is_business: boolean;
    rating: number;
  };
  seller_name: string;
  seller_rating: number;
  seller_review_count: number;
  title: string;
  description?: string;
  price: number | string;
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
  mileage?: number;
  created_at: string;
  updated_at: string;
  is_promoted: boolean;
  promotion_end_date?: string;
  model?: string;
  images: Array<{
    id: string;
    image_url: string;
    thumbnail_url?: string;
    is_primary: boolean;
    position: number;
  }>;
}

export interface TireListingResponse {
  results: TireListing[];
  count: number;
  next?: string;
  previous?: string;
}

export interface FilterParams {
  condition?: ('new' | 'used')[];
  quantity?: ('single' | 'double' | 'set4')[];
  brand?: string[];
  vehicle_type?: ('passenger' | 'suv' | 'truck' | 'motorcycle' | 'van' | 'others')[];
  tire_type?: ('all_season' | 'winter' | 'summer' | 'performance' | 'mud_terrain' | 'all_terrain')[];
  price_min?: number;
  price_max?: number;
  search?: string;
  seller_type?: string;
  sort_by?: string;
  page?: number;
  page_size?: number;
  width?: number;
  aspect_ratio?: number;
  diameter?: number;
  tread_depth_min?: number;
  tread_depth_max?: number;
  rating_min?: number;
  speed_rating?: string[];
  load_index?: string[];
}

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