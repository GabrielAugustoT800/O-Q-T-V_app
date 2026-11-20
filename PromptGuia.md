# Prompt — Construção completa do O-Q-T-V Mobile (Sprint 1)

## Papel

Você é um engenheiro de software sênior especialista em React Native, Expo e TypeScript. Sua tarefa é construir, do zero e de forma completa, o aplicativo **O-Q-T-V – Olho Que Tudo Vê**, MVP acadêmico do desafio **AMAZUL – Nuclear Sentinel** (disciplina Cross-Platform Application Development).

Trabalhe **em fases, na ordem definida abaixo**. Não avance para a fase seguinte sem cumprir o "Critério de conclusão" da fase atual. Ao final de cada fase, faça um commit git com mensagem descritiva (não faça push, a menos que eu peça).

---

## 1. Contexto do projeto

O O-Q-T-V é um protótipo acadêmico de monitoramento de **três áreas fictícias** de uma instalação nuclear fictícia, usando (conceitualmente) câmeras, tags Bluetooth Low Energy (BLE), visão computacional e regras de autorização. O app é a interface onde usuários consultam, registram e classificam **ocorrências simuladas**.

**Regras de conduta inegociáveis:**
- Todos os dados são **fictícios**. O app nunca deve dar a entender que monitora uma instalação real ou que uma ocorrência é evidência de evento real. Exiba sempre uma faixa discreta: **"Ambiente simulado – dados fictícios"**.
- **Divergência facial** nunca é tratada como comprovação de identidade incorreta ou acusação: sempre exibir "Requer revisão humana – não constitui identificação conclusiva".
- O login é **demonstrativo**, não autenticação segura. AsyncStorage não é armazenamento seguro de credenciais.

**Fora do escopo (NÃO implementar):** comunicação real com ESP32-CAM ou receptores BLE, captura de imagem em tempo real, reconhecimento facial, YOLO/IA, backend remoto, banco em nuvem, controle de acesso físico, alarmes sonoros.

---

## 2. Stack obrigatória

- **Expo** (SDK estável mais recente) + **React Native** + **TypeScript** (modo `strict`).
- **Expo Router** para navegação (rotas baseadas em arquivos, funciona em web/Android/iOS).
- **@react-native-async-storage/async-storage** para persistência.
- **expo-video** para reprodução dos vídeos das câmeras (não usar expo-av).
- **@expo/vector-icons** para ícones.
- Gerenciamento de sessão com **Context API** (sem Redux/Zustand).
- Validação manual em `src/utils/validators.ts` (sem bibliotecas de formulário).
- Datas formatadas com `toLocaleString('pt-BR')` (sem bibliotecas de data).
- Use `npx expo install` para instalar dependências do ecossistema Expo (garante versões compatíveis).

O app deve rodar em **web** (`npx expo start --web`) e em **Android/iOS** (Expo Go) com o mesmo código.

---

## 3. Estrutura de pastas

O Expo Router exige a pasta `app/` para rotas. Os arquivos de rota devem ser **finos** (apenas importam e renderizam a tela de `src/screens`), mantendo a separação exigida entre telas, componentes, tipos, dados, serviços e navegação.

```
O-Q-T-V_app/                      # raiz do projeto
├── app/                          # Navegação (Expo Router)
│   ├── _layout.tsx               # Root: AuthProvider, OccurrencesProvider, tema, faixa "simulado"
│   ├── index.tsx                 # Redireciona: sessão ? /(tabs)/cameras : /login
│   ├── login.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Abas: Câmeras | Ocorrências  (protegido por sessão)
│   │   ├── cameras.tsx
│   │   └── occurrences.tsx
│   ├── occurrence/
│   │   ├── new.tsx               # aceita ?area=Area%201 para pré-preencher
│   │   └── [id].tsx
│   └── camera/
│       └── [area].tsx            # visão ampliada de uma área
├── assets/
│   ├── images/
│   ├── icons/
│   └── videos/                   # vídeos por IA entram SOMENTE na Fase 10
├── src/
│   ├── components/
│   │   ├── OccurrenceCard.tsx
│   │   ├── AlertBadge.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── CustomButton.tsx
│   │   ├── ChipSelect.tsx        # seleção única por chips (substitui Picker)
│   │   ├── FormField.tsx         # label + input + mensagem de erro
│   │   ├── AlertSummary.tsx      # contadores normal/atípica/crítica (clicáveis = filtro)
│   │   ├── SimulatedBanner.tsx
│   │   ├── CameraTile.tsx
│   │   └── CameraFeed.tsx        # vídeo | placeholder "AGUARDANDO FEED" | "SEM SINAL"
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── OccurrencesScreen.tsx
│   │   ├── CreateOccurrenceScreen.tsx
│   │   ├── OccurrenceDetailsScreen.tsx
│   │   ├── CamerasScreen.tsx
│   │   └── CameraAreaScreen.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── OccurrencesContext.tsx
│   ├── types/
│   │   ├── User.ts
│   │   ├── Occurrence.ts
│   │   └── Camera.ts
│   ├── data/
│   │   ├── mockUsers.ts
│   │   ├── mockOccurrences.ts
│   │   ├── cameras.ts
│   │   └── labels.ts             # mapas código → rótulo PT-BR
│   ├── services/
│   │   ├── authService.ts
│   │   ├── occurrenceService.ts
│   │   ├── storageService.ts
│   │   └── permissions.ts
│   ├── utils/
│   │   ├── classifyOccurrence.ts
│   │   ├── authorization.ts
│   │   └── validators.ts
│   └── theme/
│       ├── colors.ts
│       └── spacing.ts
├── App.tsx (não necessário com Expo Router; não criar se o template não usar)
├── package.json
├── tsconfig.json
└── README.md
```

---

## 4. Identidade visual — Grafite fosco

Estética de **sala de controle sóbria e fosca**: sem gradientes, sem brilhos/glow, sombras praticamente nulas. Camadas diferenciadas apenas por variação sutil de tom e bordas finas (1px). Cor forte é **reservada exclusivamente aos níveis de alerta**.

`src/theme/colors.ts` (nenhuma tela pode ter cor hardcoded; tudo vem daqui):

| Token | Valor | Uso |
|---|---|---|
| `background` | `#2A2C30` | fundo do app |
| `surface` | `#33363B` | cards, inputs |
| `surfaceRaised` | `#3C3F45` | hover, pressionado, modais |
| `border` | `#474A51` | bordas e divisores |
| `monitor` | `#1C1D20` | interior dos monitores de câmera |
| `textPrimary` | `#E4E5E7` | texto principal |
| `textSecondary` | `#9EA2A8` | texto secundário |
| `accent` | `#7C8A9A` | botões primários, foco (azul-aço) |
| `alertNormal` | `#4FAF7C` | nível normal |
| `alertAtypical` | `#E0A63B` | nível atípico |
| `alertCritical` | `#D95550` | nível crítico |
| `error` | `#D95550` | mensagens de erro de formulário |

Diretrizes: tipografia do sistema, hierarquia clara (títulos 20–24, corpo 14–16, metadados 12), cantos arredondados discretos (6–8px), espaçamentos consistentes via `spacing.ts`. Layout responsivo: em telas ≥ 900px de largura, conteúdo com largura máxima e grid de 3 colunas na central de câmeras; em celular, uma coluna.

---

## 5. Modelagem TypeScript

### `src/types/User.ts`
```ts
export type UserRole = "operator" | "supervisor";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

/** Usuário armazenado na sessão — NUNCA contém a senha. */
export type SessionUser = Omit<User, "password">;
```

### `src/types/Occurrence.ts`
```ts
export type Area = "Area 1" | "Area 2" | "Area 3";
export type AuthorizationLevel = 1 | 2 | 3;

export type OccurrenceType =
  | "normal"
  | "person_without_id"
  | "unknown_tag"
  | "insufficient_authorization"
  | "facial_divergence"
  | "communication_failure"
  | "inconclusive_association";

export type AlertLevel = "normal" | "atypical" | "critical";
export type OccurrenceStatus = "open" | "under_review" | "resolved";

export interface Occurrence {
  id: string;
  title: string;
  description: string;
  area: Area;
  occurrenceType: OccurrenceType;
  alertLevel: AlertLevel;
  status: OccurrenceStatus;
  timestamp: string;          // ISO 8601
  personDetected: boolean;
  bleTagId?: string;
  authorizationLevel?: AuthorizationLevel;
  createdBy?: string;         // id do usuário que registrou
}

export type NewOccurrenceInput = Omit<Occurrence, "id" | "alertLevel" | "status" | "timestamp" | "createdBy">;
```

### `src/types/Camera.ts`
```ts
import { Area, AuthorizationLevel } from "./Occurrence";
export interface Camera {
  id: string;                 // "CAM-01"
  area: Area;
  label: string;              // "Recepção", "Corredor técnico", "Sala restrita"
  requiredLevel: AuthorizationLevel;
  source: number | null;      // require("...mp4") ou null enquanto não houver vídeo
}
```

### `src/data/labels.ts`
Valores internos permanecem em inglês/sem acento; a interface exibe sempre os rótulos PT-BR:
- Áreas: `"Area 1" → "Área 1"` etc.
- Tipos: normal → "Evento normal"; person_without_id → "Pessoa sem identificação associada"; unknown_tag → "Tag desconhecida"; insufficient_authorization → "Autorização insuficiente"; facial_divergence → "Divergência facial"; communication_failure → "Falha de comunicação"; inconclusive_association → "Associação inconclusiva".
- Alertas: Normal / Atípica / Crítica. Status: Aberto / Em análise / Resolvido. Papéis: Operador / Supervisor.

---

## 6. Regras de negócio

### 6.1 Autorização (`src/utils/authorization.ts`)
| Nível | Áreas autorizadas |
|---|---|
| 1 | Área 1 |
| 2 | Áreas 1 e 2 |
| 3 | Áreas 1, 2 e 3 |

Exportar `isAuthorizedForArea(level: AuthorizationLevel, area: Area): boolean` e `requiredLevelForArea(area): AuthorizationLevel`.

### 6.2 Classificação (`src/utils/classifyOccurrence.ts`)
Assinatura: `classifyOccurrence(input: { occurrenceType; area; authorizationLevel? }): AlertLevel`

Regras, em ordem de prioridade:
1. Se `authorizationLevel` foi informado **e** `!isAuthorizedForArea(level, area)` → **critical** (independentemente do tipo escolhido).
2. `insufficient_authorization` → **critical**.
3. `normal` → **normal**.
4. `person_without_id`, `unknown_tag`, `inconclusive_association`, `communication_failure`, `facial_divergence` → **atypical**.
5. Qualquer caso não previsto → **atypical** (padrão seguro).

O usuário **nunca** escolhe o nível de alerta manualmente. A função deve ser usada no cadastro, na prévia ao vivo e para **validar a coerência do catálogo inicial** (os mocks devem passar pela mesma função; não confie em `alertLevel` escrito à mão).

### 6.3 Permissões (`src/services/permissions.ts`)
```ts
export type Action = "viewOccurrences" | "createOccurrence" | "changeStatus" | "resetDemoData";
export function can(user: SessionUser | null, action: Action): boolean
```
- Operador: `viewOccurrences`, `createOccurrence`.
- Supervisor: todas as ações.
Toda verificação de papel na UI deve passar por `can()` — nunca `user.role === "..."` espalhado nas telas.

---

## 7. Dados simulados

### Contas de teste (`mockUsers.ts`)
| Nome | E-mail | Senha | Papel |
|---|---|---|---|
| Operador Teste | operador@oqtv.com | oper123 | operator |
| Supervisor Teste | supervisor@oqtv.com | super123 | supervisor |

### Catálogo inicial (`mockOccurrences.ts`)
Crie **8 ocorrências fictícias** com descrições neutras e explicitamente simuladas, cobrindo **todos os 7 tipos**, **os 3 níveis**, **os 3 status** e **as 3 áreas**. Inclua obrigatoriamente:
- 1 normal resolvida na Área 1;
- 1 autorização insuficiente aberta (crítica);
- 1 caso em que tipo ≠ autorização incompatível dispare crítico pela regra 6.2.1 (ex.: nível 1 detectado na Área 3);
- 1 **falha de comunicação aberta na Área 3** (usada para demonstrar o "SEM SINAL" na central de câmeras);
- 1 divergência facial em análise.
Timestamps em datas fictícias coerentes, IDs "001"…"008". O `alertLevel` deve ser gerado via `classifyOccurrence` ao montar o array.

### Câmeras (`cameras.ts`)
| id | área | label | requiredLevel | source |
|---|---|---|---|---|
| CAM-01 | Area 1 | Recepção | 1 | null |
| CAM-02 | Area 2 | Corredor técnico | 2 | null |
| CAM-03 | Area 3 | Sala restrita | 3 | null |

---

## 8. Plano de execução por fases

### Fase 1 — Ambiente
- Criar projeto com `npx create-expo-app@latest oqtv-mobile` (template padrão com Expo Router e TypeScript); remover telas/componentes de exemplo do template.
- Instalar AsyncStorage, expo-video, vector-icons via `npx expo install`.
- Garantir `"strict": true` no tsconfig; criar toda a estrutura de pastas da seção 3.
- Criar `theme/colors.ts` e `theme/spacing.ts`.
- **Conclusão:** `npx tsc --noEmit` sem erros; app abre na web com fundo grafite e uma tela provisória.

### Fase 2 — Modelagem e dados
- Implementar todos os tipos (seção 5), `labels.ts`, `authorization.ts`, `classifyOccurrence.ts`, `permissions.ts`, mocks de usuários, ocorrências e câmeras.
- **Conclusão:** tsc sem erros; escrever um script rápido (ou teste) que percorra os mocks e confirme que todos os níveis/tipos/status/áreas estão cobertos e que a classificação é coerente.

### Fase 3 — Persistência e serviços
- `storageService.ts`: funções genéricas `getItem<T>`, `setItem<T>`, `removeItem` com try/catch. Chaves: `@oqtv:occurrences`, `@oqtv:session`.
- `occurrenceService.ts`: `initOccurrences()` (carrega do storage; se vazio, grava e retorna o catálogo inicial), `getAll()`, `getById(id)`, `add(input, user)` (gera id sequencial com 3 dígitos, timestamp atual, status `open`, classifica, salva), `updateStatus(id, status)`, `resetToSeed()`.
- `authService.ts`: `login(email, password)` (comparação case-insensitive no e-mail, trim), retorna `SessionUser` ou erro; `saveSession`, `getSession`, `logout`.
- **Conclusão:** tsc sem erros; serviços sem nenhuma dependência de UI.

### Fase 4 — Contextos e navegação
- `AuthContext`: `user`, `isLoading`, `signIn`, `signOut`; restaura sessão ao iniciar.
- `OccurrencesContext`: lista, `isLoading`, `addOccurrence`, `updateStatus`, `resetDemoData`, `refresh`.
- `app/_layout.tsx` com providers, `SimulatedBanner` fixo e tela de carregamento enquanto a sessão é verificada.
- Proteção de rotas: sem sessão → `/login`; com sessão, `/login` redireciona para as abas.
- Abas: **Câmeras** (ícone de câmera) e **Ocorrências** (ícone de lista). Cabeçalho mostra nome + papel do usuário e botão **Sair**.
- **Conclusão:** navegação completa sem telas inacessíveis ou becos sem saída (podem ser telas provisórias).

### Fase 5 — Login
- Identidade visual O-Q-T-V ("Olho Que Tudo Vê" + subtítulo "AMAZUL – Nuclear Sentinel").
- Campos e-mail e senha (senha oculta), botão Entrar com estado de carregamento.
- Erros inline: campos vazios e "E-mail ou senha inválidos".
- Abaixo do formulário, texto pequeno com as contas de teste.
- **Conclusão:** login válido leva às abas; inválido mostra erro; reabrir o app mantém a sessão; Sair volta ao login e limpa a sessão.

### Fase 6 — Listagem de ocorrências
- `AlertSummary` no topo: contadores Normal / Atípica / Crítica; tocar filtra (tocar de novo remove o filtro).
- Filtro por área (chips: Todas, Área 1, Área 2, Área 3).
- Lista com `FlatList` de `OccurrenceCard`: borda lateral na cor do alerta, ID, título, área, data/hora, tipo, `AlertBadge`, `StatusBadge`. Ordenação: críticas abertas primeiro, depois mais recentes.
- Estado vazio amigável quando filtros não retornam nada.
- Botão flutuante "+ Nova ocorrência".
- Supervisor: ação "Restaurar dados de exemplo" (via `can("resetDemoData")`) com confirmação feita por componente próprio (não usar `Alert.alert`, que não funciona bem na web).
- **Conclusão:** catálogo aparece na primeira execução; filtros funcionam; tocar num card abre detalhes.

### Fase 7 — Cadastro
- Campos: Título*, Descrição* (multilinha), Área* (`ChipSelect`), Tipo de ocorrência* (`ChipSelect`), Pessoa detectada (switch Sim/Não), Identificador BLE (opcional), Nível de autorização (opcional, chips 1/2/3 com opção "Não informado").
- Aceitar parâmetro `?area=` para pré-preencher a área.
- `validators.ts`: `validateOccurrence(input) → Record<campo, mensagem>`; título mínimo 3 caracteres, descrição mínimo 10, área e tipo obrigatórios, BLE opcional mas se preenchido no formato alfanumérico (ex.: `TAG123`).
- Erros exibidos abaixo de cada campo após tentativa de envio (e atualizados conforme o usuário corrige); cadastro bloqueado enquanto houver erros.
- **Prévia de classificação ao vivo**: bloco "Esta ocorrência será classificada como: [AlertBadge]" que atualiza conforme tipo, área e nível mudam; se a regra 6.2.1 for acionada, mostrar o motivo ("Nível 1 não autorizado para Área 3").
- Ao salvar: classifica, persiste, volta para a lista (atualizada) e mostra confirmação breve (toast/banner próprio).
- **Conclusão:** cadastro incompleto exibe erros; completo registra; os três níveis podem ser gerados pelo formulário.

### Fase 8 — Detalhes
- Cabeçalho com `AlertBadge` grande, ID e título.
- Seções: Identificação (tipo, status), Local e horário (área, data), Pessoa e tag BLE (pessoa detectada, tag ou "Não informada"), Autorização (nível informado, nível exigido pela área, compatível/incompatível).
- Aviso fixo para divergência facial (ver seção 1).
- Supervisor: controle para alterar status (Aberto → Em análise → Resolvido) via `can("changeStatus")`; operador vê o status somente leitura.
- Ocorrência inexistente (id inválido na URL): mensagem clara e botão de voltar.
- **Conclusão:** todas as informações visíveis; alteração de status persiste após reiniciar.

### Fase 9 — Central de câmeras (com placeholders)
- `CamerasScreen`: grid de 3 `CameraTile` (3 colunas em tela larga, 1 coluna empilhada no celular), proporção 16:9.
- Cada `CameraTile`:
  - `CameraFeed` ao fundo: se `source` for null → placeholder em `colors.monitor` com "AGUARDANDO FEED · ÁREA X"; se houver ocorrência **aberta** de `communication_failure` na área → tela "SEM SINAL" (pode ter leve ruído/scanline animado discreto, sem brilho); caso contrário → vídeo em loop, mudo, autoplay, sem controles (`expo-video`).
  - Sobreposições: canto superior esquerdo "ÁREA X · CAM-0X · SIMULAÇÃO"; canto superior direito relógio que avança a cada segundo (`setInterval` com cleanup); rodapé com label, "Acesso: nível N+" e contagem de ocorrências abertas.
  - Borda de 2px na cor do **pior alerta não resolvido** da área (sem nenhum → `alertNormal`).
- Tocar no tile → `camera/[area]`: vídeo grande, lista de ocorrências da área (reutilizando `OccurrenceCard`), botão "Registrar ocorrência nesta área" → cadastro com área pré-preenchida.
- Os estados dos tiles devem reagir em tempo real às mudanças no `OccurrencesContext` (ex.: resolver a falha de comunicação da Área 3 tira o "SEM SINAL").
- **Conclusão:** central funcional com placeholders, integrada às ocorrências, em web e celular.

### Fase 10 — Vídeos por IA (ÚLTIMA ETAPA — só quando eu fornecer os arquivos)
- Aguarde eu disponibilizar `assets/videos/area1.mp4`, `area2.mp4`, `area3.mp4` (MP4 H.264, 720p, 8–15 s, loop).
- **Não** use `require()` de arquivos que ainda não existem (quebra o bundler). Só então atualize `source` em `cameras.ts`.
- Verifique reprodução em loop na web e no celular e que a tarja "SIMULAÇÃO" permanece visível sobre o vídeo.
- Adicione nota no README: vídeos gerados por IA, meramente ilustrativos, sem relação com instalações ou pessoas reais.

### Fase 11 — Testes, revisão e documentação
Execute e registre o resultado de cada teste:

| Teste | Resultado esperado |
|---|---|
| Login com credenciais válidas | Acesso às abas |
| Login com credenciais inválidas | Mensagem de erro |
| Recuperação de sessão | Permanece autenticado após recarregar/reabrir |
| Listagem inicial | 8 ocorrências simuladas aparecem |
| Cadastro incompleto | Erros de validação visíveis, cadastro bloqueado |
| Cadastro completo | Ocorrência registrada e listada |
| Classificação normal / atípica / crítica | Níveis corretos, inclusive pela regra de autorização |
| Acesso aos detalhes | Informações completas |
| Supervisor altera status / operador não | Comportamento conforme `can()` |
| Central de câmeras | Bordas, contagens e "SEM SINAL" coerentes com as ocorrências |
| Persistência | Registros e status permanecem após reiniciar |
| Encerramento da sessão | Volta ao login |

Revisão final: `npx tsc --noEmit` sem erros; nenhum `any` desnecessário; nenhuma cor hardcoded fora do tema; nenhum `console.log` esquecido; nenhum texto em inglês visível ao usuário.

**README.md** contendo: nome do projeto; descrição da solução e objetivo; tecnologias (tabela com finalidade de cada uma); estrutura de pastas comentada; instalação (`npm install`) e execução (`npx expo start`, `--web`, Expo Go); **contas de teste com e-mail e senha reais do código**; funcionalidades implementadas; regras de classificação e tabela de autorização documentadas; perfis e permissões; central de câmeras; observação clara sobre dados simulados, login demonstrativo e vídeos gerados por IA.

Crie também `ENTREGA.txt` com o modelo abaixo (deixe os campos para eu preencher):
```
PROJETO: O-Q-T-V – Olho Que Tudo Vê
INTEGRANTES:
1. Nome completo – RM:
2. Nome completo – RM:
3. Nome completo – RM:
4. Nome completo – RM:
5. Nome completo – RM:
REPOSITÓRIO GITHUB:
[Inserir link]
VÍDEO DEMONSTRATIVO:
[Inserir link]
```

---

## 9. Roteiro do vídeo (para orientar o que precisa estar demonstrável)

| Tempo | Demonstração |
|---|---|
| 0:00–0:20 | Apresentação do O-Q-T-V |
| 0:20–0:45 | Login (erro + sucesso) |
| 0:45–1:20 | Central de câmeras e listagem com filtros |
| 1:20–1:55 | Cadastro com validação |
| 1:55–2:20 | Classificação automática (prévia ao vivo) |
| 2:20–2:40 | Detalhes + supervisor alterando status |
| 2:40–3:00 | Reiniciar app (persistência) e sair |

---

## 10. Regras de trabalho para você, agente

- Siga as fases na ordem; ao concluir cada uma, informe em poucas linhas o que foi feito, como verificou, e faça o commit.
- Se encontrar ambiguidade, escolha a opção mais simples e coerente com este documento e registre a decisão no README (seção "Decisões de projeto").
- Priorize o escopo obrigatório (Fases 1–8 e 11). A central de câmeras (Fase 9) só começa com as fases 1–8 funcionando; a Fase 10 só com os vídeos em mãos.
- Não adicione bibliotecas além das listadas sem justificar.
- Código e identificadores em inglês; toda interface e documentação em português do Brasil.