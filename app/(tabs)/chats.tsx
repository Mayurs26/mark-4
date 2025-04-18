import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import { useChatStore } from '@/store/chat-store';
import { useThemeStore } from '@/store/theme-store';
import { useNotificationStore } from '@/store/notification-store';
import colors from '@/constants/colors';
import UserItem from '@/components/UserItem';
import EmptyState from '@/components/EmptyState';
import { MessageCircle, Search } from 'lucide-react-native';
import { mockUsers } from '@/mocks/users';
import { Conversation, User } from '@/types';

export default function ChatsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { conversations, loadConversations, markAsRead, isLoading } = useChatStore();
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  
  useEffect(() => {
    if (user) {
      loadConversations(user.id);
    }
  }, [user]);
  
  useEffect(() => {
    filterConversations();
  }, [conversations, searchQuery]);
  
  const getOtherUser = (conversationId: string, otherUserId: string): User | undefined => {
    return mockUsers.find(u => u.id === otherUserId);
  };
  
  const getLastMessagePreview = (conversation: Conversation): string => {
    return conversation.lastMessage?.text || 'No messages yet';
  };
  
  const isUnread = (conversationId: string): boolean => {
    const conversation = conversations.find(c => c.id === conversationId);
    return conversation?.lastMessage ? !conversation.lastMessage.read : false;
  };
  
  const filterConversations = () => {
    if (!user) return;
    
    let filtered = [...conversations];
    
    if (searchQuery) {
      filtered = filtered.filter(conversation => {
        const otherUserId = conversation.participants.find(id => id !== user.id);
        if (!otherUserId) return false;
        
        const otherUser = getOtherUser(conversation.id, otherUserId);
        if (!otherUser) return false;
        
        return (
          otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          getLastMessagePreview(conversation).toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }
    
    setFilteredConversations(filtered);
  };
  
  const handleRefresh = async () => {
    if (user) {
      setRefreshing(true);
      await loadConversations(user.id);
      setRefreshing(false);
    }
  };
  
  const handleConversationPress = (conversationId: string, otherUserId: string) => {
    markAsRead(conversationId);
    router.push(`/chat/${conversationId}?userId=${otherUserId}`);
  };
  
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" color={themeColors.primary} />
        <Text style={[styles.loadingText, { color: themeColors.text }]}>
          Loading conversations...
        </Text>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>
          Chats
        </Text>
      </View>
      
      <View style={[
        styles.searchContainer, 
        { 
          backgroundColor: theme === 'dark' ? themeColors.card : '#F8F9FA',
          borderColor: themeColors.border
        }
      ]}>
        <Search size={20} color={themeColors.subtext} />
        <TextInput
          style={[styles.searchInput, { color: themeColors.text }]}
          placeholder="Search conversations..."
          placeholderTextColor={themeColors.subtext}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {filteredConversations.length === 0 ? (
        <EmptyState
          icon={<MessageCircle size={48} color={themeColors.primary} />}
          title={searchQuery ? "No conversations found" : "No conversations yet"}
          message={searchQuery 
            ? "Try adjusting your search"
            : "Match with other users to start chatting!"
          }
          buttonTitle="Find Matches"
          onButtonPress={() => router.push('/(tabs)')}
        />
      ) : (
        <FlatList
          data={filteredConversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            if (!user) return null;
            
            const otherUserId = item.participants.find(id => id !== user.id);
            if (!otherUserId) return null;
            
            const otherUser = getOtherUser(item.id, otherUserId);
            if (!otherUser) return null;
            
            return (
              <UserItem
                user={otherUser}
                onPress={() => handleConversationPress(item.id, otherUserId)}
                showLastMessage
                lastMessage={getLastMessagePreview(item)}
                unread={isUnread(item.id)}
              />
            );
          }}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[themeColors.primary]}
              tintColor={themeColors.primary}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
  listContent: {
    padding: 16,
  },
});