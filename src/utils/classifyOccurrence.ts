import type { AlertLevel, Area, AuthorizationLevel, OccurrenceType } from '@/types/Occurrence';
import { isAuthorizedForArea } from './authorization';

export interface ClassificationInput {
  occurrenceType: OccurrenceType;
  area: Area;
  authorizationLevel?: AuthorizationLevel;
}

export function isAuthorizationMismatch(input: ClassificationInput): boolean {
  return (
    input.authorizationLevel !== undefined &&
    !isAuthorizedForArea(input.authorizationLevel, input.area)
  );
}

export function classifyOccurrence(input: ClassificationInput): AlertLevel {
  if (isAuthorizationMismatch(input)) return 'critical';

  switch (input.occurrenceType) {
    case 'insufficient_authorization':
      return 'critical';
    case 'normal':
      return 'normal';
    case 'person_without_id':
    case 'unknown_tag':
    case 'inconclusive_association':
    case 'communication_failure':
    case 'facial_divergence':
      return 'atypical';
    default:
      return 'atypical';
  }
}
