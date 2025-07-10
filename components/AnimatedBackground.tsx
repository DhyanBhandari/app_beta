import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { 
  Code, 
  Headphones, 
  Car, 
  Coffee, 
  Gamepad2, 
  Camera, 
  Palette, 
  Music,
  Book,
  Dumbbell,
  Plane,
  Heart
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const ANIMATIONS = [
  { icon: Code, color: '#00D4FF', name: 'coding' },
  { icon: Headphones, color: '#FF6B6B', name: 'listening' },
  { icon: Car, color: '#4ECDC4', name: 'driving' },
  { icon: Coffee, color: '#FFE66D', name: 'coffee' },
  { icon: Gamepad2, color: '#A8E6CF', name: 'gaming' },
  { icon: Camera, color: '#FF8B94', name: 'photography' },
  { icon: Palette, color: '#B4A7D6', name: 'designing' },
  { icon: Music, color: '#D4A574', name: 'music' },
  { icon: Book, color: '#8FBC8F', name: 'reading' },
  { icon: Dumbbell, color: '#F0A500', name: 'workout' },
  { icon: Plane, color: '#6C5CE7', name: 'traveling' },
  { icon: Heart, color: '#FD79A8', name: 'loving' },
];

interface FloatingIconProps {
  icon: any;
  color: string;
  delay: number;
  duration: number;
  startX: number;
  startY: number;
}

function FloatingIcon({ icon: IconComponent, color, delay, duration, startX, startY }: FloatingIconProps) {
  const translateX = useSharedValue(startX);
  const translateY = useSharedValue(startY);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Entrance animation
    opacity.value = withDelay(delay, withTiming(0.6, { duration: 1000 }));
    scale.value = withDelay(delay, withSpring(1, { damping: 15, stiffness: 150 }));
    
    // Floating movement
    translateX.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(startX + (Math.random() - 0.5) * 100, { duration: duration }),
          withTiming(startX + (Math.random() - 0.5) * 100, { duration: duration })
        ),
        -1,
        true
      )
    );
    
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(startY + (Math.random() - 0.5) * 80, { duration: duration }),
          withTiming(startY + (Math.random() - 0.5) * 80, { duration: duration })
        ),
        -1,
        true
      )
    );

    // Gentle rotation
    rotation.value = withDelay(
      delay,
      withRepeat(
        withTiming(360, { duration: duration * 2, easing: Easing.linear }),
        -1
      )
    );

    // Fade out and restart cycle
    const cycleTimeout = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 1000 }, () => {
        // Reset position and restart
        translateX.value = Math.random() * width;
        translateY.value = Math.random() * height;
        opacity.value = withTiming(0.6, { duration: 1000 });
      });
    }, 8000 + delay);

    return () => clearTimeout(cycleTimeout);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.floatingIcon, animatedStyle]}>
      <IconComponent size={24} color={color} />
    </Animated.View>
  );
}

export function AnimatedBackground() {
  return (
    <View style={styles.container}>
      {ANIMATIONS.map((anim, index) => (
        <FloatingIcon
          key={`${anim.name}-${index}`}
          icon={anim.icon}
          color={anim.color}
          delay={index * 500}
          duration={3000 + Math.random() * 2000}
          startX={Math.random() * width}
          startY={Math.random() * height}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  floatingIcon: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
});