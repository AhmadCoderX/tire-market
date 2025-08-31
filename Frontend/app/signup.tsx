import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { authStyles } from "./styles/auth";
import { useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GridComponent from "./Gridcomponent";
import { registerUser, loginUser, getUserProfile } from './services/api';

const SignupScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const returnToProfile = params.returnToProfile === 'true';
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Error states
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const validateUsername = (username: string) => {
    // Username validation: capitalize first letter, no spaces, alphanumeric and underscores only
    if (!username || username.trim().length === 0) {
      return "Username is required";
    }
    
    if (username.length < 3) {
      return "Username must be at least 3 characters long";
    }
    
    if (username.length > 30) {
      return "Username must be less than 30 characters";
    }
    
    // Check for spaces
    if (username.includes(' ')) {
      return "Username cannot contain spaces";
    }
    
    // Check for valid characters (alphanumeric and underscores only)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return "Username can only contain letters, numbers, and underscores";
    }
    
    return "";
  };

  const formatUsername = (input: string) => {
    // Remove spaces and convert to lowercase, then capitalize first letter
    const cleaned = input.replace(/\s+/g, '').toLowerCase();
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  };
  
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

  const handleSignup = async () => {
    try {
      // Reset errors
      setNameError('');
      setEmailError('');
      setPhoneError('');
      setPasswordError('');
      setConfirmPasswordError('');
      
      let isValid = true;

      // Validate username (name field)
      const usernameValidation = validateUsername(name);
      if (usernameValidation) {
        setNameError(usernameValidation);
        isValid = false;
      }

      if (!email) {
        setEmailError('Email is required');
        isValid = false;
      } else if (!validateEmail(email)) {
        setEmailError('Please enter a valid email');
        isValid = false;
      }

      if (!phone) {
        setPhoneError('Phone number is required');
        isValid = false;
      } else if (!validatePhone(phone)) {
        setPhoneError('Please enter a valid 10-digit phone number');
        isValid = false;
      }

      if (!password) {
        setPasswordError('Password is required');
        isValid = false;
      } else {
        const passwordValidationError = validatePassword(password);
        if (passwordValidationError) {
          setPasswordError(passwordValidationError);
          isValid = false;
        }
      }

      if (!confirmPassword) {
        setConfirmPasswordError('Please confirm your password');
        isValid = false;
      } else if (password !== confirmPassword) {
        setConfirmPasswordError('Passwords do not match');
        isValid = false;
      }

      if (!isValid) return;

      setIsLoading(true);

      // Format username properly
      const formattedUsername = formatUsername(name);

      // Prepare the data for API
      const userData = {
        username: formattedUsername,
        email: email,
        password: password,
        confirm_password: confirmPassword,
        phone: phone,
        is_business: false // Default to individual account
      };

      try {
        // Call the register API
        const registrationResponse = await registerUser(userData);

        // Auto-login after successful registration
        try {
          console.log('Registration successful, attempting auto-login...');
          
          // Login with the newly created account
          const loginResponse = await loginUser(formattedUsername, password);
          
          // Store tokens
          await AsyncStorage.setItem('accessToken', loginResponse.access);
          await AsyncStorage.setItem('refreshToken', loginResponse.refresh);
          
          // Get user profile
          const userProfile = await getUserProfile(loginResponse.access);
          await AsyncStorage.setItem('userData', JSON.stringify(userProfile));
          
          await AsyncStorage.setItem('lastLoginTime', Date.now().toString());
          
          console.log('Auto-login successful, navigating to home...');
          
          // Navigate to home page
          router.push('/home');
          
        } catch (loginError) {
          console.error('Auto-login failed, redirecting to OTP verification:', loginError);
          
          // Fallback to OTP verification if auto-login fails
          router.push({
            pathname: '/otp',
            params: {
              email,
              name: formattedUsername,
              phone,
              accountType: 'individual'
            }
          });
        }
        
      } catch (error: any) {
        console.error('Registration error:', error);
        
        // Check if the error message contains information about duplicate email or username
        const errorMessage = error.message || '';
        if (errorMessage.includes('email') && 
            (errorMessage.includes('already exists') || errorMessage.includes('duplicate'))) {
          setEmailError('This email is already registered');
        } else if (errorMessage.includes('username') && 
                   (errorMessage.includes('already exists') || errorMessage.includes('duplicate'))) {
          setNameError('This username is already taken');
        } else {
          Alert.alert(
            'Registration Failed',
            error instanceof Error ? error.message : 'An error occurred during registration'
          );
        }
      }
    } catch (error) {
      Alert.alert(
        'Registration Failed',
        error instanceof Error ? error.message : 'An error occurred during registration'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={authStyles.container}>
      {/* Grid at the Top-Right */}
      <GridComponent />

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
          <Text style={authStyles.title}>Create Account</Text>

          <View style={authStyles.inputContainer}>
            <TextInput
              style={[authStyles.input, nameError && { borderColor: '#FF0000' }]}
              placeholder="Username * (required)"
              placeholderTextColor="#A3B18A"
              value={name}
              onChangeText={(text) => { setName(text); setNameError(''); }}
              autoCapitalize="none"
            />
            {nameError ? <Text style={authStyles.errorText}>{nameError}</Text> : null}
          </View>

          <View style={authStyles.inputContainer}>
            <TextInput
              style={[authStyles.input, emailError && { borderColor: '#FF0000' }]}
              placeholder="Email"
              placeholderTextColor="#A3B18A"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => { setEmail(text); setEmailError(''); }}
            />
            {emailError ? <Text style={authStyles.errorText}>{emailError}</Text> : null}
          </View>

          <View style={authStyles.inputContainer}>
            <TextInput
              style={[authStyles.input, phoneError && { borderColor: '#FF0000' }]}
              placeholder="Phone Number"
              placeholderTextColor="#A3B18A"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={(text) => { setPhone(text); setPhoneError(''); }}
            />
            {phoneError ? <Text style={authStyles.errorText}>{phoneError}</Text> : null}
          </View>

          <View style={authStyles.inputContainer}>
            <TextInput
              style={[authStyles.input, passwordError && { borderColor: '#FF0000' }]}
              placeholder="Password"
              placeholderTextColor="#A3B18A"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => { setPassword(text); setPasswordError(''); }}
            />
            <TouchableOpacity style={authStyles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={24} color="#A3B18A" />
            </TouchableOpacity>
            {passwordError ? <Text style={authStyles.errorText}>{passwordError}</Text> : null}
          </View>

          <View style={authStyles.inputContainer}>
            <TextInput
              style={[authStyles.input, confirmPasswordError && { borderColor: '#FF0000' }]}
              placeholder="Confirm Password"
              placeholderTextColor="#A3B18A"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={(text) => { setConfirmPassword(text); setConfirmPasswordError(''); }}
            />
            <TouchableOpacity style={authStyles.eyeButton} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={24} color="#A3B18A" />
            </TouchableOpacity>
            {confirmPasswordError ? <Text style={authStyles.errorText}>{confirmPasswordError}</Text> : null}
          </View>

          <TouchableOpacity 
            style={[authStyles.button, isLoading && authStyles.buttonDisabled]} 
            onPress={handleSignup}
            disabled={isLoading}
          >
            <Text style={authStyles.buttonText}>
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignupScreen;
