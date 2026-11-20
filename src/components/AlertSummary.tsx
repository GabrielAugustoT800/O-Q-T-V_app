import { Pressable, StyleSheet, Text, View } from 'react-native';
import { alertColor } from './AlertBadge';
import { ALERT_LEVELS, alertLevelLabels } from '@/data/labels';
import type { AlertLevel, Occurrence } from '@/types/Occurrence';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

interface Props {
  occurrences: Occurrence[];
  selected: AlertLevel | null;
  onSelect: (level: AlertLevel | null) => void;
}

export function AlertSummary({ occurrences, selected, onSelect }: Props) {
  return (
    <View style={styles.row}>
      {ALERT_LEVELS.map((level) => {
        const count = occurrences.filter((o) => o.alertLevel === level).length;
        const isSelected = selected === level;
        return (
          <Pressable
            key={level}
            onPress={() => onSelect(isSelected ? null : level)}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            style={({ pressed }) => [
              styles.item,
              { borderTopColor: alertColor[level] },
              isSelected && { borderColor: alertColor[level], backgroundColor: colors.surfaceRaised },
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.count, { color: alertColor[level] }]}>{count}</Text>
            <Text style={styles.label}>{alertLevelLabels[level]}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm },
  item: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopWidth: 3,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: 2,
  },
  pressed: { backgroundColor: colors.surfaceRaised },
  count: { fontSize: 22, fontWeight: '700' },
  label: { color: colors.textSecondary, fontSize: 12 },
});
