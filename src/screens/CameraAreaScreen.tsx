import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { CameraTile } from '@/components/CameraTile';
import { CustomButton } from '@/components/CustomButton';
import { OccurrenceCard } from '@/components/OccurrenceCard';
import { useOccurrences } from '@/context/OccurrencesContext';
import { cameras } from '@/data/cameras';
import { areaLabels } from '@/data/labels';
import { sortOccurrences } from '@/utils/sortOccurrences';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

export default function CameraAreaScreen() {
  const router = useRouter();
  const { area } = useLocalSearchParams<{ area: string }>();
  const { occurrences } = useOccurrences();
  const camera = cameras.find((c) => c.area === area);

  if (!camera) {
    return (
      <View style={[styles.root, styles.notFound]}>
        <Text style={styles.notFoundText}>Área não encontrada.</Text>
        <CustomButton label="Voltar" variant="secondary" onPress={() => router.replace('/(tabs)/cameras')} />
      </View>
    );
  }

  const areaOccurrences = sortOccurrences(occurrences.filter((o) => o.area === camera.area));

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: `${areaLabels[camera.area]} · ${camera.label}` }} />
      <CameraTile camera={camera} occurrences={areaOccurrences} />
      <CustomButton
        label="Registrar ocorrência nesta área"
        onPress={() => router.push(`/occurrence/new?area=${encodeURIComponent(camera.area)}`)}
      />
      <Text style={styles.sectionTitle}>Ocorrências da {areaLabels[camera.area]}</Text>
      {areaOccurrences.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Nenhuma ocorrência registrada nesta área.</Text>
        </View>
      ) : (
        areaOccurrences.map((o) => (
          <OccurrenceCard key={o.id} occurrence={o} onPress={() => router.push(`/occurrence/${o.id}`)} />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
  },
  sectionTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: '600', marginTop: spacing.sm },
  empty: {
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  emptyText: { color: colors.textSecondary, fontSize: 13, textAlign: 'center' },
  notFound: { alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  notFoundText: { color: colors.textSecondary, fontSize: 14 },
});
