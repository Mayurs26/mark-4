import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  TextInputProps,
  StyleProp,
  ViewStyle,
  TextStyle
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useThemeStore } from '@/store/theme-store';
import colors from '@/constants/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  secureTextEntry,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  icon,
  ...props
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[
          styles.label, 
          { color: themeColors.text }, 
          labelStyle
        ]}>
          {label}
        </Text>
      )}
      
      <View style={[
        styles.inputContainer,
        { 
          borderColor: error ? themeColors.error : themeColors.border,
          backgroundColor: theme === 'dark' ? themeColors.card : '#F8F9FA'
        }
      ]}>
        {icon && (
          <View style={styles.iconContainer}>
            {icon}
          </View>
        )}
        
        <TextInput
          style={[
            styles.input,
            { color: themeColors.text },
            inputStyle
          ]}
          placeholderTextColor={themeColors.subtext}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity 
            style={styles.eyeIcon}
            onPress={togglePasswordVisibility}
          >
            {isPasswordVisible ? (
              <EyeOff size={20} color={themeColors.subtext} />
            ) : (
              <Eye size={20} color={themeColors.subtext} />
            )}
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={[
          styles.error, 
          { color: themeColors.error },
          errorStyle
        ]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  iconContainer: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 8,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
});