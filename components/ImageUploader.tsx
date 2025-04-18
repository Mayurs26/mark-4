import React from 'react';
import * as ImagePicker from 'expo-image-picker';
// Add this at the top with other imports
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  Alert
} from 'react-native';
import { useThemeStore } from '@/store/theme-store';
import colors from '@/constants/colors';
import { Plus, X } from 'lucide-react-native';

// Sample images for demo purposes
const sampleImages = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
];

interface ImageUploaderProps {
  images: string[];
  onAddImage: (imageUrl: string) => void;
  onRemoveImage: (index: number) => void;
  maxImages?: number;
}

export default function ImageUploader({ 
  images, 
  onAddImage, 
  onRemoveImage,
  maxImages = 5
}: ImageUploaderProps) {
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  
  const handleAddImage = async () => {
    if (images.length >= maxImages) {
      Alert.alert('Maximum Images', `You can only add up to ${maxImages} images.`);
      return;
    }
  
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'You need to allow access to your media library to upload images.');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
      base64: false,
    });
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      onAddImage(uri);
    }
  };
  
  
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {images.map((image, index) => (
          <View key={`${image}-${index}`} style={styles.imageContainer}>
            <Image 
              source={{ uri: image }} 
              style={styles.image}
            />
            <TouchableOpacity 
              style={[styles.removeButton, { backgroundColor: themeColors.error }]} 
              onPress={() => onRemoveImage(index)}
            >
              <X size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ))}
        
        {images.length < maxImages && (
          <TouchableOpacity 
            style={[
              styles.addButton, 
              { 
                borderColor: themeColors.border,
                backgroundColor: theme === 'dark' ? themeColors.card : '#F8F9FA'
              }
            ]} 
            onPress={handleAddImage}
          >
            <Plus size={24} color={themeColors.primary} />
            <Text style={[styles.addButtonText, { color: themeColors.primary }]}>
              Add Photo
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      
      <Text style={[styles.imageCount, { color: themeColors.subtext }]}>
        {images.length} of {maxImages} images
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  scrollContent: {
    paddingVertical: 8,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  imageCount: {
    fontSize: 12,
    marginTop: 8,
  },
});