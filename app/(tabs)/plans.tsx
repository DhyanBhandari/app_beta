import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSpring
} from 'react-native-reanimated';
import { AnimatedButton } from '@/components/AnimatedButton';
import { Check, Crown, Zap, Users } from 'lucide-react-native';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
  icon: any;
  color: string;
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    icon: Zap,
    color: '#888888',
    features: [
      { text: '100 AI interactions per month', included: true },
      { text: 'Basic chat functionality', included: true },
      { text: 'Standard response time', included: true },
      { text: 'Email support', included: true },
      { text: 'Advanced analytics', included: false },
      { text: 'Custom integrations', included: false },
      { text: 'Priority support', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$19',
    period: 'per month',
    description: 'For power users and professionals',
    icon: Crown,
    color: '#00D4FF',
    popular: true,
    features: [
      { text: 'Unlimited AI interactions', included: true },
      { text: 'Advanced chat features', included: true },
      { text: 'Priority response time', included: true },
      { text: 'Priority email support', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'API access', included: true },
      { text: 'Custom integrations', included: false },
    ],
  },
  {
    id: 'team',
    name: 'Team',
    price: '$49',
    period: 'per month',
    description: 'For teams and organizations',
    icon: Users,
    color: '#FFE66D',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Team collaboration tools', included: true },
      { text: 'Admin dashboard', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'Dedicated support', included: true },
      { text: 'Custom training', included: true },
      { text: 'SLA guarantee', included: true },
    ],
  },
];

export default function PlansScreen() {
  const [selectedPlan, setSelectedPlan] = useState('pro');
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

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = (planId: string) => {
    // In a real app, this would integrate with RevenueCat
    console.log(`Subscribe to ${planId}`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={[styles.content, animatedStyle]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Plan</Text>
          <Text style={styles.subtitle}>
            Unlock the full potential of AI with our flexible pricing options
          </Text>
        </View>

        {/* Plans */}
        <View style={styles.plansContainer}>
          {PLANS.map((plan) => {
            const IconComponent = plan.icon;
            const isSelected = selectedPlan === plan.id;
            
            return (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  isSelected && styles.selectedPlanCard,
                  plan.popular && styles.popularPlanCard,
                ]}
                onPress={() => handleSelectPlan(plan.id)}
                activeOpacity={0.9}
              >
                {plan.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>Most Popular</Text>
                  </View>
                )}
                
                <View style={styles.planHeader}>
                  <View style={[styles.planIcon, { backgroundColor: `${plan.color}20` }]}>
                    <IconComponent size={24} color={plan.color} />
                  </View>
                  <View style={styles.planInfo}>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <Text style={styles.planDescription}>{plan.description}</Text>
                  </View>
                </View>

                <View style={styles.planPricing}>
                  <Text style={styles.planPrice}>{plan.price}</Text>
                  <Text style={styles.planPeriod}>/{plan.period}</Text>
                </View>

                <View style={styles.planFeatures}>
                  {plan.features.map((feature, index) => (
                    <View key={index} style={styles.featureRow}>
                      <View style={[
                        styles.featureIcon,
                        feature.included ? styles.includedIcon : styles.notIncludedIcon
                      ]}>
                        <Check 
                          size={12} 
                          color={feature.included ? '#4ECDC4' : '#666666'} 
                        />
                      </View>
                      <Text style={[
                        styles.featureText,
                        !feature.included && styles.notIncludedText
                      ]}>
                        {feature.text}
                      </Text>
                    </View>
                  ))}
                </View>

                <AnimatedButton
                  title={plan.id === 'free' ? 'Current Plan' : 'Subscribe'}
                  onPress={() => handleSubscribe(plan.id)}
                  variant={isSelected ? 'primary' : 'outline'}
                  disabled={plan.id === 'free'}
                  style={[
                    styles.subscribeButton,
                    isSelected && { backgroundColor: plan.color }
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Can I change my plan anytime?</Text>
            <Text style={styles.faqAnswer}>
              Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
            </Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>What payment methods do you accept?</Text>
            <Text style={styles.faqAnswer}>
              We accept all major credit cards, PayPal, and Apple Pay for your convenience.
            </Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Is there a free trial?</Text>
            <Text style={styles.faqAnswer}>
              Our Free plan gives you access to basic features forever. You can upgrade to Pro or Team plans anytime.
            </Text>
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
    paddingHorizontal: 20,
    marginBottom: 30,
    alignItems: 'center',
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
    lineHeight: 22,
  },
  plansContainer: {
    paddingHorizontal: 20,
    gap: 20,
    marginBottom: 40,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
  },
  selectedPlanCard: {
    borderWidth: 2,
    borderColor: '#007AFF',
    backgroundColor: '#007AFF05',
  },
  popularPlanCard: {
    borderWidth: 2,
    borderColor: '#007AFF',
    backgroundColor: '#007AFF05',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    left: 20,
    right: 20,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 6,
    alignItems: 'center',
  },
  popularText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  planIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#000000',
    fontWeight: '700',
    marginBottom: 4,
  },
  planDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
  },
  planPricing: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 24,
  },
  planPrice: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: '#000000',
    fontWeight: '700',
  },
  planPeriod: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8E8E93',
    marginLeft: 4,
  },
  planFeatures: {
    marginBottom: 24,
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  includedIcon: {
    backgroundColor: '#34C75920',
  },
  notIncludedIcon: {
    backgroundColor: '#E5E5EA',
  },
  featureText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#000000',
    flex: 1,
  },
  notIncludedText: {
    color: '#8E8E93',
  },
  subscribeButton: {
    marginTop: 8,
  },
  faqSection: {
    paddingHorizontal: 20,
  },
  faqTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#000000',
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  faqItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  faqQuestion: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
    marginBottom: 8,
  },
  faqAnswer: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
});