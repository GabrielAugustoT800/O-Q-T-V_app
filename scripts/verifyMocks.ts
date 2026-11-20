import { mockOccurrences } from '@/data/mockOccurrences';
import { mockUsers } from '@/data/mockUsers';
import { cameras } from '@/data/cameras';
import { ALERT_LEVELS, AREAS, OCCURRENCE_TYPES, STATUSES } from '@/data/labels';
import { classifyOccurrence } from '@/utils/classifyOccurrence';
import { isAuthorizedForArea } from '@/utils/authorization';
import { can } from '@/services/permissions';

const failures: string[] = [];
const check = (ok: boolean, message: string) => {
  if (!ok) failures.push(message);
};

function covers<T>(label: string, expected: readonly T[], actual: T[]) {
  const missing = expected.filter((value) => !actual.includes(value));
  check(missing.length === 0, `${label} sem cobertura: ${missing.join(', ')}`);
}

check(mockOccurrences.length === 8, `esperado 8 ocorrências, obtido ${mockOccurrences.length}`);
covers('Tipos', OCCURRENCE_TYPES, mockOccurrences.map((o) => o.occurrenceType));
covers('Áreas', AREAS, mockOccurrences.map((o) => o.area));
covers('Status', STATUSES, mockOccurrences.map((o) => o.status));
covers('Níveis', ALERT_LEVELS, mockOccurrences.map((o) => o.alertLevel));

for (const o of mockOccurrences) {
  check(classifyOccurrence(o) === o.alertLevel, `classificação incoerente em ${o.id}`);
}

const ids = mockOccurrences.map((o) => o.id);
check(ids.join(',') === '001,002,003,004,005,006,007,008', `IDs inesperados: ${ids.join(',')}`);

check(
  mockOccurrences.some((o) => o.occurrenceType === 'normal' && o.status === 'resolved' && o.area === 'Area 1'),
  'falta normal resolvida na Área 1',
);
check(
  mockOccurrences.some(
    (o) => o.occurrenceType === 'insufficient_authorization' && o.status === 'open' && o.alertLevel === 'critical',
  ),
  'falta autorização insuficiente aberta crítica',
);
check(
  mockOccurrences.some(
    (o) =>
      o.occurrenceType !== 'insufficient_authorization' &&
      o.authorizationLevel !== undefined &&
      !isAuthorizedForArea(o.authorizationLevel, o.area) &&
      o.alertLevel === 'critical',
  ),
  'falta caso crítico pela regra 6.2.1',
);
check(
  mockOccurrences.some((o) => o.occurrenceType === 'communication_failure' && o.status === 'open' && o.area === 'Area 3'),
  'falta falha de comunicação aberta na Área 3',
);
check(
  mockOccurrences.some((o) => o.occurrenceType === 'facial_divergence' && o.status === 'under_review'),
  'falta divergência facial em análise',
);

const authTable: [1 | 2 | 3, (typeof AREAS)[number], boolean][] = [
  [1, 'Area 1', true], [1, 'Area 2', false], [1, 'Area 3', false],
  [2, 'Area 1', true], [2, 'Area 2', true], [2, 'Area 3', false],
  [3, 'Area 1', true], [3, 'Area 2', true], [3, 'Area 3', true],
];
for (const [level, area, expected] of authTable) {
  check(isAuthorizedForArea(level, area) === expected, `autorização incorreta: nível ${level} em ${area}`);
}

const [operator, supervisor] = mockUsers.map(({ password: _password, ...rest }) => rest);
check(can(operator, 'createOccurrence') && !can(operator, 'changeStatus') && !can(operator, 'resetDemoData'), 'permissões do operador incorretas');
check(can(supervisor, 'changeStatus') && can(supervisor, 'resetDemoData'), 'permissões do supervisor incorretas');
check(!can(null, 'viewOccurrences'), 'usuário nulo não deveria ter permissão');
check(cameras.length === 3, 'esperado 3 câmeras');

if (failures.length > 0) {
  console.error(`FALHOU (${failures.length}):\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log('OK: mocks cobrem todos os tipos, áreas, status e níveis; classificação, autorização e permissões coerentes.');
