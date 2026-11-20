import type { SessionUser, UserRole } from '@/types/User';

export type Action = 'viewOccurrences' | 'createOccurrence' | 'changeStatus' | 'resetDemoData';

const PERMISSIONS: Record<UserRole, Action[]> = {
  operator: ['viewOccurrences', 'createOccurrence'],
  supervisor: ['viewOccurrences', 'createOccurrence', 'changeStatus', 'resetDemoData'],
};

export function can(user: SessionUser | null, action: Action): boolean {
  if (!user) return false;
  return PERMISSIONS[user.role].includes(action);
}
