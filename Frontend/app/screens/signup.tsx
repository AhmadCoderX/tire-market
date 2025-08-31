import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { authStyles } from "../styles/auth";
import { useState } from "react";
import { Ionicons } from '@expo/vector-icons';

const SignupScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

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
    let isValid = true;
    
    // Reset errors
    setEmailError('');
    setPasswordError('');

    // Validate email
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    }

    // Validate password
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

    if (isValid) {
      router.push('/home');
    }
  };

  const defaultServices = [
    'Flat Tire Repair',
    'Wheel Balancing',
    'Tire Installation',
    'Brake Service',
    'TPMS Service',
    'Wheel Alignment',
    'Oil Change',
    'Engine Diagnostic',
    'AC Service',
    'Suspension Check'
  ];

  const defaultAds = [
    {
      title: "Premium Tire Change",
      price: "$79.99",
      image: "default_image_url",
      rating: 4.7
    },
    {
      title: "Full Wheel Alignment",
      price: "$129.99",
      image: "default_image_url",
      rating: 4.6
    },
    {
      title: "Brake Service Special",
      price: "$149.99",
      image: "default_image_url",
      rating: 4.8
    },
    {
      title: "TPMS Diagnostic",
      price: "$39.99",
      image: "default_image_url",
      rating: 4.5
    },
    {
      title: "Wheel Balancing",
      price: "$59.99",
      image: "default_image_url",
      rating: 4.9
    },
    {
      title: "Tire Rotation",
      price: "$45.99",
      image: "default_image_url",
      rating: 4.7
    }
  ];

  return (
    <SafeAreaView style={authStyles.container}>
      <View style={authStyles.formContainer}>
        <Text style={authStyles.title}>Create Account</Text>
        
        <TextInput 
          style={[authStyles.input, emailError && { borderColor: '#FF0000' }]}
          placeholder="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setEmailError('');
          }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {emailError ? <Text style={authStyles.errorText}>{emailError}</Text> : null}

        <View style={authStyles.inputContainer}>
          <TextInput 
            style={[authStyles.input, passwordError && { borderColor: '#FF0000' }]}
            placeholder="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError('');
            }}
            secureTextEntry={!showPassword}
            placeholderTextColor="#A3B18A"
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
          style={authStyles.button}
          onPress={handleSignup}
        >
          <Text style={authStyles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignupScreen;