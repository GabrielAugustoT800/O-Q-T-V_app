import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AlertBadge } from '@/components/AlertBadge';
import { ChipSelect, type ChipOption } from '@/components/ChipSelect';
import { CustomButton } from '@/components/CustomButton';
import { FormField } from '@/components/FormField';
import { useOccurrences } from '@/context/OccurrencesContext';
import { AREAS, OCCURRENCE_TYPES, areaLabels, occurrenceTypeLabels } from '@/data/labels';
import type { Area, AuthorizationLevel, OccurrenceType } from '@/types/Occurrence';
import { requiredLevelForArea } from '@/utils/authorization';
import { classifyOccurrence, isAuthorizationMismatch } from '@/utils/classifyOccurrence';
import { validateOccurrence, type OccurrenceFormInput, type ValidationErrors } from '@/utils/validators';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

type LevelOption = AuthorizationLevel | 'none';

const areaOptions: ChipOption<Area>[] = AREAS.map((area) => ({ value: area, label: areaLabels[area] }));
const typeOptions: ChipOption<OccurrenceType>[] = OCCURRENCE_TYPES.map((type) => ({
  value: type,
  label: occurrenceTypeLabels[type],
}));
const levelOptions: ChipOption<LevelOption>[] = [
  { value: 'none', label: 'Não informado' },
  { value: 1, label: 'Nível 1' },
  { value: 2, label: 'Nível 2' },
  { value: 3, label: 'Nível 3' },
];

function isArea(value: unknown): value is Area {
  return typeof value === 'string' && (AREAS as string[]).includes(value);
}

export default function CreateOccurrenceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ area?: string }>();
  const { addOccurrence } = useOccurrences();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [area, setArea] = useState<Area | null>(isArea(params.area) ? params.area : null);
  const [occurrenceType, setOccurrenceType] = useState<OccurrenceType | null>(null);
  const [personDetected, setPersonDetected] = useState(false);
  const [bleTagId, setBleTagId] = useState('');
  const [level, setLevel] = useState<LevelOption>('none');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const formInput: OccurrenceFormInput = {
    title,
    description,
    area,
    occurrenceType,
    personDetected,
    bleTagId,
    authorizationLevel: level === 'none' ? null : level,
  };

  const liveErrors = useMemo(() => validateOccurrence(formInput), [formInput]);
  const visibleErrors = submitted ? liveErrors : errors;

  const preview = useMemo(() => {
    if (!area || !occurrenceType) return null;
    const input = {
      occurrenceType,
      area,
      authorizationLevel: level === 'none' ? undefined : level,
    };
    return {
      level: classifyOccurrence(input),
      mismatch: isAuthorizationMismatch(input),
    };
  }, [area, occurrenceType, level]);

  const handleSubmit = async () => {
    setSubmitted(true);
    setErrors(liveErrors);
    if (Object.keys(liveErrors).length > 0) return;
    if (!area || !occurrenceType) return;

    setIsSaving(true);
    try {
      await addOccurrence({
        title: title.trim(),
        description: description.trim(),
        area,
        occurrenceType,
        personDetected,
        bleTagId: bleTagId.trim() ? bleTagId.trim() : undefined,
        authorizationLevel: level === 'none' ? undefined : level,
      });
      router.replace('/(tabs)/occurrences');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <FormField
        label="Título"
        required
        value={title}
        onChangeText={setTitle}
        placeholder="Resumo da ocorrência simulada"
        error={visibleErrors.title}
      />

      <FormField
        label="Descrição"
        required
        value={description}
        onChangeText={setDescription}
        placeholder="Descreva o evento simulado com no mínimo 10 caracteres"
        multiline
        numberOfLines={4}
        style={styles.textarea}
        error={visibleErrors.description}
      />

      <ChipSelect
        label="Área"
        required
        options={areaOptions}
        value={area}
        onChange={setArea}
        error={visibleErrors.area}
      />

      <ChipSelect
        label="Tipo de ocorrência"
        required
        options={typeOptions}
        value={occurrenceType}
        onChange={setOccurrenceType}
        error={visibleErrors.occurrenceType}
      />

      <View style={styles.switchRow}>
        <View style={styles.switchLabels}>
          <Text style={styles.switchLabel}>Pessoa detectada</Text>
          <Text style={styles.switchValue}>{personDetected ? 'Sim' : 'Não'}</Text>
        </View>
        <Switch
          value={personDetected}
          onValueChange={setPersonDetected}
          trackColor={{ false: colors.border, true: colors.accent }}
          thumbColor={colors.textPrimary}
        />
      </View>

      <FormField
        label="Identificador BLE (opcional)"
        value={bleTagId}
        onChangeText={setBleTagId}
        placeholder="TAG123"
        autoCapitalize="characters"
        error={visibleErrors.bleTagId}
      />

      <ChipSelect label="Nível de autorização (opcional)" options={levelOptions} value={level} onChange={setLevel} />

      <View style={styles.previewBox}>
        <Text style={styles.previewLabel}>Esta ocorrência será classificada como:</Text>
        {preview ? (
          <>
            <AlertBadge level={preview.level} size="large" />
            {preview.mismatch && area && level !== 'none' && (
              <Text style={styles.previewReason}>
                Nível {level} não autorizado para {areaLabels[area]} (exige nível {requiredLevelForArea(area)}).
              </Text>
            )}
          </>
        ) : (
          <Text style={styles.previewPending}>Selecione a área e o tipo para ver a classificação.</Text>
        )}
      </View>

      <View style={styles.actions}>
        <CustomButton label="Cancelar" variant="secondary" onPress={() => router.back()} style={styles.action} />
        <CustomButton label="Registrar" onPress={handleSubmit} isLoading={isSaving} style={styles.action} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
  },
  textarea: { minHeight: 96, textAlignVertical: 'top' },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  switchLabels: { gap: 2 },
  switchLabel: { color: colors.textSecondary, fontSize: 13 },
  switchValue: { color: colors.textPrimary, fontSize: 15 },
  previewBox: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  previewLabel: { color: colors.textSecondary, fontSize: 13 },
  previewReason: { color: colors.alertCritical, fontSize: 13 },
  previewPending: { color: colors.textSecondary, fontSize: 13, fontStyle: 'italic' },
  actions: { flexDirection: 'row', gap: spacing.sm },
  action: { flex: 1 },
});
