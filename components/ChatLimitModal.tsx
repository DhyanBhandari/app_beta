import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { AnimatedButton } from './AnimatedButton';
import { X, Lock, Zap } from 'lucide-react-native';

interface ChatLimitModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ChatLimitModal({ visible, onClose }: ChatLimitModalProps) {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1, { damping: 15, stiffness: 150 });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0.8, { duration: 200 });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const handleLogin = () => {
    onClose();
    router.push('/auth/login');
  };

  const handleRegister = () => {
    onClose();
    router.push('/auth/register');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.modal, animatedStyle]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#888888" />
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <Lock size={32} color="#00D4FF" />
            <View style={styles.zapIcon}>
              <Zap size={16} color="#FFD700" />
            </View>
          </View>

          <Text style={styles.title}>Chat Limit Reached</Text>
          <Text style={styles.description}>
            You've used your 2 free chats! Sign in or create an account to continue chatting with unlimited access.
          </Text>

          <View style={styles.features}>
            <View style={styles.feature}>
              <Text style={styles.featureText}>• Unlimited AI conversations</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureText}>• Personalized experience</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureText}>• Chat history & sync</Text>
            </View>
          </View>

          <View style={styles.buttons}>
            <AnimatedButton
              title="Sign In"
              onPress={handleLogin}
              style={styles.loginButton}
            />
            <AnimatedButton
              title="Create Account"
              onPress={handleRegister}
              variant="outline"
              style={styles.registerButton}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    zIndex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  zapIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#000000',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  features: {
    marginBottom: 32,
  },
  feature: {
    marginBottom: 8,
  },
  featureText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#000000',
  },
  buttons: {
    gap: 12,
  },
  loginButton: {
    backgroundColor: '#007AFF',
  },
  registerButton: {
    borderColor: '#007AFF',
  },
});