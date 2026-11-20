import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { NewOccurrenceInput, Occurrence, OccurrenceStatus } from '@/types/Occurrence';
import * as occurrenceService from '@/services/occurrenceService';
import { useAuth } from './AuthContext';

interface OccurrencesContextValue {
  occurrences: Occurrence[];
  isLoading: boolean;
  notice: string | null;
  clearNotice: () => void;
  addOccurrence: (input: NewOccurrenceInput) => Promise<Occurrence>;
  updateStatus: (id: string, status: OccurrenceStatus) => Promise<void>;
  resetDemoData: () => Promise<void>;
  refresh: () => Promise<void>;
}

const OccurrencesContext = createContext<OccurrencesContextValue | null>(null);

export function OccurrencesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const list = await occurrenceService.initOccurrences();
    setOccurrences(list);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const clearNotice = useCallback(() => setNotice(null), []);

  const addOccurrence = useCallback(
    async (input: NewOccurrenceInput) => {
      const created = await occurrenceService.add(input, user);
      setOccurrences((prev) => [...prev, created]);
      setNotice(`Ocorrência #${created.id} registrada.`);
      return created;
    },
    [user],
  );

  const updateStatus = useCallback(async (id: string, status: OccurrenceStatus) => {
    const updated = await occurrenceService.updateStatus(id, status);
    setOccurrences(updated);
  }, []);

  const resetDemoData = useCallback(async () => {
    const seed = await occurrenceService.resetToSeed();
    setOccurrences(seed);
    setNotice('Dados de exemplo restaurados.');
  }, []);

  const value = useMemo(
    () => ({ occurrences, isLoading, notice, clearNotice, addOccurrence, updateStatus, resetDemoData, refresh }),
    [occurrences, isLoading, notice, clearNotice, addOccurrence, updateStatus, resetDemoData, refresh],
  );

  return <OccurrencesContext.Provider value={value}>{children}</OccurrencesContext.Provider>;
}

export function useOccurrences(): OccurrencesContextValue {
  const ctx = useContext(OccurrencesContext);
  if (!ctx) throw new Error('useOccurrences deve ser usado dentro de OccurrencesProvider');
  return ctx;
}
