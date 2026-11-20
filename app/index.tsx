import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>O-Q-T-V – Olho Que Tudo Vê</Text>
      <Text style={styles.subtitle}>Tela provisória · Fase 1</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  title: { color: colors.textPrimary, fontSize: 22, fontWeight: '600' },
  subtitle: { color: colors.textSecondary, fontSize: 14, marginTop: spacing.sm },
});
