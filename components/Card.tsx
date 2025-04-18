import React, { useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  Dimensions,
  TouchableOpacity,
  Animated,
  PanResponder
} from 'react-native';
import { User } from '@/types';
import { useThemeStore } from '@/store/theme-store';
import colors from '@/constants/colors';
import { Bookmark, Users, X, Heart, Info } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform } from 'react-native';

interface CardProps {
  user: User;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onViewProfile: (userId: string) => void;
}

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const SWIPE_THRESHOLD = width * 0.25;

export default function Card({ user, onSwipeLeft, onSwipeRight, onViewProfile }: CardProps) {
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  
  // Animation values
  const position = useRef(new Animated.ValueXY()).current;
  const rotation = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD * 2, 0, SWIPE_THRESHOLD * 2],
    outputRange: ['-30deg', '0deg', '30deg'],
    extrapolate: 'clamp'
  });
  
  const likeOpacity = position.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });
  
  const dislikeOpacity = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });
  
  const cardStyle = {
    transform: [
      { translateX: position.x },
      { translateY: position.y },
      { rotate: rotation }
    ]
  };
  
  // Pan responder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          swipeRight();
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          swipeLeft();
        } else {
          resetPosition();
        }
      }
    })
  ).current;
  
  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 5,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };
  
  const swipeLeft = () => {
    Animated.timing(position, {
      toValue: { x: -width, y: 0 },
      duration: 300,
      useNativeDriver: Platform.OS !== 'web',
    }).start(() => {
      onSwipeLeft();
      position.setValue({ x: 0, y: 0 });
    });
  };
  
  const swipeRight = () => {
    Animated.timing(position, {
      toValue: { x: width, y: 0 },
      duration: 300,
      useNativeDriver: Platform.OS !== 'web',
    }).start(() => {
      onSwipeRight();
      position.setValue({ x: 0, y: 0 });
    });
  };
  
  const handleViewProfile = () => {
    onViewProfile(user.id);
  };
  
  return (
    <View style={styles.container}>
      <Animated.View 
        style={[styles.card, cardStyle, { backgroundColor: themeColors.card, borderColor: themeColors.border }]} 
        {...(Platform.OS !== 'web' ? panResponder.panHandlers : {})}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: user.images[0] }} 
            style={styles.image}
            resizeMode="cover"
          />
          
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.gradient}
          />
          
          <View style={styles.userTypeContainer}>
            {user.type === 'group' ? (
              <View style={[styles.userType, { backgroundColor: themeColors.secondary }]}>
                <Users size={14} color="#FFFFFF" />
                <Text style={styles.userTypeText}>Group</Text>
              </View>
            ) : (
              <View style={[styles.userType, { backgroundColor: themeColors.primary }]}>
                <Bookmark size={14} color="#FFFFFF" />
                <Text style={styles.userTypeText}>Individual</Text>
              </View>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.infoButton}
            onPress={handleViewProfile}
          >
            <Info size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={[styles.name, { color: themeColors.text }]}>
            {user.name}
          </Text>
          
          <Text style={[styles.institution, { color: themeColors.subtext }]}>
            {user.institution}
          </Text>
          
          <Text style={[styles.bio, { color: themeColors.text }]} numberOfLines={3}>
            {user.bio}
          </Text>
          
          <View style={styles.tagsContainer}>
            {user.subjects.slice(0, 3).map((subject, index) => (
              <View 
                key={index} 
                style={[
                  styles.tag, 
                  { backgroundColor: theme === 'dark' ? '#2C2C2E' : '#F0F0F5' }
                ]}
              >
                <Text style={[styles.tagText, { color: themeColors.text }]}>
                  {subject}
                </Text>
              </View>
            ))}
          </View>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.dislikeButton]} 
              onPress={swipeLeft}
            >
              <X size={24} color="#FF3B30" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.infoButton, { backgroundColor: themeColors.primary + '20' }]} 
              onPress={handleViewProfile}
            >
              <Info size={24} color={themeColors.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.likeButton]} 
              onPress={swipeRight}
            >
              <Heart size={24} color="#34C759" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Overlay indicators */}
        <Animated.View 
          style={[
            styles.overlayLabel, 
            styles.likeLabel, 
            { opacity: likeOpacity }
          ]}
        >
          <Text style={styles.overlayText}>CONNECT</Text>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.overlayLabel, 
            styles.dislikeLabel, 
            { opacity: dislikeOpacity }
          ]}
        >
          <Text style={styles.overlayText}>SKIP</Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: height * 0.7,
    alignSelf: 'center',
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    position: 'relative',
    height: '50%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
  },
  userTypeContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  userType: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  userTypeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  infoButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    padding: 16,
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  institution: {
    fontSize: 16,
    marginBottom: 12,
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 'auto',
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  dislikeButton: {
    backgroundColor: '#FFEEEE',
  },
  likeButton: {
    backgroundColor: '#EEFFF5',
  },
  overlayLabel: {
    position: 'absolute',
    width: 140,
    height: 60,
    borderRadius: 10,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    top: 40,
    zIndex: 10,
    transform: [{ rotate: '-30deg' }],
  },
  likeLabel: {
    right: 20,
    borderColor: '#34C759',
  },
  dislikeLabel: {
    left: 20,
    borderColor: '#FF3B30',
  },
  overlayText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});