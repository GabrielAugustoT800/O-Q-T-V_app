import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import LoginScreen from '@/screens/LoginScreen';

export default function LoginRoute() {
  const { user } = useAuth();
  if (user) return <Redirect href="/(tabs)/cameras" />;
  return <LoginScreen />;
}
