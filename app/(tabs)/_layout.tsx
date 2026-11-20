import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { roleLabels } from '@/data/labels';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

function HeaderUser() {
  const { user, signOut } = useAuth();
  if (!user) return null;
  return (
    <View style={styles.headerRight}>
      <Text style={styles.userText} numberOfLines={1}>
        {user.name} · {roleLabels[user.role]}
      </Text>
      <Pressable onPress={signOut} style={styles.logout} accessibilityRole="button">
        <Ionicons name="log-out-outline" size={16} color={colors.textPrimary} />
        <Text style={styles.logoutText}>Sair</Text>
      </Pressable>
    </View>
  );
}

export default function TabsLayout() {
  const { user } = useAuth();
  if (!user) return <Redirect href="/login" />;

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
        headerShadowVisible: false,
        headerRight: () => <HeaderUser />,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.textPrimary,
        tabBarInactiveTintColor: colors.textSecondary,
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen
        name="cameras"
        options={{
          title: 'Câmeras',
          tabBarIcon: ({ color, size }) => <Ionicons name="videocam-outline" color={color ? String(color) : undefined} size={size} />,
        }}
      />
      <Tabs.Screen
        name="occurrences"
        options={{
          title: 'Ocorrências',
          tabBarIcon: ({ color, size }) => <Ionicons name="list-outline" color={color ? String(color) : undefined} size={size} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingRight: spacing.lg },
  userText: { color: colors.textSecondary, fontSize: 12, maxWidth: 180 },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  logoutText: { color: colors.textPrimary, fontSize: 12 },
});
