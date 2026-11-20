import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { CustomButton } from '@/components/CustomButton';
import { FormField } from '@/components/FormField';
import { useAuth } from '@/context/AuthContext';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { validateLogin, type LoginErrors } from '@/utils/validators';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setSubmitError(null);
    const validation = validateLogin(email, password);
    setErrors(validation);
    if (validation.email || validation.password) return;

    try {
      setIsLoading(true);
      await signIn(email, password);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Não foi possível entrar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <View style={styles.brandBlock}>
          <Text style={styles.brand}>O-Q-T-V</Text>
          <Text style={styles.brandName}>Olho Que Tudo Vê</Text>
          <Text style={styles.subtitle}>AMAZUL – Nuclear Sentinel</Text>
        </View>

        <FormField
          label="E-mail"
          required
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          placeholder="operador@oqtv.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          error={errors.email}
        />

        <FormField
          label="Senha"
          required
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          placeholder="••••••"
          secureTextEntry
          error={errors.password}
        />

        {!!submitError && <Text style={styles.submitError}>{submitError}</Text>}

        <CustomButton label="Entrar" onPress={handleSubmit} isLoading={isLoading} />

        <View style={styles.accounts}>
          <Text style={styles.accountsTitle}>Contas de teste</Text>
          <Text style={styles.accountsLine}>operador@oqtv.com · oper123 · Operador</Text>
          <Text style={styles.accountsLine}>supervisor@oqtv.com · super123 · Supervisor</Text>
          <Text style={styles.accountsNote}>
            Login demonstrativo, sem autenticação segura. Todos os dados são fictícios.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    width: '100%',
    maxWidth: 420,
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  brandBlock: { alignItems: 'center', gap: 2, marginBottom: spacing.sm },
  brand: { color: colors.textPrimary, fontSize: 24, fontWeight: '700', letterSpacing: 2 },
  brandName: { color: colors.textPrimary, fontSize: 16 },
  subtitle: { color: colors.textSecondary, fontSize: 13 },
  submitError: { color: colors.error, fontSize: 13 },
  accounts: { marginTop: spacing.sm, gap: 2, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md },
  accountsTitle: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  accountsLine: { color: colors.textSecondary, fontSize: 12 },
  accountsNote: { color: colors.textSecondary, fontSize: 11, marginTop: spacing.xs, lineHeight: 16 },
});
