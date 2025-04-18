import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { useThemeStore } from '@/store/theme-store';
import colors from '@/constants/colors';
import { X, Plus } from 'lucide-react-native';

interface TagInputProps {
  tags: string[];
  onChangeTags: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

export default function TagInput({ 
  tags, 
  onChangeTags, 
  placeholder = "Add tag", 
  maxTags = 10 
}: TagInputProps) {
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  
  const [inputValue, setInputValue] = useState('');
  
  const handleAddTag = () => {
    if (inputValue.trim() && tags.length < maxTags) {
      // Check if tag already exists
      if (!tags.includes(inputValue.trim())) {
        onChangeTags([...tags, inputValue.trim()]);
      }
      setInputValue('');
    }
  };
  
  const handleRemoveTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    onChangeTags(newTags);
  };
  
  const renderTags = () => {
    // Use a regular ScrollView with flexWrap instead of FlatList
    return tags.map((item, index) => (
      <View 
        key={`${item}-${index}`}
        style={[
          styles.tag, 
          { backgroundColor: theme === 'dark' ? '#2C2C2E' : '#F0F0F5' }
        ]}
      >
        <Text style={[styles.tagText, { color: themeColors.text }]}>
          {item}
        </Text>
        <TouchableOpacity 
          style={styles.removeButton} 
          onPress={() => handleRemoveTag(index)}
        >
          <X size={14} color={themeColors.subtext} />
        </TouchableOpacity>
      </View>
    ));
  };
  
  return (
    <View style={styles.container}>
      <View style={[
        styles.inputContainer,
        { 
          borderColor: themeColors.border,
          backgroundColor: theme === 'dark' ? themeColors.card : '#F8F9FA'
        }
      ]}>
        <TextInput
          style={[styles.input, { color: themeColors.text }]}
          placeholder={placeholder}
          placeholderTextColor={themeColors.subtext}
          value={inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={handleAddTag}
          returnKeyType="done"
        />
        <TouchableOpacity 
          style={[
            styles.addButton, 
            { 
              backgroundColor: inputValue.trim() ? themeColors.primary : themeColors.inactive,
              opacity: tags.length >= maxTags ? 0.5 : 1
            }
          ]} 
          onPress={handleAddTag}
          disabled={!inputValue.trim() || tags.length >= maxTags}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      {tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {renderTags()}
        </View>
      )}
      
      {tags.length >= maxTags && (
        <Text style={[styles.maxTagsText, { color: themeColors.subtext }]}>
          Maximum of {maxTags} tags reached
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    marginRight: 8,
  },
  removeButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  maxTagsText: {
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
});