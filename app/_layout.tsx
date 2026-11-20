import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SimulatedBanner } from '@/components/SimulatedBanner';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { OccurrencesProvider } from '@/context/OccurrencesContext';
import { colors } from '@/theme/colors';

function RootNavigator() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="occurrence/new" options={{ title: 'Nova ocorrência' }} />
      <Stack.Screen name="occurrence/[id]" options={{ title: 'Detalhes da ocorrência' }} />
      <Stack.Screen name="camera/[area]" options={{ title: 'Câmera' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <OccurrencesProvider>
          <StatusBar style="light" />
          <View style={styles.root}>
            <SimulatedBanner />
            <RootNavigator />
          </View>
        </OccurrencesProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
});
