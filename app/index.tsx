import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  withSequence,
  withDelay,
  runOnJS
} from 'react-native-reanimated';
import { useAuth } from '@/providers/AuthProvider';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Bot, Sparkles } from 'lucide-react-native';

export default function SplashScreen() {
  const { user, isLoading } = useAuth();
  const [currentText, setCurrentText] = useState('');
  const [showSecondLine, setShowSecondLine] = useState(false);
  
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const translateY = useSharedValue(50);
  const textOpacity = useSharedValue(0);
  const sparkleRotation = useSharedValue(0);

  const fullText = "Hey there! 👋";
  const secondText = "I'm your AI Assistant, here to help you!";

  useEffect(() => {
    // Start animations
    opacity.value = withTiming(1, { duration: 800 });
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
    translateY.value = withTiming(0, { duration: 600 });
    
    // Sparkle rotation
    sparkleRotation.value = withSequence(
      withDelay(500, withTiming(360, { duration: 1000 })),
      withTiming(0, { duration: 0 })
    );

    // Typewriter effect for first line
    let index = 0;
    const typeInterval = setInterval(() => {
      if (index <= fullText.length) {
        setCurrentText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(typeInterval);
        // Show second line after first is complete
        setTimeout(() => {
          setShowSecondLine(true);
          textOpacity.value = withTiming(1, { duration: 600 });
        }, 500);
      }
    }, 100);

    // Navigate after animations
    const timer = setTimeout(() => {
      if (!isLoading) {
        navigateToNextScreen();
      }
    }, 4000);

    return () => {
      clearInterval(typeInterval);
      clearTimeout(timer);
    };
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(navigateToNextScreen, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, user]);

  const navigateToNextScreen = () => {
    router.replace('/(tabs)');
  };

  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      { translateY: translateY.value }
    ],
  }));

  const sparkleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sparkleRotation.value}deg` }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <View style={styles.logo}>
          <Bot size={32} color="#FFFFFF" />
          <Animated.View style={[styles.sparkle, sparkleStyle]}>
            <Sparkles size={16} color="#00D4FF" />
          </Animated.View>
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>{currentText}</Text>
          {showSecondLine && (
            <Animated.Text style={[styles.subtitle, textStyle]}>
              {secondText}
            </Animated.Text>
          )}
        </View>
      </Animated.View>
      
      <View style={styles.loadingContainer}>
        <LoadingSpinner size={24} color="#00D4FF" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
  },
  sparkle: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 4,
  },
  textContainer: {
    alignItems: 'center',
    minHeight: 80,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#000000',
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 100,
  },
});