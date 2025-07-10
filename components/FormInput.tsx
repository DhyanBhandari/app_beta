import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  interpolateColor
} from 'react-native-reanimated';
import { Eye, EyeOff } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
  type?: 'text' | 'email' | 'password';
  required?: boolean;
}

export function FormInput({
  label,
  error,
  type = 'text',
  required = false,
  value,
  onChangeText,
  ...props
}: FormInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const focusAnimation = useSharedValue(0);
  const errorAnimation = useSharedValue(0);

  React.useEffect(() => {
    focusAnimation.value = withTiming(isFocused ? 1 : 0, { duration: 200 });
  }, [isFocused]);

  React.useEffect(() => {
    errorAnimation.value = withTiming(error ? 1 : 0, { duration: 200 });
  }, [error]);

  const labelStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(
          isFocused || value ? -8 : 0,
          { duration: 200 }
        ),
      },
      {
        scale: withTiming(
          isFocused || value ? 0.85 : 1,
          { duration: 200 }
        ),
      },
    ],
    color: interpolateColor(
      focusAnimation.value,
      [0, 1],
      ['#888888', '#00D4FF']
    ),
  }));

  const containerStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      errorAnimation.value,
      [0, 1],
      [
        interpolateColor(focusAnimation.value, [0, 1], ['#333333', '#00D4FF']),
        '#FF6B6B'
      ]
    ),
  }));

  const errorStyle = useAnimatedStyle(() => ({
    opacity: errorAnimation.value,
    transform: [
      {
        translateY: withTiming(error ? 0 : -10, { duration: 200 }),
      },
    ],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.inputContainer, containerStyle]}>
        <Animated.Text style={[styles.label, labelStyle]}>
          {label}{required && ' *'}
        </Animated.Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={type === 'password' && !showPassword}
          keyboardType={type === 'email' ? 'email-address' : 'default'}
          autoCapitalize={type === 'email' ? 'none' : 'sentences'}
          placeholderTextColor="#666666"
          {...props}
        />
        {type === 'password' && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff size={20} color="#888888" />
            ) : (
              <Eye size={20} color="#888888" />
            )}
          </TouchableOpacity>
        )}
      </Animated.View>
      {error && (
        <Animated.Text style={[styles.errorText, errorStyle]}>
          {error}
        </Animated.Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  inputContainer: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  label: {
    position: 'absolute',
    left: 16,
    top: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    transformOrigin: 'left center',
  },
  input: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#000000',
    paddingRight: 40,
    minHeight: 24,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 20,
    padding: 4,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#FF3B30',
    marginTop: 8,
    marginLeft: 4,
  },
});