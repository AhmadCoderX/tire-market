import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { authStyles } from "./styles/auth";
import { useState } from "react";
import GridComponent from "./Gridcomponent";
import { requestPasswordReset } from './services/api';

const ForgotPasswordScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleReset = async () => {
    setEmailError('');

    if (!email) {
      setEmailError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      return;
    }

    setIsLoading(true);

    try {
      // Request password reset via API
      await requestPasswordReset(email);
      
      Alert.alert(
        'Password Reset Email Sent',
        'If an account with this email exists, you will receive a password reset link shortly.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/login')
          }
        ]
      );
    } catch (error) {
      console.error('Password reset request failed:', error);
      
      // Don't reveal if email exists or not for security
      Alert.alert(
        'Password Reset Email Sent',
        'If an account with this email exists, you will receive a password reset link shortly.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/login')
          }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={authStyles.container}>
      <GridComponent /> {/* Added GridComponent */}

      <View style={authStyles.headerContainer}>
        <TouchableOpacity
          style={authStyles.headerButton}
          onPress={() => router.push("/login")}
        >
          <Text style={authStyles.headerButtonText}>Login</Text>
        </TouchableOpacity>
      </View>

      <View style={authStyles.formContainer}>
        <View style={authStyles.formBox}>
          <Text style={authStyles.title}>Reset Password</Text>

          <View style={authStyles.inputContainer}>
            <TextInput
              style={[authStyles.input, emailError && { borderColor: '#FF0000' }]}
              placeholder="Email"
              placeholderTextColor="#A3B18A"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError('');
              }}
            />
            {emailError ? <Text style={authStyles.errorText}>{emailError}</Text> : null}
          </View>

          <TouchableOpacity
            style={[authStyles.button, isLoading && authStyles.buttonDisabled]}
            onPress={handleReset}
            disabled={isLoading}
          >
            <Text style={authStyles.buttonText}>
              {isLoading ? 'Sending...' : 'Reset Password'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
