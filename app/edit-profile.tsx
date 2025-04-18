import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import { useThemeStore } from '@/store/theme-store';
import colors from '@/constants/colors';
import Input from '@/components/Input';
import Button from '@/components/Button';
import TagInput from '@/components/TagInput';
import ImageUploader from '@/components/ImageUploader';
import { ArrowLeft, Save } from 'lucide-react-native';
import { User } from '@/types';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateProfile, isLoading } = useAuthStore();
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    bio: '',
    institution: '',
    subjects: [],
    interests: [],
    learningGoals: [],
    images: [],
    type: 'individual',
  });
  
  const [errors, setErrors] = useState({
    name: '',
    bio: '',
    institution: '',
  });
  
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        bio: user.bio,
        institution: user.institution,
        subjects: [...user.subjects],
        interests: [...user.interests],
        learningGoals: [...user.learningGoals],
        images: [...user.images],
        type: user.type,
      });
    }
  }, [user]);
  
  const handleChange = (field: keyof User, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user types
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };
  
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      bio: '',
      institution: '',
    };
    
    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    
    if (!formData.bio || formData.bio.trim() === '') {
      newErrors.bio = 'Bio is required';
      isValid = false;
    } else if (formData.bio.length > 300) {
      newErrors.bio = 'Bio must be less than 300 characters';
      isValid = false;
    }
    
    if (!formData.institution || formData.institution.trim() === '') {
      newErrors.institution = 'Institution is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSave = async () => {
    if (validateForm()) {
      try {
        await updateProfile(formData);
        Alert.alert('Success', 'Profile updated successfully');
        router.back();
      } catch (error) {
        Alert.alert('Error', 'Failed to update profile');
      }
    }
  };
  
  const handleBack = () => {
    router.back();
  };
  
  const handleAddImage = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), imageUrl]
    }));
  };
  
  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || []
    }));
  };
  
  if (!user) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" color={themeColors.primary} />
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen 
        options={{ 
          title: 'Edit Profile',
          headerShown: false
        }} 
      />
      
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBack}
          >
            <ArrowLeft size={24} color={themeColors.text} />
          </TouchableOpacity>
          
          <Text style={[styles.title, { color: themeColors.text }]}>
            Edit Profile
          </Text>
          
          <TouchableOpacity 
            style={[
              styles.saveButton, 
              { backgroundColor: themeColors.primary }
            ]} 
            onPress={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Save size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Profile Images
            </Text>
            <ImageUploader 
              images={formData.images || []}
              onAddImage={handleAddImage}
              onRemoveImage={handleRemoveImage}
              maxImages={5}
            />
          </View>
          
          <View style={styles.section}>
            <Input
              label="Name"
              placeholder="Your name or group name"
              value={formData.name}
              onChangeText={(text) => handleChange('name', text)}
              error={errors.name}
            />
            
            <Input
              label="Institution"
              placeholder="Your school, university, or organization"
              value={formData.institution}
              onChangeText={(text) => handleChange('institution', text)}
              error={errors.institution}
            />
            
            <Input
              label="Bio"
              placeholder="Tell others about yourself or your group"
              value={formData.bio}
              onChangeText={(text) => handleChange('bio', text)}
              error={errors.bio}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              containerStyle={styles.bioInputContainer}
              inputStyle={styles.bioInput}
            />
          </View>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Subjects
            </Text>
            <Text style={[styles.sectionSubtitle, { color: themeColors.subtext }]}>
              Add subjects you're studying or teaching
            </Text>
            <TagInput
              tags={formData.subjects || []}
              onChangeTags={(tags) => handleChange('subjects', tags)}
              placeholder="Add a subject"
              maxTags={10}
            />
          </View>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Interests
            </Text>
            <Text style={[styles.sectionSubtitle, { color: themeColors.subtext }]}>
              Add your academic or personal interests
            </Text>
            <TagInput
              tags={formData.interests || []}
              onChangeTags={(tags) => handleChange('interests', tags)}
              placeholder="Add an interest"
              maxTags={10}
            />
          </View>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Learning Goals
            </Text>
            <Text style={[styles.sectionSubtitle, { color: themeColors.subtext }]}>
              What do you want to achieve?
            </Text>
            <TagInput
              tags={formData.learningGoals || []}
              onChangeTags={(tags) => handleChange('learningGoals', tags)}
              placeholder="Add a learning goal"
              maxTags={5}
            />
          </View>
          
          <Button
            title="Save Changes"
            onPress={handleSave}
            loading={isLoading}
            style={styles.saveChangesButton}
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  bioInputContainer: {
    height: 120,
  },
  bioInput: {
    height: 100,
    paddingTop: 12,
  },
  saveChangesButton: {
    marginTop: 16,
  },
});