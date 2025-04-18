import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Switch, 
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { useThemeStore } from '@/store/theme-store';
import { useAuthStore } from '@/store/auth-store';
import colors from '@/constants/colors';
import { 
  Moon, 
  Bell, 
  Shield, 
  HelpCircle, 
  Info, 
  ChevronRight,
  Trash
} from 'lucide-react-native';

export default function SettingsScreen() {
  const { theme, toggleTheme } = useThemeStore();
  const { logout } = useAuthStore();
  const themeColors = colors[theme];
  
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            // In a real app, this would call an API to delete the account
            Alert.alert('Account Deleted', 'Your account has been deleted.');
            logout();
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: themeColors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
        Appearance
      </Text>
      
      <View style={[styles.settingItem, { borderColor: themeColors.border }]}>
        <View style={styles.settingLeft}>
          <Moon size={20} color={themeColors.text} />
          <Text style={[styles.settingText, { color: themeColors.text }]}>
            Dark Mode
          </Text>
        </View>
        <Switch
          value={theme === 'dark'}
          onValueChange={toggleTheme}
          trackColor={{ false: '#767577', true: themeColors.primary }}
          thumbColor="#FFFFFF"
        />
      </View>
      
      <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
        Notifications
      </Text>
      
      <View style={[styles.settingItem, { borderColor: themeColors.border }]}>
        <View style={styles.settingLeft}>
          <Bell size={20} color={themeColors.text} />
          <Text style={[styles.settingText, { color: themeColors.text }]}>
            Push Notifications
          </Text>
        </View>
        <Switch
          value={true}
          trackColor={{ false: '#767577', true: themeColors.primary }}
          thumbColor="#FFFFFF"
        />
      </View>
      
      <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
        Privacy & Security
      </Text>
      
      <TouchableOpacity style={[styles.settingItem, { borderColor: themeColors.border }]}>
        <View style={styles.settingLeft}>
          <Shield size={20} color={themeColors.text} />
          <Text style={[styles.settingText, { color: themeColors.text }]}>
            Privacy Settings
          </Text>
        </View>
        <ChevronRight size={20} color={themeColors.subtext} />
      </TouchableOpacity>
      
      <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
        Support
      </Text>
      
      <TouchableOpacity style={[styles.settingItem, { borderColor: themeColors.border }]}>
        <View style={styles.settingLeft}>
          <HelpCircle size={20} color={themeColors.text} />
          <Text style={[styles.settingText, { color: themeColors.text }]}>
            Help Center
          </Text>
        </View>
        <ChevronRight size={20} color={themeColors.subtext} />
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.settingItem, { borderColor: themeColors.border }]}>
        <View style={styles.settingLeft}>
          <Info size={20} color={themeColors.text} />
          <Text style={[styles.settingText, { color: themeColors.text }]}>
            About StudyMatch
          </Text>
        </View>
        <ChevronRight size={20} color={themeColors.subtext} />
      </TouchableOpacity>
      
      <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
        Account
      </Text>
      
      <TouchableOpacity 
        style={[styles.settingItem, { borderColor: themeColors.border }]}
        onPress={handleDeleteAccount}
      >
        <View style={styles.settingLeft}>
          <Trash size={20} color={themeColors.error} />
          <Text style={[styles.settingText, { color: themeColors.error }]}>
            Delete Account
          </Text>
        </View>
      </TouchableOpacity>
      
      <Text style={[styles.version, { color: themeColors.subtext }]}>
        Version 1.0.0
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    marginTop: 24,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
  },
  version: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 32,
  },
});