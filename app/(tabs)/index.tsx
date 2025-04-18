import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Text,
  Animated,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import { useMatchStore } from '@/store/match-store';
import { useThemeStore } from '@/store/theme-store';
import { useNotificationStore } from '@/store/notification-store';
import colors from '@/constants/colors';
import Card from '@/components/Card';
import EmptyState from '@/components/EmptyState';
import FilterModal, { FilterOptions } from '@/components/FilterModal';
import { Search, Filter, Users } from 'lucide-react-native';
import { User } from '@/types';

export default function DiscoverScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { potentialMatches, loadPotentialMatches, swipeLeft, swipeRight, isLoading } = useMatchStore();
  const { theme } = useThemeStore();
  const { addNotification } = useNotificationStore();
  const themeColors = colors[theme];
  
  const [refreshing, setRefreshing] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filteredMatches, setFilteredMatches] = useState<User[]>([]);
  
  // Animation for empty state
  const emptyOpacity = useRef(new Animated.Value(0)).current;
  
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
      loadPotentialMatches(user.id);
    }
  }, [user]);
  
  useEffect(() => {
    applyFilters();
  }, [potentialMatches, filterOptions]);
  
  useEffect(() => {
    // Animate empty state appearance
    if (filteredMatches.length === 0 && !isLoading) {
      Animated.timing(emptyOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    } else {
      emptyOpacity.setValue(0);
    }
  }, [filteredMatches, isLoading]);
  
  const applyFilters = () => {
    let filtered = [...potentialMatches];
    
    // Filter by user type
    if (!filterOptions.userTypes.individuals) {
      filtered = filtered.filter(match => match.type !== 'individual');
    }
    
    if (!filterOptions.userTypes.groups) {
      filtered = filtered.filter(match => match.type !== 'group');
    }
    
    // Filter by subjects
    if (filterOptions.selectedSubjects.length > 0) {
      filtered = filtered.filter(match => 
        match.subjects.some(subject => 
          filterOptions.selectedSubjects.includes(subject)
        )
      );
    }
    
    setFilteredMatches(filtered);
  };
  
  const handleRefresh = async () => {
    if (user) {
      setRefreshing(true);
      await loadPotentialMatches(user.id);
      setRefreshing(false);
    }
  };
  
  const handleSwipeLeft = () => {
    if (user && filteredMatches.length > 0) {
      swipeLeft(user.id);
    }
  };
  
  const handleSwipeRight = () => {
    if (user && filteredMatches.length > 0) {
      const matchedUser = filteredMatches[0];
      swipeRight(user.id, matchedUser.id);
      
      // 50% chance of creating a match for demo purposes
      if (Math.random() > 0.5) {
        // Add match notification
        addNotification({
          type: 'match',
          title: 'New Match!',
          message: `You matched with ${matchedUser.name}!`,
          data: {
            userId: matchedUser.id,
          }
        });
      }
    }
  };
  
  const handleViewProfile = (userId: string) => {
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
          Loading potential matches...
        </Text>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>
          Discover
        </Text>
        
        <TouchableOpacity 
          style={[styles.filterButton, { backgroundColor: themeColors.card }]}
          onPress={() => setFilterModalVisible(true)}
        >
          <Filter size={20} color={themeColors.text} />
        </TouchableOpacity>
      </View>
      
      {filteredMatches.length === 0 ? (
        <Animated.View style={[styles.emptyContainer, { opacity: emptyOpacity }]}>
          <EmptyState
            icon={<Search size={48} color={themeColors.primary} />}
            title="No more matches"
            message="We couldn't find any more potential matches for you right now. Try adjusting your filters or check back later!"
            buttonTitle="Refresh"
            onButtonPress={handleRefresh}
          />
        </Animated.View>
      ) : (
        <View style={styles.cardContainer}>
          <Card
            user={filteredMatches[0]}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            onViewProfile={handleViewProfile}
          />
          
          <View style={styles.refreshContainer}>
            <TouchableOpacity 
              style={[styles.refreshButton, { backgroundColor: themeColors.card }]}
              onPress={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? (
                <ActivityIndicator size="small" color={themeColors.primary} />
              ) : (
                <Text style={[styles.refreshText, { color: themeColors.primary }]}>
                  Refresh Matches
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
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
  emptyContainer: {
    flex: 1,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  refreshButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  refreshText: {
    fontWeight: '600',
  },
});