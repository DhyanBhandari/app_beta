import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { User, Settings } from 'lucide-react-native';
import { useAuth } from '@/providers/AuthProvider';

interface ProfileCardProps {
  onSettingsPress?: () => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function ProfileCard({ onSettingsPress }: ProfileCardProps) {
  const { user } = useAuth();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
    onSettingsPress?.();
  };

  if (!user) return null;

  return (
    <AnimatedTouchable
      style={[styles.container, animatedStyle]}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <User size={24} color="#00D4FF" />
            </View>
          )}
          <View style={[styles.roleBadge, user.role === 'organization' && styles.orgBadge]}>
            <Text style={[styles.roleText, user.role === 'organization' && styles.orgRoleText]}>
              {user.role === 'organization' ? 'ORG' : 'USER'}
            </Text>
          </View>
        </View>
        
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {user.name}
          </Text>
          <Text style={styles.email} numberOfLines={1}>
            {user.email}
          </Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, user.onboardingCompleted && styles.completedDot]} />
            <Text style={styles.statusText}>
              {user.onboardingCompleted ? 'Setup Complete' : 'Setup Pending'}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.settingsButton} onPress={onSettingsPress}>
          <Settings size={20} color="#666666" />
        </TouchableOpacity>
      </View>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  orgBadge: {
    backgroundColor: '#FF9500',
  },
  roleText: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  orgRoleText: {
    color: '#000000',
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
    marginBottom: 2,
  },
  email: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF9500',
    marginRight: 6,
  },
  completedDot: {
    backgroundColor: '#34C759',
  },
  statusText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8E8E93',
  },
  settingsButton: {
    padding: 8,
  },
});