import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AlertBadge, alertColor } from './AlertBadge';
import { StatusBadge } from './StatusBadge';
import { areaLabels, occurrenceTypeLabels } from '@/data/labels';
import type { Occurrence } from '@/types/Occurrence';
import { formatDateTime } from '@/utils/formatDate';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

interface Props {
  occurrence: Occurrence;
  onPress?: () => void;
}

export function OccurrenceCard({ occurrence, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.card,
        { borderLeftColor: alertColor[occurrence.alertLevel] },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.headerRow}>
        <Text style={styles.id}>#{occurrence.id}</Text>
        <View style={styles.badges}>
          <AlertBadge level={occurrence.alertLevel} />
          <StatusBadge status={occurrence.status} />
        </View>
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {occurrence.title}
      </Text>
      <Text style={styles.type}>{occurrenceTypeLabels[occurrence.occurrenceType]}</Text>
      <Text style={styles.meta}>
        {areaLabels[occurrence.area]} · {formatDateTime(occurrence.timestamp)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  pressed: { backgroundColor: colors.surfaceRaised },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
  badges: { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap', justifyContent: 'flex-end' },
  id: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  title: { color: colors.textPrimary, fontSize: 16, fontWeight: '600' },
  type: { color: colors.textSecondary, fontSize: 14 },
  meta: { color: colors.textSecondary, fontSize: 12 },
});
