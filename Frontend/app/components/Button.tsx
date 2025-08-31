import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export const Button = ({ children, variant = "primary", className, ...props }) => (
  <TouchableOpacity 
    style={[
      styles.button,
      variant === "secondary" && styles.secondaryButton,
      className
    ]} 
    {...props}
  >
    <Text style={[
      styles.text,
      variant === "secondary" && styles.secondaryText
    ]}>
      {children}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3a593f',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#ebeeec',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  secondaryText: {
    color: '#3a593f',
  }
}); 