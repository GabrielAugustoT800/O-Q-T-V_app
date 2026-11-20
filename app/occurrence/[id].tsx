import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import OccurrenceDetailsScreen from '@/screens/OccurrenceDetailsScreen';

export default function OccurrenceDetailsRoute() {
  const { user } = useAuth();
  if (!user) return <Redirect href="/login" />;
  return <OccurrenceDetailsScreen />;
}
