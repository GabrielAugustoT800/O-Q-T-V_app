export type Area = 'Area 1' | 'Area 2' | 'Area 3';

export type AuthorizationLevel = 1 | 2 | 3;

export type OccurrenceType =
  | 'normal'
  | 'person_without_id'
  | 'unknown_tag'
  | 'insufficient_authorization'
  | 'facial_divergence'
  | 'communication_failure'
  | 'inconclusive_association';

export type AlertLevel = 'normal' | 'atypical' | 'critical';
export type OccurrenceStatus = 'open' | 'under_review' | 'resolved';

export interface Occurrence {
  id: string;
  title: string;
  description: string;
  area: Area;
  occurrenceType: OccurrenceType;
  alertLevel: AlertLevel;
  status: OccurrenceStatus;
  timestamp: string;
  personDetected: boolean;
  bleTagId?: string;
  authorizationLevel?: AuthorizationLevel;
  createdBy?: string;
}

export type NewOccurrenceInput = Omit<
  Occurrence,
  'id' | 'alertLevel' | 'status' | 'timestamp' | 'createdBy'
>;