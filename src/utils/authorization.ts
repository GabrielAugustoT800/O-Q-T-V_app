import type { Area, AuthorizationLevel } from '@/types/Occurrence';

const REQUIRED_LEVEL: Record<Area, AuthorizationLevel> = {
  'Area 1': 1,
  'Area 2': 2,
  'Area 3': 3,
};

export function requiredLevelForArea(area: Area): AuthorizationLevel {
  return REQUIRED_LEVEL[area];
}

export function isAuthorizedForArea(level: AuthorizationLevel, area: Area): boolean {
  return level >= requiredLevelForArea(area);
}
