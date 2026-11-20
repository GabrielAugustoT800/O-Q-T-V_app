import type { SessionUser } from '@/types/User';
import { mockUsers } from '@/data/mockUsers';
import { getItem, removeItem, setItem, storageKeys } from './storageService';

export async function login(email: string, password: string): Promise<SessionUser> {
  const normalized = email.trim().toLowerCase();
  const user = mockUsers.find((u) => u.email.toLowerCase() === normalized && u.password === password);
  if (!user) throw new Error('E-mail ou senha inválidos');

  const { password: _password, ...session } = user;
  return session;
}

export async function saveSession(session: SessionUser): Promise<void> {
  await setItem(storageKeys.session, session);
}

export async function getSession(): Promise<SessionUser | null> {
  return getItem<SessionUser>(storageKeys.session);
}

export async function logout(): Promise<void> {
  await removeItem(storageKeys.session);
}
