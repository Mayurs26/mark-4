import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useThemeStore } from '@/store/theme-store';
import colors from '@/constants/colors';
import Button from './Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  message: string;
  buttonTitle?: string;
  onButtonPress?: () => void;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  messageStyle?: TextStyle;
}

export default function EmptyState({
  icon,
  title,
  message,
  buttonTitle,
  onButtonPress,
  containerStyle,
  titleStyle,
  messageStyle
}: EmptyStateProps) {
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.iconContainer, { backgroundColor: themeColors.primary + '20' }]}>
        {icon}
      </View>
      
      <Text style={[styles.title, { color: themeColors.text }, titleStyle]}>
        {title}
      </Text>
      
      <Text style={[styles.message, { color: themeColors.subtext }, messageStyle]}>
        {message}
      </Text>
      
      {buttonTitle && onButtonPress && (
        <Button
          title={buttonTitle}
          onPress={onButtonPress}
          style={styles.button}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    maxWidth: '80%',
    marginBottom: 24,
  },
  button: {
    minWidth: 150,
  },
});