# O-Q-T-V – Olho Que Tudo Vê

Protótipo acadêmico de monitoramento para três áreas fictícias de uma instalação nuclear fictícia, desenvolvido para o desafio **AMAZUL – Nuclear Sentinel** (disciplina *Cross-Platform Application Development*).

**Este app não monitora instalações reais.** É uma interface de demonstração onde os usuários consultam, registram e classificam ocorrências simuladas. Apresentamos sempre a faixa discreta: **"Ambiente simulado – dados fictícios"**.

## Objetivo

Fornecer um MVP acadêmico (mobile + web com um único código) que permita:

- Visualizar a central de câmeras das três áreas da instalação fictícia;
- Consultar, filtrar e cadastrar ocorrências simuladas;
- Classificar automaticamente as ocorrências em níveis normal, atípica e crítica;
- Alterar o status das ocorrências conforme o papel do usuário (operador / supervisor);
- Ver dados persistidos localmente (AsyncStorage) mesmo após reiniciar o app.

## Tecnologias

| Tecnologia | Finalidade |
|---|---|
| Expo SDK 58 + React Native + TypeScript | Stack obrigatória, modo strict |
| Expo Router | Navegação baseada em arquivos (web/Android/iOS) |
| AsyncStorage | Persistência local de sessão e ocorrências |
| expo-video | Reprodução dos vídeos (placeholder) das câmeras |
| @expo/vector-icons | Ícones da interface |
| Context API | Gerenciamento de sessão e ocorrências (sem Redux/Zustand) |
| Validação manual em `src/utils/validators.ts` | Sem bibliotecas de formulário |

## Instalação

```bash
npm install
```

## Execução

Web:

```bash
npx expo start --web
```

Android/iOS (Expo Go):

```bash
npx expo start
```

Depois abra com o Expo Go e aponte a câmera para o QR Code, ou pressione `a`/`i` no terminal. O mesmo código roda em web e mobile.

## Contas de teste

Login demonstrativo (não é autenticação segura):

| E-mail | Senha | Papel |
|---|---|---|
| operador@oqtv.com | oper123 | Operador |
| supervisor@oqtv.com | super123 | Supervisor |

## Funcionalidades implementadas

- Login com sessão demonstrativa (persistida no AsyncStorage);
- Abas: Câmeras e Ocorrências (protegidas por sessão);
- Lista de ocorrências com `AlertSummary` (filtro por nível clicável) e filtro por área (chips);
- Ordenação: criticas abertas primeiro, depois mais recentes;
- Cadastro com validação manual e prévia de classificação ao vivo;
- Regras de classificação e de autorização aplicadas automaticamente;
- Detalhes da ocorrência com seção de identificação, local/horário, pessoa/tag BLE e autorização;
- Supervisor pode alterar o status (Aberto → Em análise → Resolvido) com confirmação;
- Operador vê status apenas leitura;
- Central de câmeras com tiles: `AGUARDANDO FEED` / `SEM SINAL` (área com falha de comunicação aberta), relógio, borda com a cor do pior alerta não resolvido da área;
- Registro de ocorrência a partir de uma câmera, com área pré-preenchida;
- Persistência de registros e status após reiniciar o app;
- Botão Sair que encerra a sessão demonstrativa.

## Regras de classificação (alerta automático)

O usuário nunca escolhe o nível de alerta manualmente. Prioridade:

1. Se o nível de autorização informado for incompatível com a área → **crítica**;
2. Tipo `insufficient_authorization` → **crítica**;
3. Tipo `normal` → **normal**;
4. Os demais tipos → **atípica**;
5. Caso não previsto → **atípica** (padrão seguro).

A classificação é usada no cadastro, na prévia ao vivo e para validar o catálogo inicial (mock).

## Tabela de autorização por área

| Nível | Áreas autorizadas |
|---|---|
| 1 | Área 1 |
| 2 | Áreas 1 e 2 |
| 3 | Áreas 1, 2 e 3 |

## Perfis e permissões

- **Operador**: visualizar ocorrências, criar ocorrências.
- **Supervisor**: todas as ações, incluindo alterar status e restaurar dados de exemplo.

Toda verificação de papel na UI passa por `can()` — nunca comparações diretas de `role` espalhadas nas telas.

## Central de câmeras

Cada tile mostra a área, a câmera (CAM-01 a CAM-03), relógio com atualização a cada segundo e a contagem de ocorrências abertas. Se a área tiver uma ocorrência aberta de **falha de comunicação**, o tile exibe `SEM SINAL`. Caso contrário, exibe vídeo simulado em loop (placeholder até os vídeos reais serem fornecidos na Fase 10).

## Observações importantes

- Todos os dados são **fictícios**; nunca use o app como se fosse um monitoramento real.
- O login é **demonstrativo** e o AsyncStorage não armazena credenciais com segurança.
- Divergência facial nunca é comprovação de identidade incorreta nem acusação: exibimos "Requer revisão humana – não constitui identificação conclusiva".
- Escopo fora do projeto: comunicação real com ESP32-CAM/receptores BLE, reconhecimento facial, YOLO/IA, backend remoto, banco em nuvem, controle de acesso físico, alarmes sonoros.
- Nenhuma cor está hardcoded fora de `src/theme/colors.ts`.
- Não há `console.log` esquecido nem `any` desnecessário.

## Estrutura de pastas (comentada)

```
app/                          # Navegação (Expo Router)
├── _layout.tsx               # Root: AuthProvider, OccurrencesProvider, tema, faixa "simulado"
├── index.tsx                 # Redireciona: sessão ? /(tabs)/cameras : /login
├── login.tsx                 # Login demonstrativo
├── (tabs)/                   # Abas protegidas por sessão
│   ├── _layout.tsx           # Cabeçalho com usuario/papel + Sair
│   ├── cameras.tsx           # Central de câmeras
│   └── occurrences.tsx       # Listagem de ocorrências
├── occurrence/
│   ├── new.tsx               # Cadastro (aceita ?area=)
│   └── [id].tsx              # Detalhes da ocorrência
└── camera/
    └── [area].tsx            # Visão ampliada de uma área
assets/                       # Imagens, ícones e vídeos (videos só na Fase 10)
src/
├── components/               # Componentes reutilizáveis
│   ├── OccurrenceCard.tsx    # Card de listagem de ocorrências
│   ├── AlertBadge.tsx        # Badge de nível de alerta
│   ├── StatusBadge.tsx       # Badge de status
│   ├── CustomButton.tsx      # Botão
│   ├── ChipSelect.tsx        # Seleção única por chips (substitui Picker)
│   ├── FormField.tsx         # Label + input + erro
│   ├── AlertSummary.tsx      # Contadores normal/atípica/crítica (clicável = filtro)
│   ├── SimulatedBanner.tsx   # Faixa "Ambiente simulado"
│   ├── CameraTile.tsx        # Tile de câmera
│   ├── CameraFeed.tsx        # Vídeo / placeholder / SEM SINAL
│   ├── ConfirmDialog.tsx     # Confirmação sem Alert.alert
│   └── FlashMessage.tsx      # Confirmação breve ao salvar
├── screens/                  # Telas
│   ├── LoginScreen.tsx
│   ├── OccurrencesScreen.tsx
│   ├── CreateOccurrenceScreen.tsx
│   ├── OccurrenceDetailsScreen.tsx
│   ├── CamerasScreen.tsx
│   └── CameraAreaScreen.tsx
├── context/                  # AuthProvider, OccurrencesProvider
├── types/                    # User.ts, Occurrence.ts, Camera.ts
├── data/                     # Mocks de usuarios, ocorrencias, cameras, labels.ts
├── services/                 # authService, occurrenceService, storageService, permissions
├── utils/                    # validateOccurrence, classifyOccurrence, authorization, validators
└── theme/                    # cores e espacamentos
```

## Decisões de projeto

- Scaffold inicial criado com `create-expo-app` no diretório temporário e movido para a raiz do repositório, mantendo a estrutura do guia (raiz `app/`) ao invés da estrutura `src/app` do template SDK 58.
- Toda validação é manual em `src/utils/validators.ts` (sem bibliotecas de formulário).
- Datas formatadas com `toLocaleString('pt-BR')` (sem bibliotecas de data).
- Confirmações usam `ConfirmDialog` próprio, não `Alert.alert` (que não funciona bem na web).

- Componentes extras além da lista do guia: `ConfirmDialog` (confirmação sem `Alert.alert`) e `FlashMessage` (confirmação breve ao salvar). Utilitários extras: `formatDate.ts` e `sortOccurrences.ts`.
- O supervisor altera o status por chips (Aberto / Em análise / Resolvido), permitindo também reabrir uma ocorrência.
- Os vídeos da Fase 10 ainda não foram adicionados: todas as câmeras usam `source: null` e exibem "AGUARDANDO FEED".

## Histórico de commits

1. `feat: Fase 1 - Ambiente`
2. `feat: Fase 3 - Persistência e serviços` (inclui também a Fase 2 - modelagem e dados)
3. `feat: Fases 4-9 - contextos, navegacao, telas e central de cameras`
4. `docs: Fase 11 - README e ENTREGA`

## Verificação

```bash
npm run typecheck                    # npx tsc --noEmit, sem erros
npm run verify:mocks                 # cobertura de tipos, áreas, status e níveis + regras
npx expo export --platform web       # empacota todas as rotas para a web
```

Os testes manuais da tabela da Fase 11 (login, cadastro, persistência etc.) ainda precisam ser executados no navegador e no Expo Go, com os resultados registrados aqui.

---

**ENTREGA.txt** também foi criado neste repositório com o modelo solicitado para preenchimento dos integrantes, repositório e vídeo demonstrativo.
