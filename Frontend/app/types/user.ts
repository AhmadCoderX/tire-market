export type UserData = {
  name: string;
  email: string;
  phone: string;
  accountType: 'individual' | 'business';
  shopName?: string;
  shopAddress?: string;
  services?: string[];
  businessHours?: {
    [key: string]: { isOpen: boolean, from: string, to: string }
  };
  timezone?: string;
  profileImage?: string;
}

export default UserData; 