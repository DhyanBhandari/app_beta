import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSpring
} from 'react-native-reanimated';
import { FormInput } from '@/components/FormInput';
import { AnimatedButton } from '@/components/AnimatedButton';
import { useAuth } from '@/providers/AuthProvider';
import { ArrowLeft, Building2 } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const INDUSTRIES = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Retail',
  'Manufacturing', 'Consulting', 'Media', 'Real Estate', 'Other'
];

const COMPANY_SIZES = [
  { value: 'startup', label: 'Startup', description: '1-10 employees' },
  { value: 'small', label: 'Small', description: '11-50 employees' },
  { value: 'medium', label: 'Medium', description: '51-200 employees' },
  { value: 'large', label: 'Large', description: '201-1000 employees' },
  { value: 'enterprise', label: 'Enterprise', description: '1000+ employees' },
];

const GOALS = [
  'Improve team productivity',
  'Automate workflows',
  'Enhance customer service',
  'Data analysis & insights',
  'Content creation',
  'Training & education',
];

export default function OrganizationOnboardingScreen() {
  const { completeOnboarding } = useAuth();
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    size: 'startup' as 'startup' | 'small' | 'medium' | 'large' | 'enterprise',
    description: '',
    website: '',
    goals: [] as string[],
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (!formData.industry) {
      newErrors.industry = 'Please select an industry';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Company description is required';
    }
    
    if (formData.goals.length === 0) {
      newErrors.goals = 'Please select at least one goal';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleIndustrySelect = (industry: string) => {
    setFormData(prev => ({ ...prev, industry }));
  };

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    completeOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.content, animatedStyle]}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#FF9500" />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.logo}>
              <Building2 size={28} color="#FFFFFF" />
            </View>
            <Text style={styles.title}>Organization Setup</Text>
            <Text style={styles.subtitle}>Configure AI for your team</Text>
          </View>

          <View style={styles.form}>
            <FormInput
              label="Company Name"
              value={formData.companyName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, companyName: text }))}
              error={errors.companyName}
              required
            />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Industry *</Text>
              <View style={styles.industriesGrid}>
                {INDUSTRIES.map((industry) => (
                  <TouchableOpacity
                    key={industry}
                    style={[
                      styles.industryChip,
                      formData.industry === industry && styles.selectedIndustryChip
                    ]}
                    onPress={() => handleIndustrySelect(industry)}
                  >
                    <Text style={[
                      styles.industryText,
                      formData.industry === industry && styles.selectedIndustryText
                    ]}>
                      {industry}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.industry && (
                <Text style={styles.errorText}>{errors.industry}</Text>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Company Size *</Text>
              <View style={styles.sizeOptions}>
                {COMPANY_SIZES.map((size) => (
                  <TouchableOpacity
                    key={size.value}
                    style={[
                      styles.sizeOption,
                      formData.size === size.value && styles.selectedSizeOption
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, size: size.value as any }))}
                  >
                    <View style={styles.sizeContent}>
                      <Text style={[
                        styles.sizeLabel,
                        formData.size === size.value && styles.selectedSizeText
                      ]}>
                        {size.label}
                      </Text>
                      <Text style={[
                        styles.sizeDescription,
                        formData.size === size.value && styles.selectedSizeDescription
                      ]}>
                        {size.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <FormInput
              label="Company Description"
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              error={errors.description}
              required
              multiline
              numberOfLines={4}
              placeholder="Brief description of your company and what you do..."
            />

            <FormInput
              label="Website (Optional)"
              value={formData.website}
              onChangeText={(text) => setFormData(prev => ({ ...prev, website: text }))}
              placeholder="https://yourcompany.com"
              keyboardType="url"
            />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Primary Goals *</Text>
              <View style={styles.goalsGrid}>
                {GOALS.map((goal) => (
                  <TouchableOpacity
                    key={goal}
                    style={[
                      styles.goalChip,
                      formData.goals.includes(goal) && styles.selectedGoalChip
                    ]}
                    onPress={() => handleGoalToggle(goal)}
                  >
                    <Text style={[
                      styles.goalText,
                      formData.goals.includes(goal) && styles.selectedGoalText
                    ]}>
                      {goal}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.goals && (
                <Text style={styles.errorText}>{errors.goals}</Text>
              )}
            </View>

            <AnimatedButton
              title="Complete Setup"
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
              style={styles.submitButton}
            />
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  content: {
    paddingVertical: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: '#FF9500',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#FF9500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
  form: {
    gap: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
    marginBottom: 12,
  },
  industriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  industryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  selectedIndustryChip: {
    backgroundColor: '#FF9500',
    borderColor: '#FF9500',
  },
  industryText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#000000',
  },
  selectedIndustryText: {
    color: '#FFFFFF',
  },
  sizeOptions: {
    gap: 12,
  },
  sizeOption: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E5EA',
  },
  selectedSizeOption: {
    borderColor: '#FF9500',
    backgroundColor: '#FF950010',
  },
  sizeContent: {
    gap: 4,
  },
  sizeLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
  },
  selectedSizeText: {
    color: '#FF9500',
  },
  sizeDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
  },
  selectedSizeDescription: {
    color: '#FF9500',
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  goalChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  selectedGoalChip: {
    backgroundColor: '#FF9500',
    borderColor: '#FF9500',
  },
  goalText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#000000',
  },
  selectedGoalText: {
    color: '#FFFFFF',
  },
  submitButton: {
    marginTop: 20,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#FF3B30',
    marginTop: 8,
    marginLeft: 4,
  },
});