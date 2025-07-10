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
import { ArrowLeft, User } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const INTERESTS = [
  'Technology', 'Business', 'Creative Writing', 'Education', 'Healthcare',
  'Finance', 'Marketing', 'Design', 'Programming', 'Research'
];

const EXPERIENCE_LEVELS = [
  { value: 'beginner', label: 'Beginner', description: 'New to AI tools' },
  { value: 'intermediate', label: 'Intermediate', description: 'Some experience with AI' },
  { value: 'advanced', label: 'Advanced', description: 'Experienced AI user' },
];

export default function UserOnboardingScreen() {
  const { completeOnboarding } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    profession: '',
    interests: [] as string[],
    goals: '',
    experience: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.profession.trim()) {
      newErrors.profession = 'Profession is required';
    }
    
    if (formData.interests.length === 0) {
      newErrors.interests = 'Please select at least one interest';
    }
    
    if (!formData.goals.trim()) {
      newErrors.goals = 'Please describe your goals';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
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
            <ArrowLeft size={24} color="#007AFF" />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.logo}>
              <User size={28} color="#FFFFFF" />
            </View>
            <Text style={styles.title}>Tell Us About You</Text>
            <Text style={styles.subtitle}>Help us personalize your AI experience</Text>
          </View>

          <View style={styles.form}>
            <FormInput
              label="Full Name"
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              error={errors.name}
              required
            />
            
            <FormInput
              label="Profession"
              value={formData.profession}
              onChangeText={(text) => setFormData(prev => ({ ...prev, profession: text }))}
              error={errors.profession}
              required
              placeholder="e.g., Software Developer, Teacher, Designer"
            />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Areas of Interest *</Text>
              <View style={styles.interestsGrid}>
                {INTERESTS.map((interest) => (
                  <TouchableOpacity
                    key={interest}
                    style={[
                      styles.interestChip,
                      formData.interests.includes(interest) && styles.selectedChip
                    ]}
                    onPress={() => handleInterestToggle(interest)}
                  >
                    <Text style={[
                      styles.interestText,
                      formData.interests.includes(interest) && styles.selectedChipText
                    ]}>
                      {interest}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.interests && (
                <Text style={styles.errorText}>{errors.interests}</Text>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Experience Level *</Text>
              <View style={styles.experienceOptions}>
                {EXPERIENCE_LEVELS.map((level) => (
                  <TouchableOpacity
                    key={level.value}
                    style={[
                      styles.experienceOption,
                      formData.experience === level.value && styles.selectedOption
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, experience: level.value as any }))}
                  >
                    <View style={styles.experienceContent}>
                      <Text style={[
                        styles.experienceLabel,
                        formData.experience === level.value && styles.selectedOptionText
                      ]}>
                        {level.label}
                      </Text>
                      <Text style={[
                        styles.experienceDescription,
                        formData.experience === level.value && styles.selectedOptionDescription
                      ]}>
                        {level.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <FormInput
              label="What are your main goals with AI?"
              value={formData.goals}
              onChangeText={(text) => setFormData(prev => ({ ...prev, goals: text }))}
              error={errors.goals}
              required
              multiline
              numberOfLines={4}
              placeholder="e.g., Improve productivity, learn new skills, automate tasks..."
            />

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
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  selectedChip: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  interestText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#000000',
  },
  selectedChipText: {
    color: '#FFFFFF',
  },
  experienceOptions: {
    gap: 12,
  },
  experienceOption: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E5EA',
  },
  selectedOption: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF10',
  },
  experienceContent: {
    gap: 4,
  },
  experienceLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
  },
  selectedOptionText: {
    color: '#007AFF',
  },
  experienceDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
  },
  selectedOptionDescription: {
    color: '#007AFF',
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