import { StyleSheet, Text, View } from 'react-native';
import { statusLabels } from '@/data/labels';
import type { OccurrenceStatus } from '@/types/Occurrence';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export function StatusBadge({ status }: { status: OccurrenceStatus }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{statusLabels[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceRaised,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  text: { color: colors.textSecondary, fontSize: 12 },
});
