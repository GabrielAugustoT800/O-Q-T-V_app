import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraTile } from '@/components/CameraTile';
import { useOccurrences } from '@/context/OccurrencesContext';
import { cameras } from '@/data/cameras';
import { colors } from '@/theme/colors';
import { layout, spacing } from '@/theme/spacing';

export default function CamerasScreen() {
  const router = useRouter();
  const { occurrences } = useOccurrences();
  const { width } = useWindowDimensions();
  const isWide = width >= layout.wideBreakpoint;

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Central de câmeras</Text>
      <Text style={styles.subtitle}>Três áreas fictícias · toque em uma câmera para ampliar</Text>
      <View style={[styles.grid, isWide && styles.gridWide]}>
        {cameras.map((camera) => (
          <View key={camera.id} style={isWide ? styles.cellWide : styles.cell}>
            <CameraTile
              camera={camera}
              occurrences={occurrences.filter((o) => o.area === camera.area)}
              onPress={() => router.push(`/camera/${encodeURIComponent(camera.area)}`)}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: spacing.lg,
    gap: spacing.sm,
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
  },
  title: { color: colors.textPrimary, fontSize: 20, fontWeight: '600' },
  subtitle: { color: colors.textSecondary, fontSize: 13, marginBottom: spacing.sm },
  grid: { gap: spacing.lg },
  gridWide: { flexDirection: 'row' },
  cell: { width: '100%' },
  cellWide: { flex: 1 },
});
