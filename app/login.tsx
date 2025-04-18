import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useThemeStore } from '@/store/theme-store';
import colors from '@/constants/colors';
import { ArrowLeft } from 'lucide-react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });
  
  const validateForm = () => {
    let isValid = true;
    const errors = {
      email: '',
      password: '',
    };
    
    // Validate email
    if (!email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }
    
    // Validate password
    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  const handleLogin = async () => {
    if (validateForm()) {
      await login(email, password);
    }
  };
  
  const handleSignup = () => {
    router.push('/signup');
  };
  
  const handleBack = () => {
    router.back();
  };
  
  // For demo purposes, let's add a quick login function
  const handleQuickLogin = async () => {
    await login('john@example.com', 'password123');
  };
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView 
        style={[styles.container, { backgroundColor: themeColors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBack}
        >
          <ArrowLeft size={24} color={themeColors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: themeColors.text }]}>Welcome back</Text>
          <Text style={[styles.subtitle, { color: themeColors.subtext }]}>
            Log in to continue to StudyMatch
          </Text>
        </View>
        
        <View style={styles.formContainer}>
          {error && (
            <View style={[styles.errorContainer, { backgroundColor: themeColors.error + '20' }]}>
              <Text style={[styles.errorText, { color: themeColors.error }]}>{error}</Text>
            </View>
          )}
          
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={formErrors.email}
          />
          
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={formErrors.password}
          />
          
          <TouchableOpacity style={styles.forgotPasswordContainer}>
            <Text style={[styles.forgotPasswordText, { color: themeColors.primary }]}>
              Forgot password?
            </Text>
          </TouchableOpacity>
          
          <Button
            title="Log In"
            onPress={handleLogin}
            loading={isLoading}
            style={styles.button}
          />
          
          {/* Quick login button for demo purposes */}
          <Button
            title="Quick Demo Login"
            onPress={handleQuickLogin}
            variant="secondary"
            style={styles.button}
          />
        </View>
        
        <View style={styles.footerContainer}>
          <Text style={[styles.footerText, { color: themeColors.subtext }]}>
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={handleSignup}>
            <Text style={[styles.footerLink, { color: themeColors.primary }]}>
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingTop: 48,
  },
  backButton: {
    marginBottom: 24,
  },
  headerContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  formContainer: {
    marginBottom: 32,
  },
  errorContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    marginBottom: 16,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  footerText: {
    fontSize: 14,
    marginRight: 4,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});