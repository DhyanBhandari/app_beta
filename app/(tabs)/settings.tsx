import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSpring
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { ProfileCard } from '@/components/ProfileCard';
import { AnimatedButton } from '@/components/AnimatedButton';
import { 
  User, 
  Bell, 
  Shield, 
  CircleHelp as HelpCircle, 
  MessageSquare, 
  Star, 
  LogOut, 
  ChevronRight, 
  Moon, 
  Globe,
  CreditCard,
  History,
  Palette,
  Phone,
  Mail,
  FileText,
  Lock,
  Scale,
  Award
} from 'lucide-react-native';

interface SettingItem {
  id: string;
  title: string;
  description?: string;
  icon: any;
  color: string;
  onPress: () => void;
  showChevron?: boolean;
}

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  React.useEffect(() => {
    opacity.value = withTiming(1, { duration: 600 });
    translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(tabs)');
          }
        },
      ]
    );
  };

  const settingSections = [
    {
      title: 'Subscription & Plans',
      items: [
        {
          id: 'plans',
          title: 'Subscription Plans',
          description: 'Manage your subscription',
          icon: CreditCard,
          color: '#007AFF',
          onPress: () => router.push('/(tabs)/plans'),
          showChevron: true,
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          id: 'history',
          title: 'Chat History',
          description: 'View your conversation history',
          icon: History,
          color: '#34C759',
          onPress: () => console.log('History'),
          showChevron: true,
        },
        {
          id: 'profile',
          title: 'Profile Settings',
          description: 'Update your personal information',
          icon: User,
          color: '#007AFF',
          onPress: () => console.log('Profile settings'),
          showChevron: true,
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'appearance',
          title: 'Appearance',
          description: 'Customize app appearance',
          icon: Palette,
          color: '#FF9500',
          onPress: () => console.log('Appearance'),
          showChevron: true,
        },
        {
          id: 'notifications',
          title: 'Notifications',
          description: 'Manage your notification preferences',
          icon: Bell,
          color: '#FF3B30',
          onPress: () => console.log('Notifications'),
          showChevron: true,
        },
      ],
    },
    {
      title: 'Contact Information',
      items: [
        {
          id: 'phone',
          title: 'Phone Number',
          description: 'Update your phone number',
          icon: Phone,
          color: '#34C759',
          onPress: () => console.log('Phone'),
          showChevron: true,
        },
        {
          id: 'email',
          title: 'Email Address',
          description: 'Update your email address',
          icon: Mail,
          color: '#007AFF',
          onPress: () => console.log('Email'),
          showChevron: true,
        },
        {
          id: 'ekyc',
          title: 'E-KYC Upload',
          description: 'Upload identity verification documents',
          icon: Award,
          color: '#FF9500',
          onPress: () => console.log('E-KYC'),
          showChevron: true,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          title: 'Help Center',
          description: 'Get help and support',
          icon: HelpCircle,
          color: '#007AFF',
          onPress: () => console.log('Help'),
          showChevron: true,
        },
        {
          id: 'feedback',
          title: 'Send Feedback',
          description: 'Share your thoughts with us',
          icon: MessageSquare,
          color: '#FF9500',
          onPress: () => console.log('Feedback'),
          showChevron: true,
        },
        {
          id: 'rate',
          title: 'Rate the App',
          description: 'Rate us on the App Store',
          icon: Star,
          color: '#FFD700',
          onPress: () => console.log('Rate app'),
          showChevron: true,
        },
      ],
    },
    {
      title: 'Legal',
      items: [
        {
          id: 'privacy',
          title: 'Privacy Policy',
          description: 'Read our privacy policy',
          icon: Shield,
          color: '#34C759',
          onPress: () => console.log('Privacy Policy'),
          showChevron: true,
        },
        {
          id: 'terms',
          title: 'Terms & Conditions',
          description: 'Read our terms of service',
          icon: FileText,
          color: '#007AFF',
          onPress: () => console.log('Terms'),
          showChevron: true,
        },
        {
          id: 'license',
          title: 'License Agreement',
          description: 'View software license',
          icon: Scale,
          color: '#FF9500',
          onPress: () => console.log('License'),
          showChevron: true,
        },
      ],
    },
  ];

  const renderSettingItem = (item: SettingItem) => {
    const IconComponent = item.icon;
    
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.settingItem}
        onPress={item.onPress}
        activeOpacity={0.7}
      >
        <View style={[styles.settingIcon, { backgroundColor: `${item.color}20` }]}>
          <IconComponent size={20} color={item.color} />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          {item.description && (
            <Text style={styles.settingDescription}>{item.description}</Text>
          )}
        </View>
        {item.showChevron && (
          <ChevronRight size={20} color="#666666" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={[styles.content, animatedStyle]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Manage your account and preferences</Text>
        </View>

        {/* Dark Mode Toggle */}
        <View style={styles.darkModeSection}>
          <View style={styles.darkModeCard}>
            <View style={styles.darkModeContent}>
              <View style={styles.darkModeIcon}>
                <Moon size={20} color="#007AFF" />
              </View>
              <View style={styles.darkModeInfo}>
                <Text style={styles.darkModeTitle}>Dark Mode</Text>
                <Text style={styles.darkModeDescription}>Switch between light and dark themes</Text>
              </View>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
              thumbColor={isDarkMode ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
        </View>

        {/* Profile Card */}
        {user && <ProfileCard />}

        {/* Login Prompt for Non-Users */}
        {!user && (
          <View style={styles.loginPrompt}>
            <Text style={styles.loginTitle}>Sign in to access all features</Text>
            <Text style={styles.loginDescription}>
              Create an account or sign in to sync your preferences and chat history.
            </Text>
            <View style={styles.loginButtons}>
              <AnimatedButton
                title="Sign In"
                onPress={() => router.push('/auth/login')}
                style={styles.loginButton}
              />
              <AnimatedButton
                title="Create Account"
                onPress={() => router.push('/auth/register')}
                variant="outline"
                style={styles.registerButton}
              />
            </View>
          </View>
        )}

        {/* Settings Sections */}
        {settingSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map(renderSettingItem)}
            </View>
          </View>
        ))}

        {/* Role Badge */}
        {user && (
          <View style={styles.roleSection}>
            <View style={styles.roleBadgeContainer}>
              <View style={[
                styles.roleBadge, 
                user?.role === 'organization' ? styles.orgRoleBadge : styles.userRoleBadge
              ]}>
                <Text style={styles.roleBadgeText}>
                  {user?.role === 'organization' ? 'Organization Account' : 'Individual Account'}
                </Text>
              </View>
              <Text style={styles.roleDescription}>
                {user?.role === 'organization' 
                  ? 'You have access to team collaboration features'
                  : 'Upgrade to Organization for team features'
                }
              </Text>
            </View>
          </View>
        )}

        {/* Logout Button */}
        {user && (
          <View style={styles.logoutSection}>
            <AnimatedButton
              title="Sign Out"
              onPress={handleLogout}
              variant="outline"
              style={styles.logoutButton}
            />
          </View>
        )}

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.versionSubtext}>Built with ❤️ for AI enthusiasts</Text>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#000000',
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  darkModeSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  darkModeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  darkModeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  darkModeIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#007AFF20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  darkModeInfo: {
    flex: 1,
  },
  darkModeTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
    marginBottom: 2,
  },
  darkModeDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
  },
  loginPrompt: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  loginTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#000000',
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  loginDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  loginButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  loginButton: {
    flex: 1,
    backgroundColor: '#007AFF',
  },
  registerButton: {
    flex: 1,
    borderColor: '#007AFF',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#000000',
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
    marginBottom: 2,
  },
  settingDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
  },
  roleSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  roleBadgeContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  userRoleBadge: {
    backgroundColor: '#007AFF20',
  },
  orgRoleBadge: {
    backgroundColor: '#FF950020',
  },
  roleBadgeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  roleDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  logoutSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  logoutButton: {
    borderColor: '#FF6B6B',
  },
  versionSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  versionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  versionSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8E8E93',
  },
});