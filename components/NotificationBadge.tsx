import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeStore } from '@/store/theme-store';
import colors from '@/constants/colors';

interface NotificationBadgeProps {
  count: number;
  size?: 'small' | 'medium' | 'large';
}

export default function NotificationBadge({ count, size = 'medium' }: NotificationBadgeProps) {
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  
  if (count <= 0) return null;
  
  const getBadgeSize = () => {
    switch (size) {
      case 'small':
        return { width: 16, height: 16, fontSize: 10 };
      case 'medium':
        return { width: 20, height: 20, fontSize: 12 };
      case 'large':
        return { width: 24, height: 24, fontSize: 14 };
      default:
        return { width: 20, height: 20, fontSize: 12 };
    }
  };
  
  const { width, height, fontSize } = getBadgeSize();
  
  return (
    <View 
      style={[
        styles.badge, 
        { 
          backgroundColor: themeColors.error,
          width,
          height,
          borderRadius: width / 2
        }
      ]}
    >
      <Text style={[styles.text, { fontSize }]}>
        {count > 99 ? '99+' : count}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -5,
    right: -5,
    zIndex: 10,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});