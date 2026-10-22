import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, Spacing } from '../theme';

interface RomanButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  style?: ViewStyle;
}

export const RomanButton: React.FC<RomanButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  style,
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'danger':
        return Colors.expiatioRed;
      case 'secondary':
        return 'transparent';
      case 'primary':
      default:
        return Colors.tyrianPurple;
    }
  };

  const getTextColor = () => {
    if (variant === 'secondary') return Colors.bronzeGold;
    return Colors.stoneLight;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: Colors.bronzeGold,
        },
        style,
      ]}
    >
      <Text style={[Typography.monumentalTitle, styles.buttonText, { color: getTextColor() }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1.5,
    borderRadius: 2,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.xs,
  },
  buttonText: {
    fontSize: 14,
    letterSpacing: 2,
  },
});
