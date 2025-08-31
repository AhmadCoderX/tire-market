import { View, Text, StyleSheet } from 'react-native';

export const Card = ({ children, style, ...props }) => (
  <View style={[styles.card, style]} {...props}>{children}</View>
);

export const CardHeader = ({ children }) => <View style={styles.header}>{children}</View>;
export const CardTitle = ({ children }) => <View>{children}</View>;
export const CardContent = ({ children }) => <View style={styles.content}>{children}</View>;
export const CardFooter = ({ children }) => <View style={styles.footer}>{children}</View>;

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  header: {
    marginBottom: 16,
  },
  content: {
    marginBottom: 16,
  },
  footer: {
    marginTop: 'auto',
  }
}); 