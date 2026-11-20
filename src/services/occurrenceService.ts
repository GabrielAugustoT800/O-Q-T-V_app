import type { NewOccurrenceInput, Occurrence, OccurrenceStatus } from '@/types/Occurrence';
import type { SessionUser } from '@/types/User';
import { mockOccurrences } from '@/data/mockOccurrences';
import { classifyOccurrence } from '@/utils/classifyOccurrence';
import { getItem, setItem, storageKeys } from './storageService';

async function save(list: Occurrence[]): Promise<void> {
  await setItem(storageKeys.occurrences, list);
}

export async function initOccurrences(): Promise<Occurrence[]> {
  const stored = await getItem<Occurrence[]>(storageKeys.occurrences);
  if (stored && stored.length > 0) return stored;
  await save(mockOccurrences);
  return [...mockOccurrences];
}

export async function getAll(): Promise<Occurrence[]> {
  return initOccurrences();
}

export async function getById(id: string): Promise<Occurrence | undefined> {
  const list = await getAll();
  return list.find((o) => o.id === id);
}

function nextId(list: Occurrence[]): string {
  const max = list.reduce((acc, o) => Math.max(acc, Number.parseInt(o.id, 10) || 0), 0);
  return String(max + 1).padStart(3, '0');
}

export async function add(input: NewOccurrenceInput, user: SessionUser | null): Promise<Occurrence> {
  const list = await getAll();
  const occurrence: Occurrence = {
    ...input,
    id: nextId(list),
    alertLevel: classifyOccurrence(input),
    status: 'open',
    timestamp: new Date().toISOString(),
    createdBy: user?.id,
  };
  await save([...list, occurrence]);
  return occurrence;
}

export async function updateStatus(id: string, status: OccurrenceStatus): Promise<Occurrence[]> {
  const list = await getAll();
  const updated = list.map((o) => (o.id === id ? { ...o, status } : o));
  await save(updated);
  return updated;
}

export async function resetToSeed(): Promise<Occurrence[]> {
  await save(mockOccurrences);
  return [...mockOccurrences];
}
