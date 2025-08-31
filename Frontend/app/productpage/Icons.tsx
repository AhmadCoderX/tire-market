import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, {
  Path,
  G,
  Rect,
  Defs,
  ClipPath,
  LinearGradient,
  Stop,
  Mask,
  Circle,
} from "react-native-svg";

export const SearchIcon: React.FC = () => (
  <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <Path
      d="M17.5 17.5L12.5 12.5M14.1667 8.33333C14.1667 11.555 11.555 14.1667 8.33333 14.1667C5.11167 14.1667 2.5 11.555 2.5 8.33333C2.5 5.11167 5.11167 2.5 8.33333 2.5C11.555 2.5 14.1667 5.11167 14.1667 8.33333Z"
      stroke="#F5F5F5"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const CartIcon: React.FC = () => (
  <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <Path
      d="M5 1.66667L2.5 5.00001V16.6667C2.5 17.1087 2.67559 17.5326 2.98816 17.8452C3.30072 18.1577 3.72464 18.3333 4.16667 18.3333H15.8333C16.2754 18.3333 16.6993 18.1577 17.0118 17.8452C17.3244 17.5326 17.5 17.1087 17.5 16.6667V5.00001L15 1.66667H5Z"
      stroke="#000000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2.5 5H17.5"
      stroke="#000000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13.3333 8.33333C13.3333 9.2174 12.9821 10.0652 12.357 10.6904C11.7319 11.3155 10.884 11.6667 10 11.6667C9.11595 11.6667 8.26809 11.3155 7.64297 10.6904C7.01785 10.0652 6.66667 9.2174 6.66667 8.33333"
      stroke="#000000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ProfileIcon: React.FC = () => (
  <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <Path
      d="M16.6667 17.5V15.8333C16.6667 14.9493 16.3155 14.1014 15.6904 13.4763C15.0652 12.8512 14.2174 12.5 13.3333 12.5H6.66667C5.78261 12.5 4.93476 12.8512 4.30964 13.4763C3.68452 14.1014 3.33333 14.9493 3.33333 15.8333V17.5"
      stroke="#000000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10 9.16667C11.841 9.16667 13.3333 7.67428 13.3333 5.83333C13.3333 3.99238 11.841 2.5 10 2.5C8.15905 2.5 6.66667 3.99238 6.66667 5.83333C6.66667 7.67428 8.15905 9.16667 10 9.16667Z"
      stroke="#000000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

interface IconProps {
  size?: number;
  color?: string;
  filled?: boolean;
  half?: boolean;
}

export const StarIcon: React.FC<IconProps> = ({ 
  size = 16, 
  color = '#FFB800', 
  filled = true,
  half = false 
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={filled ? (half ? 'url(#half)' : color) : '#E0E0E0'}
        stroke={color}
        strokeWidth="1"
      />
      {half && (
        <defs>
          <linearGradient id="half" x1="0" y1="0" x2="1" y2="0">
            <stop offset="50%" stopColor={color} />
            <stop offset="50%" stopColor="#E0E0E0" />
          </linearGradient>
        </defs>
      )}
    </Svg>
  );
};

export const ShareIcon: React.FC = () => (
  <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <Path
      d="M12 5.33325C13.1046 5.33325 14 4.43782 14 3.33325C14 2.22868 13.1046 1.33325 12 1.33325C10.8954 1.33325 10 2.22868 10 3.33325C10 4.43782 10.8954 5.33325 12 5.33325Z"
      stroke="black"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4 10C5.10457 10 6 9.10457 6 8C6 6.89543 5.10457 6 4 6C2.89543 6 2 6.89543 2 8C2 9.10457 2.89543 10 4 10Z"
      stroke="black"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 14.6667C13.1046 14.6667 14 13.7713 14 12.6667C14 11.5622 13.1046 10.6667 12 10.6667C10.8954 10.6667 10 11.5622 10 12.6667C10 13.7713 10.8954 14.6667 12 14.6667Z"
      stroke="black"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5.72656 9.00659L10.2799 11.6599"
      stroke="black"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10.2732 4.34009L5.72656 6.99342"
      stroke="black"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ChevronLeftIcon: React.FC = () => (
  <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <Path
      d="M12.5 15L7.5 10L12.5 5"
      stroke="#293E2C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ChevronRightIcon: React.FC = () => (
  <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <Path
      d="M6 12L10 8L6 4"
      stroke="#293E2C"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const MinusIcon: React.FC = () => (
  <Svg width="24" height="25" viewBox="0 0 24 25" fill="none">
    <Rect x="2" y="2.38647" width="20" height="20" rx="5" fill="#5B7560" />
    <Path
      d="M9 12.3865H15"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const PlusIcon: React.FC = () => (
  <Svg width="25" height="25" viewBox="0 0 25 25" fill="none">
    <Rect
      x="2.15698"
      y="2.38647"
      width="20"
      height="20"
      rx="5"
      fill="#5B7560"
    />
    <Path
      d="M9.15698 12.3865H15.157"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12.157 9.38647L12.157 15.3865"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const MessageIcon: React.FC = () => (
  <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <Path
      d="M14 10C14 10.3536 13.8595 10.6928 13.6095 10.9428C13.3594 11.1929 13.0203 11.3333 12.6667 11.3333H4.66667L2 14V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H12.6667C13.0203 2 13.3594 2.14048 13.6095 2.39052C13.8595 2.64057 14 2.97971 14 3.33333V10Z"
      stroke="#E6E6E6"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Simplified placeholder for the product image
export const ProductImage: React.FC = () => (
  <View style={styles.productImagePlaceholder}>
    <Svg width="100" height="100" viewBox="0 0 100 100" fill="none">
      <Rect width="100" height="100" fill="#EAEAEA" />
      <Path
        d="M70 35H30C27.2386 35 25 37.2386 25 40V60C25 62.7614 27.2386 65 30 65H70C72.7614 65 75 62.7614 75 60V40C75 37.2386 72.7614 35 70 35Z"
        stroke="#666666"
        strokeWidth="2"
      />
      <Path
        d="M35 50L45 60L55 50L65 60"
        stroke="#666666"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="40" cy="45" r="5" fill="#666666" />
    </Svg>
  </View>
);

// Simplified placeholder for thumbnail images
export const ThumbnailImage: React.FC = () => (
  <View style={styles.thumbnailImagePlaceholder}>
    <Svg width="50" height="50" viewBox="0 0 50 50" fill="none">
      <Rect width="50" height="50" fill="#EAEAEA" />
      <Path
        d="M35 17.5H15C13.6193 17.5 12.5 18.6193 12.5 20V30C12.5 31.3807 13.6193 32.5 15 32.5H35C36.3807 32.5 37.5 31.3807 37.5 30V20C37.5 18.6193 36.3807 17.5 35 17.5Z"
        stroke="#666666"
        strokeWidth="1"
      />
      <Path
        d="M17.5 25L22.5 30L27.5 25L32.5 30"
        stroke="#666666"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="20" cy="22.5" r="2.5" fill="#666666" />
    </Svg>
  </View>
);

// Simplified placeholder for seller avatar
export const SellerAvatar: React.FC = () => (
  <View style={styles.sellerAvatarPlaceholder}>
    <Svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <Rect width="48" height="48" fill="#EAEAEA" />
      <Path
        d="M24 24C27.3137 24 30 21.3137 30 18C30 14.6863 27.3137 12 24 12C20.6863 12 18 14.6863 18 18C18 21.3137 20.6863 24 24 24Z"
        fill="#666666"
      />
      <Path
        d="M36 36C36 29.3726 30.6274 24 24 24C17.3726 24 12 29.3726 12 36"
        stroke="#666666"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  </View>
);

const styles = StyleSheet.create({
  productImagePlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EAEAEA",
  },
  thumbnailImagePlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EAEAEA",
  },
  sellerAvatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
  },
});
