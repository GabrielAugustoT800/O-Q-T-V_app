import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import CreateOccurrenceScreen from '@/screens/CreateOccurrenceScreen';

export default function NewOccurrenceRoute() {
  const { user } = useAuth();
  if (!user) return <Redirect href="/login" />;
  return <CreateOccurrenceScreen />;
}
