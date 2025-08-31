import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { authStyles } from "./styles/auth";
import { useState, useRef, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { verifyOTP, resendOTP } from './services/api';
import GridComponent from "./Gridcomponent";

const OTPScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { 
    email, 
    name, 
    phone
  } = params;

  console.log('OTP Screen Params:', params); // Debug log
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOtpChange = (text: string, index: number) => {
    if (text.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      setError('');

      // Move to next input if there's a value
      if (text.length === 1 && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      // If backspace is pressed on an empty input, focus previous input
      inputRefs.current[index - 1]?.focus();
    } else if (e.nativeEvent.key === 'Enter') {
      // If Enter is pressed and we have all 6 digits, verify OTP
      const otpValue = otp.join('');
      if (otpValue.length === 6) {
        handleVerifyOTP();
      }
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const otpValue = otp.join('');
      
      if (!otpValue || otpValue.length !== 6) {
        setError('Please enter the complete 6-digit OTP');
        return;
      }

      setIsLoading(true);
      setError('');

      // Call the verify OTP API
      await verifyOTP(email as string, otpValue);
      
      // Make sure to get all params from signup
      const initialUserData = {
        accountType: 'individual',
        email: email,
        name: name,
        phone: phone,
        profileImage: 'default_image_url',
        ads: [
          {
            title: "Individual Service",
            price: "$39.99",
            image: "default_image_url"
          }
        ]
      };

      console.log('Saving user data:', initialUserData); // Debug log
      
      // Save complete user data
      await AsyncStorage.setItem('userData', JSON.stringify(initialUserData));
      await AsyncStorage.setItem('lastLoginTime', Date.now().toString());
      
      // Navigate to home page
      router.replace('/');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError(error instanceof Error ? error.message : 'Error verifying OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setResendDisabled(true);
      setCountdown(60); // 60-second countdown
      await resendOTP(email as string);
      Alert.alert('Success', 'A new OTP has been sent to your email');
    } catch (error) {
      console.error('Error resending OTP:', error);
      setError(error instanceof Error ? error.message : 'Error resending OTP');
      setResendDisabled(false);
      setCountdown(0);
    }
  };

  return (
    <SafeAreaView style={authStyles.container}>
      <GridComponent />

      <View style={authStyles.formContainer}>
        <View style={authStyles.formBox}>
          <Text style={authStyles.title}>Verify Your Email</Text>
          <Text style={authStyles.subtitle}>
            Enter the 6-digit code sent to {email}
          </Text>

          <View style={authStyles.otpContainer}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[authStyles.otpInput, error && otp.join('').length !== 6 && { borderColor: '#FF0000' }]}
                maxLength={1}
                keyboardType="number-pad"
                value={otp[index]}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                returnKeyType={index === 5 ? "done" : "next"}
                onSubmitEditing={() => {
                  if (index === 5) {
                    const otpValue = otp.join('');
                    if (otpValue.length === 6) {
                      handleVerifyOTP();
                    }
                  } else if (index < 5 && otp[index]) {
                    inputRefs.current[index + 1]?.focus();
                  }
                }}
              />
            ))}
          </View>

          {error ? <Text style={authStyles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[authStyles.button, isLoading && authStyles.buttonDisabled]}
            onPress={handleVerifyOTP}
            disabled={isLoading}
          >
            <Text style={authStyles.buttonText}>
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Text>
          </TouchableOpacity>

          <View style={authStyles.resendContainer}>
            <Text style={authStyles.resendText}>Didn't receive the code? </Text>
            {countdown > 0 ? (
              <Text style={authStyles.resendTimer}>Resend in {countdown}s</Text>
            ) : (
              <TouchableOpacity 
                onPress={handleResendOTP} 
                disabled={resendDisabled}
              >
                <Text style={[authStyles.resendButton, resendDisabled && authStyles.disabledText]}>
                  Resend
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OTPScreen; 