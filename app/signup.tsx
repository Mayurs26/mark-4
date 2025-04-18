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
import { ArrowLeft, Users, User } from 'lucide-react-native';
import { UserType } from '@/types';

export default function SignupScreen() {
  const router = useRouter();
  const { signup, isLoading, error } = useAuthStore();
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<UserType>('individual');
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const validateForm = () => {
    let isValid = true;
    const errors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
    
    // Validate name
    if (!name) {
      errors.name = 'Name is required';
      isValid = false;
    }
    
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
    
    // Validate confirm password
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (confirmPassword !== password) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  const handleSignup = async () => {
    if (validateForm()) {
      await signup({
        name,
        email,
        type: userType,
        bio: '',
        institution: '',
        subjects: [],
        interests: [],
        learningGoals: [],
        images: [],
      });
    }
  };
  
  const handleLogin = () => {
    router.push('/login');
  };
  
  const handleBack = () => {
    router.back();
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
          <Text style={[styles.title, { color: themeColors.text }]}>Create account</Text>
          <Text style={[styles.subtitle, { color: themeColors.subtext }]}>
            Join StudyBuddy to find your study partners
          </Text>
        </View>
        
        <View style={styles.formContainer}>
          {error && (
            <View style={[styles.errorContainer, { backgroundColor: themeColors.error + '20' }]}>
              <Text style={[styles.errorText, { color: themeColors.error }]}>{error}</Text>
            </View>
          )}
          
          <View style={styles.userTypeContainer}>
            <Text style={[styles.userTypeLabel, { color: themeColors.text }]}>
              I am joining as:
            </Text>
            
            <View style={styles.userTypeButtons}>
              <TouchableOpacity 
                style={[
                  styles.userTypeButton,
                  userType === 'individual' && [
                    styles.userTypeButtonActive,
                    { borderColor: themeColors.primary }
                  ]
                ]}
                onPress={() => setUserType('individual')}
              >
                <User 
                  size={24} 
                  color={userType === 'individual' ? themeColors.primary : themeColors.subtext} 
                />
                <Text style={[
                  styles.userTypeButtonText,
                  { color: userType === 'individual' ? themeColors.primary : themeColors.subtext }
                ]}>
                  Individual
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.userTypeButton,
                  userType === 'group' && [
                    styles.userTypeButtonActive,
                    { borderColor: themeColors.primary }
                  ]
                ]}
                onPress={() => setUserType('group')}
              >
                <Users 
                  size={24} 
                  color={userType === 'group' ? themeColors.primary : themeColors.subtext} 
                />
                <Text style={[
                  styles.userTypeButtonText,
                  { color: userType === 'group' ? themeColors.primary : themeColors.subtext }
                ]}>
                  Group
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <Input
            label={userType === 'individual' ? "Full Name" : "Group Name"}
            placeholder={userType === 'individual' ? "Enter your name" : "Enter group name"}
            value={name}
            onChangeText={setName}
            error={formErrors.name}
          />
          
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
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={formErrors.password}
          />
          
          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={formErrors.confirmPassword}
          />
          
          <Button
            title="Sign Up"
            onPress={handleSignup}
            loading={isLoading}
            style={styles.button}
          />
        </View>
        
        <View style={styles.footerContainer}>
          <Text style={[styles.footerText, { color: themeColors.subtext }]}>
            Already have an account?
          </Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={[styles.footerLink, { color: themeColors.primary }]}>
              Log in
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
  userTypeContainer: {
    marginBottom: 24,
  },
  userTypeLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  userTypeButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  userTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E4E8',
    gap: 8,
  },
  userTypeButtonActive: {
    borderWidth: 2,
  },
  userTypeButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  button: {
    marginTop: 16,
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