import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AlertSummary } from '@/components/AlertSummary';
import { ChipSelect, type ChipOption } from '@/components/ChipSelect';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { CustomButton } from '@/components/CustomButton';
import { FlashMessage } from '@/components/FlashMessage';
import { OccurrenceCard } from '@/components/OccurrenceCard';
import { useAuth } from '@/context/AuthContext';
import { useOccurrences } from '@/context/OccurrencesContext';
import { AREAS, areaLabels } from '@/data/labels';
import { can } from '@/services/permissions';
import type { AlertLevel, Area } from '@/types/Occurrence';
import { sortOccurrences } from '@/utils/sortOccurrences';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

type AreaFilter = Area | 'all';

const areaOptions: ChipOption<AreaFilter>[] = [
  { value: 'all', label: 'Todas' },
  ...AREAS.map((area) => ({ value: area, label: areaLabels[area] })),
];

export default function OccurrencesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { occurrences, isLoading, notice, clearNotice, resetDemoData } = useOccurrences();
  const [areaFilter, setAreaFilter] = useState<AreaFilter>('all');
  const [levelFilter, setLevelFilter] = useState<AlertLevel | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  const visible = sortOccurrences(
    occurrences.filter(
      (o) => (areaFilter === 'all' || o.area === areaFilter) && (levelFilter === null || o.alertLevel === levelFilter),
    ),
  );

  const handleReset = async () => {
    setConfirmReset(false);
    await resetDemoData();
  };

  const header = (
    <View style={styles.header}>
      <FlashMessage message={notice} onHide={clearNotice} />
      <AlertSummary occurrences={occurrences} selected={levelFilter} onSelect={setLevelFilter} />
      <ChipSelect label="Área" options={areaOptions} value={areaFilter} onChange={setAreaFilter} />
      {can(user, 'resetDemoData') && (
        <CustomButton
          label="Restaurar dados de exemplo"
          variant="secondary"
          onPress={() => setConfirmReset(true)}
          style={styles.resetButton}
        />
      )}
      <Text style={styles.count}>
        {visible.length} {visible.length === 1 ? 'ocorrência' : 'ocorrências'}
      </Text>
    </View>
  );

  return (
    <View style={styles.root}>
      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={header}
        renderItem={({ item }) => (
          <OccurrenceCard occurrence={item} onPress={() => router.push(`/occurrence/${item.id}`)} />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={28} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>Nenhuma ocorrência encontrada</Text>
            <Text style={styles.emptyText}>Ajuste os filtros de nível ou de área para ver outros registros.</Text>
          </View>
        }
        contentContainerStyle={styles.list}
        style={styles.listView}
      />

      <Pressable
        onPress={() => router.push('/occurrence/new')}
        accessibilityRole="button"
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
      >
        <Ionicons name="add" size={20} color={colors.textPrimary} />
        <Text style={styles.fabText}>Nova ocorrência</Text>
      </Pressable>

      <ConfirmDialog
        visible={confirmReset}
        title="Restaurar dados de exemplo?"
        message="Todas as ocorrências registradas e alterações de status serão substituídas pelo catálogo inicial simulado."
        confirmLabel="Restaurar"
        onConfirm={handleReset}
        onCancel={() => setConfirmReset(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  listView: { flex: 1 },
  list: {
    padding: spacing.lg,
    paddingBottom: 96,
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
  },
  header: { gap: spacing.md, marginBottom: spacing.md },
  resetButton: { alignSelf: 'flex-start' },
  count: { color: colors.textSecondary, fontSize: 12 },
  separator: { height: spacing.sm },
  empty: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  emptyTitle: { color: colors.textPrimary, fontSize: 15, fontWeight: '600' },
  emptyText: { color: colors.textSecondary, fontSize: 13, textAlign: 'center', paddingHorizontal: spacing.lg },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.accent,
    borderRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  fabPressed: { opacity: 0.85 },
  fabText: { color: colors.textPrimary, fontSize: 14, fontWeight: '600' },
});
