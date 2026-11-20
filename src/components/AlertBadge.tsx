import { StyleSheet, Text, View } from 'react-native';
import { alertLevelLabels } from '@/data/labels';
import type { AlertLevel } from '@/types/Occurrence';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export const alertColor: Record<AlertLevel, string> = {
  normal: colors.alertNormal,
  atypical: colors.alertAtypical,
  critical: colors.alertCritical,
};

interface Props {
  level: AlertLevel;
  size?: 'small' | 'large';
}

export function AlertBadge({ level, size = 'small' }: Props) {
  const isLarge = size === 'large';
  return (
    <View
      style={[
        styles.badge,
        { borderColor: alertColor[level] },
        isLarge && styles.badgeLarge,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: alertColor[level] }, isLarge && styles.dotLarge]} />
      <Text style={[styles.text, { color: alertColor[level] }, isLarge && styles.textLarge]}>
        {alertLevelLabels[level]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  badgeLarge: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  dot: { width: 6, height: 6, borderRadius: 3 },
  dotLarge: { width: 8, height: 8, borderRadius: 4 },
  text: { fontSize: 12, fontWeight: '600' },
  textLarge: { fontSize: 15 },
});
