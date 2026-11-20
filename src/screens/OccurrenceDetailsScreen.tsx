import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AlertBadge } from '@/components/AlertBadge';
import { ChipSelect, type ChipOption } from '@/components/ChipSelect';
import { CustomButton } from '@/components/CustomButton';
import { StatusBadge } from '@/components/StatusBadge';
import { useAuth } from '@/context/AuthContext';
import { useOccurrences } from '@/context/OccurrencesContext';
import { STATUSES, areaLabels, occurrenceTypeLabels, statusLabels } from '@/data/labels';
import { can } from '@/services/permissions';
import type { OccurrenceStatus } from '@/types/Occurrence';
import { isAuthorizedForArea, requiredLevelForArea } from '@/utils/authorization';
import { formatDateTime } from '@/utils/formatDate';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const statusOptions: ChipOption<OccurrenceStatus>[] = STATUSES.map((status) => ({
  value: status,
  label: statusLabels[status],
}));

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Row({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, valueColor ? { color: valueColor } : null]}>{value}</Text>
    </View>
  );
}

export default function OccurrenceDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { occurrences, isLoading, updateStatus } = useOccurrences();

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/(tabs)/occurrences'));

  if (isLoading) return <View style={styles.root} />;

  const occurrence = occurrences.find((o) => o.id === id);

  if (!occurrence) {
    return (
      <View style={[styles.root, styles.notFound]}>
        <Ionicons name="alert-circle-outline" size={32} color={colors.textSecondary} />
        <Text style={styles.notFoundTitle}>Ocorrência não encontrada</Text>
        <Text style={styles.notFoundText}>Não existe ocorrência com o identificador "{id}".</Text>
        <CustomButton label="Voltar para a lista" variant="secondary" onPress={goBack} />
      </View>
    );
  }

  const requiredLevel = requiredLevelForArea(occurrence.area);
  const informedLevel = occurrence.authorizationLevel;
  const compatible = informedLevel !== undefined ? isAuthorizedForArea(informedLevel, occurrence.area) : null;

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <AlertBadge level={occurrence.alertLevel} size="large" />
        <Text style={styles.id}>Ocorrência #{occurrence.id}</Text>
        <Text style={styles.title}>{occurrence.title}</Text>
        <Text style={styles.description}>{occurrence.description}</Text>
      </View>

      {occurrence.occurrenceType === 'facial_divergence' && (
        <View style={styles.notice}>
          <Ionicons name="information-circle-outline" size={18} color={colors.alertAtypical} />
          <Text style={styles.noticeText}>Requer revisão humana – não constitui identificação conclusiva.</Text>
        </View>
      )}

      <Section title="Identificação">
        <Row label="Tipo" value={occurrenceTypeLabels[occurrence.occurrenceType]} />
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Status</Text>
          <StatusBadge status={occurrence.status} />
        </View>
      </Section>

      <Section title="Local e horário">
        <Row label="Área" value={areaLabels[occurrence.area]} />
        <Row label="Data e hora" value={formatDateTime(occurrence.timestamp)} />
      </Section>

      <Section title="Pessoa e tag BLE">
        <Row label="Pessoa detectada" value={occurrence.personDetected ? 'Sim' : 'Não'} />
        <Row label="Tag BLE" value={occurrence.bleTagId ?? 'Não informada'} />
      </Section>

      <Section title="Autorização">
        <Row label="Nível informado" value={informedLevel !== undefined ? `Nível ${informedLevel}` : 'Não informado'} />
        <Row label="Nível exigido pela área" value={`Nível ${requiredLevel}`} />
        <Row
          label="Situação"
          value={compatible === null ? 'Sem nível para comparar' : compatible ? 'Compatível' : 'Incompatível'}
          valueColor={compatible === null ? undefined : compatible ? colors.alertNormal : colors.alertCritical}
        />
      </Section>

      <Section title="Status da ocorrência">
        {can(user, 'changeStatus') ? (
          <ChipSelect
            options={statusOptions}
            value={occurrence.status}
            onChange={(status) => updateStatus(occurrence.id, status)}
          />
        ) : (
          <Text style={styles.readOnly}>
            Somente supervisores podem alterar o status. Status atual: {statusLabels[occurrence.status]}.
          </Text>
        )}
      </Section>

      <CustomButton label="Voltar" variant="secondary" onPress={goBack} />
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
  header: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  id: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  title: { color: colors.textPrimary, fontSize: 22, fontWeight: '600' },
  description: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
  notice: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.alertAtypical,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  noticeText: { color: colors.textPrimary, fontSize: 13, flex: 1 },
  section: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  sectionTitle: { color: colors.textPrimary, fontSize: 15, fontWeight: '600' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md },
  rowLabel: { color: colors.textSecondary, fontSize: 13 },
  rowValue: { color: colors.textPrimary, fontSize: 14, flexShrink: 1, textAlign: 'right' },
  readOnly: { color: colors.textSecondary, fontSize: 13 },
  notFound: { alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.lg },
  notFoundTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '600' },
  notFoundText: { color: colors.textSecondary, fontSize: 14, textAlign: 'center' },
});
