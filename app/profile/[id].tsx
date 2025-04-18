import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import colors from '@/constants/colors';
import {
  School,
  BookOpen,
  Heart,
  Target,
  Users,
} from 'lucide-react-native';
import { mockUsers } from '@/mocks/users';
import Button from '@/components/Button';
import { User } from '@/types';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useThemeStore();
  const themeColors = colors[theme];

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      setTimeout(() => {
        const foundUser = mockUsers.find((u) => u.id === id);
        if (foundUser) {
          setUser(foundUser);
        }
        setIsLoading(false);
      }, 500);
    }
  }, [id]);

  const handleMessage = () => {
    router.push(`/chat/c${id}?userId=${id}`);
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" color={themeColors.primary} />
        <Text style={[styles.loadingText, { color: themeColors.text }]}>Loading profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.errorText, { color: themeColors.text }]}>User not found</Text>
        <Button title="Go Back" onPress={() => router.back()} style={styles.backButton} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: themeColors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Stack.Screen options={{ title: user.name, headerBackTitle: 'Back' }} />

      <View style={styles.header}>
        {Array.isArray(user.images) && user.images[0] ? (
          <Image source={{ uri: user.images[0] }} style={styles.profileImage} resizeMode="cover" />
        ) : (
          <View style={[styles.profileImage, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>No image</Text>
          </View>
        )}

        <View style={styles.nameContainer}>
          <Text style={[styles.name, { color: themeColors.text }]}>{user.name}</Text>

          <View
            style={[
              styles.userType,
              {
                backgroundColor:
                  user.type === 'group' ? themeColors.secondary : themeColors.primary,
              },
            ]}
          >
            {user.type === 'group' ? <Users size={14} color="#FFFFFF" /> : null}
            <Text style={styles.userTypeText}>{user.type === 'group' ? 'Group' : 'Individual'}</Text>
          </View>
        </View>
      </View>

      <Button title="Message" onPress={handleMessage} style={styles.messageButton} />

      <View style={[styles.section, { borderColor: themeColors.border }]}>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Bio</Text>
        <Text style={[styles.bio, { color: themeColors.text }]}>
          {user.bio || 'No bio available.'}
        </Text>
      </View>

      <View style={[styles.section, { borderColor: themeColors.border }]}>
        <View style={styles.sectionHeader}>
          <School size={20} color={themeColors.primary} />
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Institution</Text>
        </View>
        <Text style={[styles.sectionContent, { color: themeColors.text }]}>
          {user.institution || 'Not specified'}
        </Text>
      </View>

      <View style={[styles.section, { borderColor: themeColors.border }]}>
        <View style={styles.sectionHeader}>
          <BookOpen size={20} color={themeColors.primary} />
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Subjects</Text>
        </View>
        <View style={styles.tagsContainer}>
          {user.subjects && user.subjects.length > 0 ? (
            user.subjects.map((subject, index) => (
              <View
                key={index}
                style={[
                  styles.tag,
                  { backgroundColor: theme === 'dark' ? '#2C2C2E' : '#F0F0F5' },
                ]}
              >
                <Text style={[styles.tagText, { color: themeColors.text }]}>{subject}</Text>
              </View>
            ))
          ) : (
            <Text style={[styles.emptyText, { color: themeColors.subtext }]}>No subjects listed</Text>
          )}
        </View>
      </View>

      <View style={[styles.section, { borderColor: themeColors.border }]}>
        <View style={styles.sectionHeader}>
          <Heart size={20} color={themeColors.primary} />
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Interests</Text>
        </View>
        <View style={styles.tagsContainer}>
          {user.interests && user.interests.length > 0 ? (
            user.interests.map((interest, index) => (
              <View
                key={index}
                style={[
                  styles.tag,
                  { backgroundColor: theme === 'dark' ? '#2C2C2E' : '#F0F0F5' },
                ]}
              >
                <Text style={[styles.tagText, { color: themeColors.text }]}>{interest}</Text>
              </View>
            ))
          ) : (
            <Text style={[styles.emptyText, { color: themeColors.subtext }]}>
              No interests listed
            </Text>
          )}
        </View>
      </View>

      <View style={[styles.section, { borderColor: themeColors.border }]}>
        <View style={styles.sectionHeader}>
          <Target size={20} color={themeColors.primary} />
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Learning Goals</Text>
        </View>
        <View style={styles.tagsContainer}>
          {user.learningGoals && user.learningGoals.length > 0 ? (
            user.learningGoals.map((goal, index) => (
              <View
                key={index}
                style={[
                  styles.tag,
                  { backgroundColor: theme === 'dark' ? '#2C2C2E' : '#F0F0F5' },
                ]}
              >
                <Text style={[styles.tagText, { color: themeColors.text }]}>{goal}</Text>
              </View>
            ))
          ) : (
            <Text style={[styles.emptyText, { color: themeColors.subtext }]}>
              No learning goals listed
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 16,
  },
  backButton: {
    width: 120,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  placeholderImage: {
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 6,
  },
  nameContainer: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  userType: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
    gap: 4,
  },
  userTypeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  messageButton: {
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  section: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  bio: {
    fontSize: 16,
    lineHeight: 24,
  },
  sectionContent: {
    fontSize: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});
