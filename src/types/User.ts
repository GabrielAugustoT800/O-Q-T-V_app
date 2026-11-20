export type UserRole = 'operator' | 'supervisor';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export type SessionUser = Omit<User, 'password'>;