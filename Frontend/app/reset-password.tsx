import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { authStyles } from "./styles/auth";
import { useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import GridComponent from "./Gridcomponent"; // Import GridComponent

const ResetPasswordScreen = () => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const handleResetPassword = () => {
    let isValid = true;

    // Reset errors
    setPasswordError('');
    setConfirmPasswordError('');

    // Password validation
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    // Confirm password validation
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }

    if (isValid) {
      // Password reset successful
      router.push("/login");
    }
  };

  return (
    <SafeAreaView style={authStyles.container}>
      <GridComponent /> {/* ✅ Add the grid background */}

      <View style={authStyles.formContainer}>
        <View style={authStyles.formBox}>
          <Text style={authStyles.title}>Reset Password</Text>

          <Text style={authStyles.successText}>
            Email verified successfully. Please set your new password.
          </Text>

          <View style={authStyles.inputContainer}>
            <TextInput
              style={[authStyles.input, passwordError && { borderColor: '#FF0000' }]}
              placeholder="New Password"
              placeholderTextColor="#A3B18A"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError('');
                if (confirmPassword && text === confirmPassword) {
                  setConfirmPasswordError('');
                }
              }}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={authStyles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={24}
                color="#A3B18A"
              />
            </TouchableOpacity>
            {passwordError ? <Text style={authStyles.errorText}>{passwordError}</Text> : null}
          </View>

          <View style={[authStyles.inputContainer, { marginBottom: 32 }]}>
            <TextInput
              style={[authStyles.input, confirmPasswordError && { borderColor: '#FF0000' }]}
              placeholder="Confirm New Password"
              placeholderTextColor="#A3B18A"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setConfirmPasswordError('');
                if (password && text !== password) {
                  setConfirmPasswordError('Passwords do not match');
                }
              }}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              style={authStyles.eyeButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                size={24}
                color="#A3B18A"
              />
            </TouchableOpacity>
            {confirmPasswordError ? <Text style={authStyles.errorText}>{confirmPasswordError}</Text> : null}
          </View>

          <TouchableOpacity
            style={authStyles.button}
            onPress={handleResetPassword}
          >
            <Text style={authStyles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ResetPasswordScreen;
