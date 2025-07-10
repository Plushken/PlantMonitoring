import React from 'react';
import { Pressable, Text, StyleSheet, PressableProps, ViewStyle, TextStyle } from 'react-native';

interface PrimaryButtonProps extends PressableProps {
  label: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  style,
  textStyle,
  accessibilityLabel,
  ...props
}) => (
  <Pressable
    style={({ pressed }) => [styles.button, style, pressed && styles.pressed]}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel || label}
    {...props}
  >
    <Text style={[styles.text, textStyle]}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0A5C5C',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
    letterSpacing: 1,
  },
});

export default PrimaryButton; 