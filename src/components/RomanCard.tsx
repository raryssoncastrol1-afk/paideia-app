import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, Spacing } from '../theme';

interface RomanCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  variant?: 'travertine' | 'purple' | 'alert';
  style?: ViewStyle;
}

export const RomanCard: React.FC<RomanCardProps> = ({
  title,
  subtitle,
  children,
  variant = 'travertine',
  style,
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'purple':
        return Colors.tyrianPurple;
      case 'alert':
        return Colors.expiatioRed;
      case 'travertine':
      default:
        return Colors.cardTravertine;
    }
  };

  const isDarkVariant = variant === 'purple' || variant === 'alert';

  return (
    <View style={[styles.card, { backgroundColor: getBackgroundColor() }, style]}>
      {/* Moldura de bronze lapidar */}
      <View style={styles.innerBorder}>
        {title && (
          <Text
            style={[
              Typography.sectionTitle,
              styles.title,
              { color: isDarkVariant ? Colors.bronzeGold : Colors.stoneInk },
            ]}
          >
            {title}
          </Text>
        )}
        {subtitle && (
          <Text
            style={[
              Typography.latinMotto,
              styles.subtitle,
              { color: isDarkVariant ? Colors.stoneLight : Colors.stoneMuted },
            ]}
          >
            {subtitle}
          </Text>
        )}
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 2, // Sem cantos arredondados modernos; linhas arquitetônicas
    borderWidth: 1.5,
    borderColor: Colors.bronzeGold,
    padding: Spacing.sm,
    marginVertical: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  innerBorder: {
    borderWidth: 0.8,
    borderColor: Colors.bronzeDark,
    padding: Spacing.md,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  subtitle: {
    marginBottom: Spacing.md,
  },
});
