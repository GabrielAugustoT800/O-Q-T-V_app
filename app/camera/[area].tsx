import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import CameraAreaScreen from '@/screens/CameraAreaScreen';

export default function CameraAreaRoute() {
  const { user } = useAuth();
  if (!user) return <Redirect href="/login" />;
  return <CameraAreaScreen />;
}
