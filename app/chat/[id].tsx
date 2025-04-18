import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import { useChatStore } from '@/store/chat-store';
import { useThemeStore } from '@/store/theme-store';
import colors from '@/constants/colors';
import MessageBubble from '@/components/MessageBubble';
import { Send } from 'lucide-react-native';
import { mockUsers } from '@/mocks/users';
import { User } from '@/types';

export default function ChatScreen() {
  const { id, userId } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { messages, loadMessages, sendMessage, markAsRead, isLoading } = useChatStore();
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  
  const [text, setText] = useState('');
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const flatListRef = useRef<FlatList | null>(null);
  
  useEffect(() => {
    if (id) {
      loadMessages(id as string);
      markAsRead(id as string);
    }
    
    if (userId) {
      const foundUser = mockUsers.find(u => u.id === userId);
      if (foundUser) {
        setOtherUser(foundUser);
      }
    }
  }, [id, userId]);
  
  const handleSend = () => {
    if (!text.trim() || !user || !id) return;
    
    sendMessage(id as string, user.id, text);
    setText('');
    
    // Scroll to bottom after sending
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };
  
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" color={themeColors.primary} />
        <Text style={[styles.loadingText, { color: themeColors.text }]}>
          Loading messages...
        </Text>
      </View>
    );
  }
  
  const conversationMessages = messages[id as string] || [];
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Stack.Screen 
        options={{ 
          title: otherUser?.name || 'Chat',
          headerBackTitle: 'Back',
        }} 
      />
      
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        {conversationMessages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: themeColors.subtext }]}>
              No messages yet. Say hello!
            </Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={conversationMessages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MessageBubble
                message={item}
                isCurrentUser={item.senderId === user?.id}
              />
            )}
            contentContainerStyle={styles.messagesContainer}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
          />
        )}
        
        <View style={[
          styles.inputContainer, 
          { 
            backgroundColor: theme === 'dark' ? themeColors.card : '#F8F9FA',
            borderColor: themeColors.border
          }
        ]}>
          <TextInput
            style={[styles.input, { color: themeColors.text }]}
            placeholder="Type a message..."
            placeholderTextColor={themeColors.subtext}
            value={text}
            onChangeText={setText}
            multiline
          />
          
          <TouchableOpacity 
            style={[
              styles.sendButton, 
              { backgroundColor: text.trim() ? themeColors.primary : themeColors.inactive }
            ]} 
            onPress={handleSend}
            disabled={!text.trim()}
          >
            <Send size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  messagesContainer: {
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});