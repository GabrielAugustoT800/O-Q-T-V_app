import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  occurrences: '@oqtv:occurrences',
  session: '@oqtv:session',
} as const;

export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Erro ao ler ${key}`, error);
    return null;
  }
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Erro ao gravar ${key}`, error);
  }
}

export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Erro ao remover ${key}`, error);
  }
}

export const storageKeys = KEYS;