import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export interface ChipOption<T> {
  value: T;
  label: string;
}

interface Props<T> {
  label?: string;
  options: ChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
  error?: string;
  required?: boolean;
}

export function ChipSelect<T>({ label, options, value, onChange, error, required }: Props<T>) {
  return (
    <View style={styles.container}>
      {!!label && (
        <Text style={styles.label}>
          {label}
          {required ? ' *' : ''}
        </Text>
      )}
      <View style={styles.chips}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <Pressable
              key={String(option.value)}
              onPress={() => onChange(option.value)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              style={({ pressed }) => [
                styles.chip,
                selected && styles.chipSelected,
                pressed && styles.chipPressed,
              ]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xs },
  label: { color: colors.textSecondary, fontSize: 13 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chipSelected: { borderColor: colors.accent, backgroundColor: colors.surfaceRaised },
  chipPressed: { backgroundColor: colors.surfaceRaised },
  chipText: { color: colors.textSecondary, fontSize: 13 },
  chipTextSelected: { color: colors.textPrimary, fontWeight: '600' },
  error: { color: colors.error, fontSize: 12 },
});
