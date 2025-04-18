import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter, useRootNavigationState  } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import Button from '@/components/Button';
import { useThemeStore } from '@/store/theme-store';
import colors from '@/constants/colors';
import { Users } from 'lucide-react-native';

export default function WelcomeScreen() {
  const router = useRouter();
  const rootNavigation = useRootNavigationState();
  const { isAuthenticated } = useAuthStore();
  const { theme } = useThemeStore();
  const themeColors = colors[theme];

  useEffect(() => {
    if (!rootNavigation?.key) return;
  
    const timeout = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      }
    }, 1000); // Delay to show Welcome screen briefly
  
    return () => clearTimeout(timeout);
  }, [rootNavigation?.key, isAuthenticated]);
  

  const handleLogin = () => {
    router.push('/login');
  };

  const handleSignup = () => {
    router.push('/signup');
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.logoContainer}>
        <View style={[styles.logoBackground, { backgroundColor: themeColors.primary }]}>
          <Users size={48} color="#FFFFFF" />
        </View>
        <Text style={[styles.appName, { color: themeColors.text }]}>StudyMatch</Text>
        <Text style={[styles.tagline, { color: themeColors.subtext }]}>
          Find your perfect study partner
        </Text>
      </View>

      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.featuresContainer}>
        <View style={styles.featureItem}>
          <View style={[styles.featureIcon, { backgroundColor: themeColors.primary }]}>
            <Text style={styles.featureIconText}>1</Text>
          </View>
          <View style={styles.featureTextContainer}>
            <Text style={[styles.featureTitle, { color: themeColors.text }]}>
              Create Your Profile
            </Text>
            <Text style={[styles.featureDescription, { color: themeColors.subtext }]}>
              Set up as an individual or group
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <View style={[styles.featureIcon, { backgroundColor: themeColors.secondary }]}>
            <Text style={styles.featureIconText}>2</Text>
          </View>
          <View style={styles.featureTextContainer}>
            <Text style={[styles.featureTitle, { color: themeColors.text }]}>
              Match with Others
            </Text>
            <Text style={[styles.featureDescription, { color: themeColors.subtext }]}>
              Swipe to find your study partners
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <View style={[styles.featureIcon, { backgroundColor: themeColors.primary }]}>
            <Text style={styles.featureIconText}>3</Text>
          </View>
          <View style={styles.featureTextContainer}>
            <Text style={[styles.featureTitle, { color: themeColors.text }]}>
              Connect & Collaborate
            </Text>
            <Text style={[styles.featureDescription, { color: themeColors.subtext }]}>
              Chat and organize study sessions
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <Button 
          title="Log In" 
          onPress={handleLogin} 
          variant="outline"
          style={styles.button}
        />
        <Button 
          title="Sign Up" 
          onPress={handleSignup} 
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 48,
    marginBottom: 24,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
  },
  imageContainer: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 32,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  featuresContainer: {
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureIconText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
  },
  buttonsContainer: {
    marginTop: 'auto',
    gap: 16,
  },
  button: {
    width: '100%',
  },
});
