import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import { useThemeStore } from '@/store/theme-store';
import colors from '@/constants/colors';
import Button from '@/components/Button';
import {
  Edit,
  LogOut,
  School,
  BookOpen,
  Heart,
  Target,
  Users,
} from 'lucide-react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { theme } = useThemeStore();
  const themeColors = colors[theme];

  const handleLogout = () => {
    const doLogout = async () => {
      try {
        await logout();
        setTimeout(() => {
          router.replace('/login'); // Update path if your login screen is elsewhere
        }, 100);
      } catch (err) {
        console.error('Logout error:', err);
      }
    };

    if (Platform.OS === 'web') {
      const confirm = window.confirm('Are you sure you want to logout?');
      if (confirm) doLogout();
    } else {
      Alert.alert(
        'Logout',
        'Are you sure you want to logout? This will delete your profile data from this device.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: doLogout,
          },
        ]
      );
    }
  };

  const handleEdit = () => {
    router.push('/edit-profile');
  };

  if (!user) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.loadingText, { color: themeColors.text }]}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: themeColors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Profile Header */}
      <View style={[styles.card, { backgroundColor: themeColors.card }]}>
      <View style={styles.header}>
        {Array.isArray(user.images) && user.images[0] ? (
          <Image
            source={{ uri: user.images[0] }}
            style={styles.profileImage}
            resizeMode="cover"
          />
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
              {user.type === 'group' && <Users size={14} color="#fff" />}
              <Text style={styles.userTypeText}>
                {user.type === 'group' ? 'Group' : 'Individual'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: themeColors.primary }]}
            onPress={handleEdit}
          >
            <Edit size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bio */}
      <View style={[styles.card, { backgroundColor: themeColors.card }]}>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Bio</Text>
        <Text style={[styles.sectionContent, { color: themeColors.subtext }]}>
          {user.bio || 'No bio yet. Tap the edit button to add one!'}
        </Text>
      </View>

      {/* Institution */}
      <View style={[styles.card, { backgroundColor: themeColors.card }]}>
        <View style={styles.sectionHeader}>
          <School size={20} color={themeColors.primary} />
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Institution</Text>
        </View>
        <Text style={[styles.sectionContent, { color: themeColors.subtext }]}>
          {user.institution || 'Not specified'}
        </Text>
      </View>

      {/* Subjects */}
      <View style={[styles.card, { backgroundColor: themeColors.card }]}>
        <View style={styles.sectionHeader}>
          <BookOpen size={20} color={themeColors.primary} />
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Subjects</Text>
        </View>
        <View style={styles.tagsContainer}>
          {user.subjects?.length ? (
            user.subjects.map((subject, idx) => (
              <View key={idx} style={[styles.tag, { backgroundColor: themeColors.secondary }]}>
                <Text style={[styles.tagText, { color: '#fff' }]}>{subject}</Text>
              </View>
            ))
          ) : (
            <Text style={[styles.emptyText, { color: themeColors.subtext }]}>No subjects added</Text>
          )}
        </View>
      </View>

      {/* Interests */}
      <View style={[styles.card, { backgroundColor: themeColors.card }]}>
        <View style={styles.sectionHeader}>
          <Heart size={20} color={themeColors.primary} />
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Interests</Text>
        </View>
        <View style={styles.tagsContainer}>
          {user.interests?.length ? (
            user.interests.map((interest, idx) => (
              <View key={idx} style={[styles.tag, { backgroundColor: themeColors.primary }]}>
                <Text style={[styles.tagText, { color: '#fff' }]}>{interest}</Text>
              </View>
            ))
          ) : (
            <Text style={[styles.emptyText, { color: themeColors.subtext }]}>No interests added</Text>
          )}
        </View>
      </View>

      {/* Learning Goals */}
      <View style={[styles.card, { backgroundColor: themeColors.card }]}>
        <View style={styles.sectionHeader}>
          <Target size={20} color={themeColors.primary} />
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Learning Goals</Text>
        </View>
        <View style={styles.tagsContainer}>
          {user.learningGoals?.length ? (
            user.learningGoals.map((goal, idx) => (
              <View key={idx} style={[styles.tag, { backgroundColor: themeColors.secondary }]}>
                <Text style={[styles.tagText, { color: '#fff' }]}>{goal}</Text>
              </View>
            ))
          ) : (
            <Text style={[styles.emptyText, { color: themeColors.subtext }]}>
              No learning goals added
            </Text>
          )}
        </View>
      </View>

      {/* Logout Button */}
      <View style={{ marginTop: 16 }}>
        <Button title="Logout" onPress={handleLogout} variant="outline" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 22,
    fontWeight: '700',
  },
  userType: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  userTypeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  editButton: {
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});
