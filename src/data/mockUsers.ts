import type { User } from '@/types/User';

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Operador Teste',
    email: 'operador@oqtv.com',
    password: 'oper123',
    role: 'operator',
  },
  {
    id: 'u2',
    name: 'Supervisor Teste',
    email: 'supervisor@oqtv.com',
    password: 'super123',
    role: 'supervisor',
  },
];
