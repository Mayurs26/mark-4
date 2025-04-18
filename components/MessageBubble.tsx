import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '@/types';
import { useThemeStore } from '@/store/theme-store';
import colors from '@/constants/colors';
import { format } from '@/utils/date';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

export default function MessageBubble({ message, isCurrentUser }: MessageBubbleProps) {
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  
  return (
    <View style={[
      styles.container,
      isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer
    ]}>
      <View style={[
        styles.bubble,
        isCurrentUser 
          ? [styles.currentUserBubble, { backgroundColor: themeColors.primary }]
          : [styles.otherUserBubble, { 
              backgroundColor: theme === 'dark' ? '#2C2C2E' : '#F0F0F5',
              borderColor: theme === 'dark' ? '#3C3C3E' : '#E4E4E8'
            }]
      ]}>
        <Text style={[
          styles.text,
          { color: isCurrentUser ? '#FFFFFF' : themeColors.text }
        ]}>
          {message.text}
        </Text>
      </View>
      
      <Text style={[
        styles.timestamp,
        { color: themeColors.subtext }
      ]}>
        {format(message.timestamp)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  currentUserContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  otherUserContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  currentUserBubble: {
    borderBottomRightRadius: 4,
  },
  otherUserBubble: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
  },
});