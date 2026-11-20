import type { Area, AuthorizationLevel, OccurrenceType } from '@/types/Occurrence';

export interface OccurrenceFormInput {
  title: string;
  description: string;
  area: Area | null;
  occurrenceType: OccurrenceType | null;
  personDetected: boolean;
  bleTagId: string;
  authorizationLevel: AuthorizationLevel | null;
}

export type OccurrenceFormField = 'title' | 'description' | 'area' | 'occurrenceType' | 'bleTagId';

export type ValidationErrors = Partial<Record<OccurrenceFormField, string>>;

const BLE_TAG_PATTERN = /^[A-Za-z0-9]+$/;

export function validateOccurrence(input: OccurrenceFormInput): ValidationErrors {
  const errors: ValidationErrors = {};
  const title = input.title.trim();
  const description = input.description.trim();
  const bleTagId = input.bleTagId.trim();

  if (!title) errors.title = 'Informe o título.';
  else if (title.length < 3) errors.title = 'O título deve ter pelo menos 3 caracteres.';

  if (!description) errors.description = 'Informe a descrição.';
  else if (description.length < 10) errors.description = 'A descrição deve ter pelo menos 10 caracteres.';

  if (!input.area) errors.area = 'Selecione a área.';
  if (!input.occurrenceType) errors.occurrenceType = 'Selecione o tipo de ocorrência.';

  if (bleTagId && !BLE_TAG_PATTERN.test(bleTagId)) {
    errors.bleTagId = 'Use apenas letras e números (ex.: TAG123).';
  }

  return errors;
}

export interface LoginErrors {
  email?: string;
  password?: string;
}

export function validateLogin(email: string, password: string): LoginErrors {
  const errors: LoginErrors = {};
  if (!email.trim()) errors.email = 'Informe o e-mail.';
  if (!password) errors.password = 'Informe a senha.';
  return errors;
}

export function hasErrors(errors: object): boolean {
  return Object.keys(errors).length > 0;
}
