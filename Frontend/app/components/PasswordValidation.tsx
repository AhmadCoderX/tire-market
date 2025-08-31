import { View, Text, StyleSheet } from 'react-native';
import { Check, X } from 'lucide-react-native';

interface PasswordValidationProps {
  password: string;
}

export const PasswordValidation = ({ password }: PasswordValidationProps) => {
  const validations = [
    {
      label: 'At least 1 uppercase letter (A-Z)',
      isValid: /[A-Z]/.test(password),
    },
    {
      label: 'At least 1 lowercase letter (a-z)',
      isValid: /[a-z]/.test(password),
    },
    {
      label: 'At least 1 number (0-9)',
      isValid: /[0-9]/.test(password),
    },
    {
      label: 'At least 6 characters',
      isValid: password.length >= 6,
    },
  ];

  const allValid = validations.every(v => v.isValid);
  
  if (allValid || !password) return null;

  return (
    <View style={styles.container}>
      {validations.map((validation, index) => (
        <View key={index} style={styles.row}>
          {validation.isValid ? (
            <Check size={16} color="#2D4B3A" />
          ) : (
            <X size={16} color="#FF0000" />
          )}
          <Text
            style={[
              styles.text,
              { color: validation.isValid ? '#2D4B3A' : '#FF0000' }
            ]}
          >
            {validation.label}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: -240, // Adjusted position
    top: -10,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    width: 220, // Slightly wider
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 2, // Ensure it shows above other elements
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  text: {
    fontSize: 12,
    flex: 1,
  },
}); 