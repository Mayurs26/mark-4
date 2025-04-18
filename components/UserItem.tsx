import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity 
} from 'react-native';
import { User } from '@/types';
import { useThemeStore } from '@/store/theme-store';
import colors from '@/constants/colors';
import { Users } from 'lucide-react-native';

interface UserItemProps {
  user: User;
  onPress: () => void;
  showLastMessage?: boolean;
  lastMessage?: string;
  unread?: boolean;
}

export default function UserItem({ 
  user, 
  onPress, 
  showLastMessage = false,
  lastMessage,
  unread = false
}: UserItemProps) {
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        { backgroundColor: unread ? (theme === 'dark' ? '#1E1E2D' : '#F0F0F5') : 'transparent' }
      ]} 
      onPress={onPress}
    >
      <View style={styles.avatarContainer}>
        <Image 
          source={{ uri: user.images[0] }} 
          style={styles.avatar}
        />
        {user.type === 'group' && (
          <View style={[styles.badge, { backgroundColor: themeColors.secondary }]}>
            <Users size={12} color="#FFFFFF" />
          </View>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <Text style={[styles.name, { color: themeColors.text }]} numberOfLines={1}>
            {user.name}
          </Text>
          <Text style={[styles.institution, { color: themeColors.subtext }]} numberOfLines={1}>
            {user.institution}
          </Text>
        </View>
        
        {showLastMessage && lastMessage ? (
          <Text 
            style={[
              styles.message, 
              { color: unread ? themeColors.primary : themeColors.subtext },
              unread && styles.unreadMessage
            ]} 
            numberOfLines={1}
          >
            {lastMessage}
          </Text>
        ) : (
          <Text style={[styles.subjects, { color: themeColors.subtext }]} numberOfLines={1}>
            {user.subjects.slice(0, 2).join(', ')}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  institution: {
    fontSize: 12,
  },
  subjects: {
    fontSize: 14,
  },
  message: {
    fontSize: 14,
  },
  unreadMessage: {
    fontWeight: '600',
  },
});