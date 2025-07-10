import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
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
import { MessageCircle, TrendingUp, Clock, Zap, ChartBar as BarChart3, Users, Target, Sparkles, CircleHelp as HelpCircle, ChevronRight } from 'lucide-react-native';

const QUICK_ACTIONS = [
  {
    id: 'chat',
    title: 'Start Chat',
    description: 'Begin a conversation with AI',
    icon: MessageCircle,
    color: '#007AFF',
    route: '/index',
  },
  {
    id: 'analytics',
    title: 'View Analytics',
    description: 'Check your usage stats',
    icon: BarChart3,
    color: '#34C759',
    route: '/analytics',
  },
  {
    id: 'team',
    title: 'Team Management',
    description: 'Manage team members',
    icon: Users,
    color: '#FF3B30',
    route: '/team',
  },
  {
    id: 'goals',
    title: 'Set Goals',
    description: 'Define your objectives',
    icon: Target,
    color: '#FF9500',
    route: '/goals',
  },
];

const RECENT_ACTIVITIES = [
  {
    id: '1',
    title: 'Generated marketing copy',
    time: '2 hours ago',
    type: 'generation',
  },
  {
    id: '2',
    title: 'Analyzed customer feedback',
    time: '5 hours ago',
    type: 'analysis',
  },
  {
    id: '3',
    title: 'Created presentation outline',
    time: '1 day ago',
    type: 'creation',
  },
];

const FAQ_ITEMS = [
  {
    id: '1',
    question: 'How do I reset my password?',
    answer: 'Go to Settings > Account > Change Password to reset your password.',
  },
  {
    id: '2',
    question: 'Can I use the AI offline?',
    answer: 'Currently, the AI requires an internet connection to function properly.',
  },
  {
    id: '3',
    question: 'How do I upgrade my plan?',
    answer: 'Visit the Plans section in Settings to view and upgrade your subscription.',
  },
  {
    id: '4',
    question: 'Is my data secure?',
    answer: 'Yes, we use industry-standard encryption to protect your data and conversations.',
  },
];

export default function ProfileScreen() {
  const { user } = useAuth();
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

  const handleSettingsPress = () => {
    router.push('/(tabs)/settings');
  };

  const handleQuickAction = (route: string) => {
    if (route === '/index') {
      router.push('/(tabs)');
    } else {
      // For demo purposes, show coming soon
      console.log(`Navigate to ${route}`);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={[styles.content, animatedStyle]}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}
            </Text>
            <Text style={styles.welcomeText}>
              Welcome back, {user?.name?.split(' ')[0] || 'User'}!
            </Text>
          </View>
          <View style={styles.headerIcon}>
            <Sparkles size={24} color="#007AFF" />
          </View>
        </View>

        {/* Profile Card */}
        <ProfileCard onSettingsPress={handleSettingsPress} />

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <TrendingUp size={20} color="#34C759" />
            </View>
            <Text style={styles.statValue}>2,847</Text>
            <Text style={styles.statLabel}>AI Interactions</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Clock size={20} color="#FF9500" />
            </View>
            <Text style={styles.statValue}>47h</Text>
            <Text style={styles.statLabel}>Time Saved</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Zap size={20} color="#007AFF" />
            </View>
            <Text style={styles.statValue}>94%</Text>
            <Text style={styles.statLabel}>Efficiency</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            {QUICK_ACTIONS.map((action) => {
              const IconComponent = action.icon;
              return (
                <TouchableOpacity
                  key={action.id}
                  style={styles.quickActionCard}
                  onPress={() => handleQuickAction(action.route)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}20` }]}>
                    <IconComponent size={24} color={action.color} />
                  </View>
                  <Text style={styles.quickActionTitle}>{action.title}</Text>
                  <Text style={styles.quickActionDescription}>{action.description}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            {RECENT_ACTIVITIES.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={styles.activityDot} />
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqList}>
            {FAQ_ITEMS.map((item) => (
              <View key={item.id} style={styles.faqItem}>
                <View style={styles.faqHeader}>
                  <HelpCircle size={20} color="#007AFF" />
                  <Text style={styles.faqQuestion}>{item.question}</Text>
                  <ChevronRight size={16} color="#8E8E93" />
                </View>
                <Text style={styles.faqAnswer}>{item.answer}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800' }}
            style={styles.ctaImage}
          />
          <View style={styles.ctaContent}>
            <Text style={styles.ctaTitle}>Ready to explore AI?</Text>
            <Text style={styles.ctaDescription}>
              Start a conversation and discover what our AI can help you achieve today.
            </Text>
            <AnimatedButton
              title="Start Chatting"
              onPress={() => router.push('/(tabs)')}
              style={styles.ctaButton}
            />
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  greeting: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8E8E93',
  },
  welcomeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#000000',
    fontWeight: '700',
    marginTop: 4,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#000000',
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#000000',
    fontWeight: '700',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
    marginBottom: 4,
  },
  quickActionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 18,
  },
  activityList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
    marginBottom: 2,
  },
  activityTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
  },
  faqList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  faqItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  faqQuestion: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
    flex: 1,
    marginLeft: 12,
  },
  faqAnswer: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginLeft: 32,
  },
  ctaSection: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaImage: {
    width: '100%',
    height: 160,
  },
  ctaContent: {
    padding: 20,
  },
  ctaTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#000000',
    fontWeight: '700',
    marginBottom: 8,
  },
  ctaDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8E8E93',
    lineHeight: 22,
    marginBottom: 20,
  },
  ctaButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#007AFF',
  },
});