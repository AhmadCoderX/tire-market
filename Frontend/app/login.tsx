import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { authStyles } from "./styles/auth";
import { useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GridComponent from "./Gridcomponent"; // Import GridComponent
import { loginUser, getUserProfile } from './services/api';

const LoginScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const returnToProfile = params.returnToProfile === 'true';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateInputs = () => {
    let isValid = true;
    
    // Clear previous errors
    setUsernameError('');
    setPasswordError('');
    setLoginError('');
    
    // Validate username
    if (!username) {
      setUsernameError('Username is required');
      isValid = false;
    } else if (username.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      isValid = false;
    }
    
    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }
    
    return isValid;
  };

  const handleLogin = async () => {
    try {
      if (!validateInputs()) {
        return;
      }

      setIsLoading(true);
      console.log('Starting login process...');

      // Call login API
      const loginResponse = await loginUser(username, password);
      console.log('Login successful');
      
      // Store tokens
      await AsyncStorage.setItem('accessToken', loginResponse.access);
      await AsyncStorage.setItem('refreshToken', loginResponse.refresh);
      
      try {
        // Get user profile
        const userProfile = await getUserProfile(loginResponse.access);
        // Store user data
        await AsyncStorage.setItem('userData', JSON.stringify(userProfile));
      } catch (profileError) {
        console.error('Error fetching profile, but login was successful:', profileError);
        // Continue with basic user info if profile fetch fails
      }
      
      await AsyncStorage.setItem('lastLoginTime', Date.now().toString());
      
      // Navigate to home
      console.log('Navigating to home page');
      router.push('/home');

    } catch (error) {
      console.error('Login error:', error);
      
      // Handle specific error types
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        
        if (errorMessage.includes('credentials') || errorMessage.includes('incorrect') || errorMessage.includes('invalid')) {
          setLoginError('Invalid username or password');
        } else if (errorMessage.includes('network') || errorMessage.includes('connection')) {
          setLoginError('Network error. Please check your connection');
        } else if (errorMessage.includes('server')) {
          setLoginError('Server error. Please try again later');
        } else {
          setLoginError(error.message);
        }
      } else {
        setLoginError('An unexpected error occurred. Please try again');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: any) => {
    if (e.nativeEvent.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <SafeAreaView style={authStyles.container}>
      {/* Grid at the Top-Right */}
      <GridComponent />

      <View style={authStyles.headerContainer}>
        <TouchableOpacity
          style={authStyles.headerButton}
          onPress={() => router.push("/signup")}
        >
          <Text style={authStyles.headerButtonText}>Sign up</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={authStyles.formContainer}
      >
        <View style={authStyles.formBox}>
          <Text style={authStyles.title}>Sign in</Text>

          {loginError ? (
            <View style={authStyles.errorContainer}>
              <Text style={authStyles.errorText}>{loginError}</Text>
            </View>
          ) : null}

          <View style={authStyles.inputContainer}>
            <TextInput
              style={[authStyles.input, usernameError && { borderColor: '#FF0000' }]}
              placeholder="Username"
              placeholderTextColor="#A3B18A"
              autoCapitalize="none"
              value={username}
              onChangeText={(text) => { setUsername(text); setUsernameError(''); setLoginError(''); }}
              onSubmitEditing={handleLogin}
              returnKeyType="next"
            />
            {usernameError ? <Text style={authStyles.errorText}>{usernameError}</Text> : null}
          </View>

          <View style={authStyles.inputContainer}>
            <TextInput
              style={[authStyles.input, passwordError && { borderColor: '#FF0000' }]}
              placeholder="Password"
              placeholderTextColor="#A3B18A"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => { setPassword(text); setPasswordError(''); setLoginError(''); }}
              onSubmitEditing={handleLogin}
              returnKeyType="done"
              onKeyPress={handleKeyPress}
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

          <TouchableOpacity
            style={authStyles.forgotButton}
            onPress={() => router.push("/forgot")}
          >
            <Text style={authStyles.forgotButtonText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[authStyles.button, isLoading && authStyles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={authStyles.buttonText}>{isLoading ? 'Logging in...' : 'Login'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
