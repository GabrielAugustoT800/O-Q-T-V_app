import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

interface Props {
  message: string | null;
  onHide: () => void;
  durationMs?: number;
}

export function FlashMessage({ message, onHide, durationMs = 3000 }: Props) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onHide, durationMs);
    return () => clearTimeout(timer);
  }, [message, onHide, durationMs]);

  if (!message) return null;

  return (
    <View style={styles.flash} accessibilityLiveRegion="polite">
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flash: {
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.alertNormal,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  text: { color: colors.textPrimary, fontSize: 14 },
});
