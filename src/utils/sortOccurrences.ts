import type { AlertLevel, Occurrence } from '@/types/Occurrence';

const ALERT_SEVERITY: Record<AlertLevel, number> = { normal: 0, atypical: 1, critical: 2 };

export function isOpenCritical(o: Occurrence): boolean {
  return o.alertLevel === 'critical' && o.status === 'open';
}

export function sortOccurrences(list: Occurrence[]): Occurrence[] {
  return [...list].sort((a, b) => {
    const aFirst = isOpenCritical(a) ? 1 : 0;
    const bFirst = isOpenCritical(b) ? 1 : 0;
    if (aFirst !== bFirst) return bFirst - aFirst;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
}

export function worstUnresolvedLevel(list: Occurrence[]): AlertLevel {
  return list
    .filter((o) => o.status !== 'resolved')
    .reduce<AlertLevel>(
      (worst, o) => (ALERT_SEVERITY[o.alertLevel] > ALERT_SEVERITY[worst] ? o.alertLevel : worst),
      'normal',
    );
}
