import type { AlertLevel, Area, OccurrenceStatus, OccurrenceType } from '@/types/Occurrence';
import type { UserRole } from '@/types/User';

export const AREAS: Area[] = ['Area 1', 'Area 2', 'Area 3'];

export const OCCURRENCE_TYPES: OccurrenceType[] = [
  'normal',
  'person_without_id',
  'unknown_tag',
  'insufficient_authorization',
  'facial_divergence',
  'communication_failure',
  'inconclusive_association',
];

export const ALERT_LEVELS: AlertLevel[] = ['normal', 'atypical', 'critical'];

export const STATUSES: OccurrenceStatus[] = ['open', 'under_review', 'resolved'];

export const areaLabels: Record<Area, string> = {
  'Area 1': 'Área 1',
  'Area 2': 'Área 2',
  'Area 3': 'Área 3',
};

export const occurrenceTypeLabels: Record<OccurrenceType, string> = {
  normal: 'Evento normal',
  person_without_id: 'Pessoa sem identificação associada',
  unknown_tag: 'Tag desconhecida',
  insufficient_authorization: 'Autorização insuficiente',
  facial_divergence: 'Divergência facial',
  communication_failure: 'Falha de comunicação',
  inconclusive_association: 'Associação inconclusiva',
};

export const alertLevelLabels: Record<AlertLevel, string> = {
  normal: 'Normal',
  atypical: 'Atípica',
  critical: 'Crítica',
};

export const statusLabels: Record<OccurrenceStatus, string> = {
  open: 'Aberto',
  under_review: 'Em análise',
  resolved: 'Resolvido',
};

export const roleLabels: Record<UserRole, string> = {
  operator: 'Operador',
  supervisor: 'Supervisor',
};
