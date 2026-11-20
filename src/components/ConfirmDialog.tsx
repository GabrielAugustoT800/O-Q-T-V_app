import { Modal, StyleSheet, Text, View } from 'react-native';
import { CustomButton } from './CustomButton';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ visible, title, message, confirmLabel = 'Confirmar', onConfirm, onCancel }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <CustomButton label="Cancelar" variant="secondary" onPress={onCancel} style={styles.action} />
            <CustomButton label={confirmLabel} variant="danger" onPress={onConfirm} style={styles.action} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  dialog: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: { color: colors.textPrimary, fontSize: 18, fontWeight: '600' },
  message: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
  actions: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'flex-end' },
  action: { flexGrow: 1 },
});
