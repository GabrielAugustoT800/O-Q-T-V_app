import type { Area, AuthorizationLevel } from './Occurrence';

export interface Camera {
  id: string;
  area: Area;
  label: string;
  requiredLevel: AuthorizationLevel;
  source: number | null;
}