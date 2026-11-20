import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { alertColor } from './AlertBadge';
import { CameraFeed } from './CameraFeed';
import { areaLabels } from '@/data/labels';
import type { Camera } from '@/types/Camera';
import type { Occurrence } from '@/types/Occurrence';
import { worstUnresolvedLevel } from '@/utils/sortOccurrences';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

interface Props {
  camera: Camera;
  occurrences: Occurrence[];
  onPress?: () => void;
  showFooter?: boolean;
}

export function hasOpenCommunicationFailure(occurrences: Occurrence[]): boolean {
  return occurrences.some((o) => o.occurrenceType === 'communication_failure' && o.status === 'open');
}

function useClock(): string {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return now.toLocaleTimeString('pt-BR');
}

export function CameraTile({ camera, occurrences, onPress, showFooter = true }: Props) {
  const clock = useClock();
  const borderColor = alertColor[worstUnresolvedLevel(occurrences)];
  const openCount = occurrences.filter((o) => o.status === 'open').length;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      style={({ pressed }) => [styles.tile, { borderColor }, pressed && styles.pressed]}
    >
      <View style={styles.screen}>
        <CameraFeed area={camera.area} source={camera.source} noSignal={hasOpenCommunicationFailure(occurrences)} />
        <View style={styles.overlayTop}>
          <Text style={styles.overlayText}>
            {areaLabels[camera.area].toUpperCase()} · {camera.id} · SIMULAÇÃO
          </Text>
          <Text style={styles.overlayText}>{clock}</Text>
        </View>
      </View>
      {showFooter && (
        <View style={styles.footer}>
          <Text style={styles.label}>{camera.label}</Text>
          <Text style={styles.meta}>
            Acesso: nível {camera.requiredLevel}+ · {openCount} {openCount === 1 ? 'aberta' : 'abertas'}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    borderWidth: 2,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  pressed: { opacity: 0.9 },
  screen: { width: '100%', aspectRatio: 16 / 9, backgroundColor: colors.monitor },
  overlayTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.sm,
  },
  overlayText: {
    color: colors.textPrimary,
    fontSize: 11,
    letterSpacing: 0.5,
    backgroundColor: colors.overlay,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 3,
  },
  footer: { padding: spacing.md, gap: 2, borderTopWidth: 1, borderTopColor: colors.border },
  label: { color: colors.textPrimary, fontSize: 15, fontWeight: '600' },
  meta: { color: colors.textSecondary, fontSize: 12 },
});
