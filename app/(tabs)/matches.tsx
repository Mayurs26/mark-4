import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import { useMatchStore } from '@/store/match-store';
import { useThemeStore } from '@/store/theme-store';
import colors from '@/constants/colors';
import UserItem from '@/components/UserItem';
import EmptyState from '@/components/EmptyState';
import { Users, Search, Filter } from 'lucide-react-native';
import { User } from '@/types';
import FilterModal, { FilterOptions } from '@/components/FilterModal';

export default function MatchesScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { getMatchedUsers, isLoading } = useMatchStore();
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  
  const [matchedUsers, setMatchedUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  
  // Filter options
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    userTypes: {
      individuals: true,
      groups: true,
    },
    subjects: [
      'Computer Science',
      'Mathematics',
      'Physics',
      'Biology',
      'Chemistry',
      'Engineering',
      'Business',
      'Psychology',
      'Medicine',
      'Art',
      'Music',
      'Literature',
      'History',
      'Philosophy',
      'Economics',
      'Law',
    ],
    selectedSubjects: [],
  });
  
  useEffect(() => {
    if (user) {
      loadMatches();
    }
  }, [user]);
  
  useEffect(() => {
    filterUsers();
  }, [matchedUsers, searchQuery, filterOptions]);
  
  const loadMatches = () => {
    if (user) {
      const users = getMatchedUsers(user.id);
      setMatchedUsers(users);
    }
  };
  
  const filterUsers = () => {
    let filtered = [...matchedUsers];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        user => 
          user.name.toLowerCase().includes(query) ||
          user.institution.toLowerCase().includes(query) ||
          user.subjects.some(subject => subject.toLowerCase().includes(query))
      );
    }
    
    // Filter by user type
    if (!filterOptions.userTypes.individuals) {
      filtered = filtered.filter(user => user.type !== 'individual');
    }
    
    if (!filterOptions.userTypes.groups) {
      filtered = filtered.filter(user => user.type !== 'group');
    }
    
    // Filter by subjects
    if (filterOptions.selectedSubjects.length > 0) {
      filtered = filtered.filter(user => 
        user.subjects.some(subject => 
          filterOptions.selectedSubjects.includes(subject)
        )
      );
    }
    
    setFilteredUsers(filtered);
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    loadMatches();
    setRefreshing(false);
  };
  
  const handleUserPress = (userId: string) => {
    router.push(`/profile/${userId}`);
  };
  
  const handleApplyFilters = (options: FilterOptions) => {
    setFilterOptions(options);
  };
  
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" color={themeColors.primary} />
        <Text style={[styles.loadingText, { color: themeColors.text }]}>
          Loading matches...
        </Text>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>
          Matches
        </Text>
        
        <TouchableOpacity 
          style={[styles.filterButton, { backgroundColor: themeColors.card }]}
          onPress={() => setFilterModalVisible(true)}
        >
          <Filter size={20} color={themeColors.text} />
        </TouchableOpacity>
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
          placeholder="Search matches..."
          placeholderTextColor={themeColors.subtext}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {filteredUsers.length === 0 ? (
        <EmptyState
          icon={<Users size={48} color={themeColors.primary} />}
          title={searchQuery ? "No matches found" : "No matches yet"}
          message={searchQuery 
            ? "Try adjusting your search or filters"
            : "Start swiping to find your study partners!"
          }
          buttonTitle="Discover Users"
          onButtonPress={() => router.push('/(tabs)')}
        />
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <UserItem
              user={item}
              onPress={() => handleUserPress(item.id)}
            />
          )}
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
      
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        options={filterOptions}
        onApplyFilters={handleApplyFilters}
      />
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
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
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