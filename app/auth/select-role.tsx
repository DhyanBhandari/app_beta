import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSpring,
  interpolateColor
} from 'react-native-reanimated';
import { AnimatedButton } from '@/components/AnimatedButton';
import { useAuth } from '@/providers/AuthProvider';
import { User, Building2 } from 'lucide-react-native';

type Role = 'user' | 'organization';

export default function SelectRoleScreen() {
  const { setUserRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<Role>('user');
  
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);
  const userScale = useSharedValue(1);
  const orgScale = useSharedValue(1);

  React.useEffect(() => {
    opacity.value = withTiming(1, { duration: 600 });
    translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const userCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: userScale.value }],
    backgroundColor: interpolateColor(
      selectedRole === 'user' ? 1 : 0,
      [0, 1],
      ['#FFFFFF', '#007AFF10']
    ),
    borderColor: interpolateColor(
      selectedRole === 'user' ? 1 : 0,
      [0, 1],
      ['#E5E5EA', '#007AFF']
    ),
  }));

  const orgCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: orgScale.value }],
    backgroundColor: interpolateColor(
      selectedRole === 'organization' ? 1 : 0,
      [0, 1],
      ['#FFFFFF', '#FF950010']
    ),
    borderColor: interpolateColor(
      selectedRole === 'organization' ? 1 : 0,
      [0, 1],
      ['#E5E5EA', '#FF9500']
    ),
  }));

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    
    if (role === 'user') {
      userScale.value = withSpring(0.95, {}, () => {
        userScale.value = withSpring(1);
      });
    } else {
      orgScale.value = withSpring(0.95, {}, () => {
        orgScale.value = withSpring(1);
      });
    }
  };

  const handleContinue = () => {
    setUserRole(selectedRole);
    if (selectedRole === 'user') {
      router.push('/onboarding/user');
    } else {
      router.push('/onboarding/organization');
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, animatedStyle]}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>AI</Text>
          </View>
          <Text style={styles.title}>Choose Your Path</Text>
          <Text style={styles.subtitle}>
            Select how you'll be using our AI assistant
          </Text>
        </View>

        <View style={styles.roleCards}>
          <TouchableOpacity
            onPress={() => handleRoleSelect('user')}
            activeOpacity={0.9}
          >
            <Animated.View style={[styles.roleCard, userCardStyle]}>
              <View style={[styles.roleIcon, selectedRole === 'user' && styles.selectedUserIcon]}>
                <User size={32} color={selectedRole === 'user' ? '#007AFF' : '#8E8E93'} />
              </View>
              <Text style={[styles.roleTitle, selectedRole === 'user' && styles.selectedText]}>
                Individual User
              </Text>
              <Text style={styles.roleDescription}>
                Perfect for personal use, learning, and individual projects
              </Text>
              <View style={styles.features}>
                <Text style={styles.feature}>• Personal AI assistant</Text>
                <Text style={styles.feature}>• Custom preferences</Text>
                <Text style={styles.feature}>• Learning resources</Text>
              </View>
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleRoleSelect('organization')}
            activeOpacity={0.9}
          >
            <Animated.View style={[styles.roleCard, orgCardStyle]}>
              <View style={[styles.roleIcon, selectedRole === 'organization' && styles.selectedOrgIcon]}>
                <Building2 size={32} color={selectedRole === 'organization' ? '#FF9500' : '#8E8E93'} />
              </View>
              <Text style={[styles.roleTitle, selectedRole === 'organization' && styles.selectedOrgText]}>
                Organization
              </Text>
              <Text style={styles.roleDescription}>
                Ideal for teams, companies, and collaborative work
              </Text>
              <View style={styles.features}>
                <Text style={styles.feature}>• Team collaboration</Text>
                <Text style={styles.feature}>• Advanced analytics</Text>
                <Text style={styles.feature}>• Custom integrations</Text>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </View>

        <AnimatedButton
          title="Continue"
          onPress={handleContinue}
          style={styles.continueButton}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#000000',
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  roleCards: {
    flex: 1,
    gap: 20,
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  roleIcon: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  selectedUserIcon: {
    backgroundColor: '#007AFF20',
  },
  selectedOrgIcon: {
    backgroundColor: '#FF950020',
  },
  roleTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#000000',
    fontWeight: '700',
    marginBottom: 8,
  },
  selectedText: {
    color: '#007AFF',
  },
  selectedOrgText: {
    color: '#FF9500',
  },
  roleDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 16,
    lineHeight: 22,
  },
  features: {
    gap: 6,
  },
  feature: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
  },
  continueButton: {
    marginTop: 20,
  },
});