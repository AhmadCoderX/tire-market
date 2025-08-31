import { TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { User } from 'lucide-react-native';

export default function ProfileButton() {
  const router = useRouter();
  const pathname = usePathname();

  // Don't show the button on the profile page
  if (pathname === '/profileDetails') {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={() => router.push('/profileDetails')}
      style={{
        position: 'absolute',
        top: 40,
        right: 16,
        padding: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <User size={24} color="#2D4B3A" />
    </TouchableOpacity>
  );
} 