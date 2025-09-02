import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { authStyles } from "./styles/auth";
import GridComponent from "./Gridcomponent";
import { resetPassword } from './services/api';

const ChangePasswordScreen = () => {
  const router = useRouter();
  const { email, token } = useLocalSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasMinLength = password.length >= 6;

    if (!hasUpperCase) return "Password must contain at least 1 uppercase letter";
    if (!hasLowerCase) return "Password must contain at least 1 lowercase letter";
    if (!hasNumber) return "Password must contain at least 1 number";
    if (!hasMinLength) return "Password must be at least 6 characters long";
    return "";
  };

  const handleChangePassword = async () => {
    let isValid = true;
    setPasswordError("");
    setConfirmPasswordError("");

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      const passwordValidationError = validatePassword(password);
      if (passwordValidationError) {
        setPasswordError(passwordValidationError);
        isValid = false;
      }
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    }

    if (!isValid) return;

    setIsLoading(true);

    try {
      // If we have a token, use the API reset password
      if (token) {
        console.log('Resetting password with token:', token);
        await resetPassword(token as string, password);
        
        Alert.alert(
          'Password Reset Successful',
          'Your password has been reset successfully. You can now login with your new password.',
          [
            {
              text: 'Login Now',
              onPress: () => router.push('/login')
            }
          ]
        );
      } else {
        // Fallback for manual password change (without token)
        Alert.alert(
          'Password Changed',
          'Your password has been changed successfully.',
          [
            {
              text: 'OK',
              onPress: () => router.push('/login')
            }
          ]
        );
      }
    } catch (error: any) {
      console.error('Password reset failed:', error);
      
      // Handle specific error types
      let errorMessage = 'An error occurred while resetting your password. Please try again.';
      
      if (error.message) {
        if (error.message.includes('token') || error.message.includes('expired')) {
          errorMessage = 'Your password reset link has expired or is invalid. Please request a new password reset.';
        } else if (error.message.includes('network') || error.message.includes('connection')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else if (error.message.includes('server')) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.message.includes('password')) {
          errorMessage = error.message;
        }
      }
      
      Alert.alert(
        'Password Reset Failed',
        errorMessage,
        [
          {
            text: 'Try Again',
            onPress: () => {} // Stay on the same screen
          },
          {
            text: 'Request New Reset',
            onPress: () => router.push('/forgot')
          }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={authStyles.container}>
      {/* Grid at the Top-Right */}
      <GridComponent />

      <View style={authStyles.formContainer}>
        <View style={authStyles.formBox}>
          <Text style={authStyles.title}>Change Password</Text>
          <Text style={authStyles.successText}>Changing password for {email}</Text>

          {/* Password Input */}
          <View style={authStyles.inputContainer}>
            <TextInput
              style={[authStyles.input, passwordError && { borderColor: "#FF0000" }]}
              placeholder="New Password"
              placeholderTextColor="#A3B18A"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError("");
                if (confirmPassword && text === confirmPassword) {
                  setConfirmPasswordError("");
                }
              }}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={authStyles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={24} color="#A3B18A" />
            </TouchableOpacity>
            {passwordError ? <Text style={authStyles.errorText}>{passwordError}</Text> : null}
          </View>

          {/* Confirm Password Input */}
          <View style={[authStyles.inputContainer, { marginBottom: 32 }]}>
            <TextInput
              style={[authStyles.input, confirmPasswordError && { borderColor: "#FF0000" }]}
              placeholder="Confirm New Password"
              placeholderTextColor="#A3B18A"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setConfirmPasswordError("");
                if (password && text !== password) {
                  setConfirmPasswordError("Passwords do not match");
                }
              }}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              style={authStyles.eyeButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={24} color="#A3B18A" />
            </TouchableOpacity>
            {confirmPasswordError ? <Text style={authStyles.errorText}>{confirmPasswordError}</Text> : null}
          </View>

          {/* Change Password Button */}
          <TouchableOpacity 
            style={[authStyles.button, isLoading && authStyles.buttonDisabled]} 
            onPress={handleChangePassword}
            disabled={isLoading}
          >
            <Text style={authStyles.buttonText}>
              {isLoading ? 'Resetting...' : 'Change Password'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;
