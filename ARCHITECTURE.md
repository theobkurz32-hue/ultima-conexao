# Arquitetura

## Limites e fluxo

Aplicação estática React 19 + TypeScript, compilada com Vite. Não exige servidor em produção. O HTML contém apenas o ponto de montagem; as interfaces são componentes funcionais, não capturas de tela.

```text
Pointer/teclado → OS e aplicativos → ações do store
                                  ├→ motor declarativo → eventos/notificações
                                  └→ repositório → IndexedDB
Conteúdo tipado → aplicativos / motor / validação local
```

O estado global é mantido com Zustand. A persistência usa Dexie sobre IndexedDB, com uma interface de repositório substituível para futura sincronização. Zod valida a fronteira de importação. Essas dependências atendem responsabilidades específicas; animações usam CSS e o mapa usa SVG, sem motor gráfico.

## Módulos

| Pasta | Responsabilidade |
| --- | --- |
| `src/core/` | Tipos compartilhados, inicialização e ações globais. |
| `src/os/` | Bloqueio, tela inicial, navegação, sobreposições e componentes do sistema. |
| `src/apps/` | Interfaces de cada aplicativo, sem alterar fatos narrativos. |
| `src/components/` | Componentes reutilizáveis da interface. |
| `src/design/` | Tokens, layout, transições e acessibilidade visual. |
| `src/story/` | Conteúdo estático, cronologia canônica e registros com IDs estáveis. |
| `src/engine/` | Condições declarativas, disparo determinístico e validação narrativa. |
| `src/database/` | Esquema de save, migrações e repositório IndexedDB. |
| `src/hooks/` | Comportamentos React compartilhados quando necessários. |
| `src/utils/` | Formatação temporal e utilitários pequenos. |
| `src/tests/` | Testes unitários e de persistência. |
| `public/assets/` | Ilustrações originais distribuídas com a aplicação. |
| `e2e/` | Testes de navegação em navegador. |
| `scripts/` | Validação local e geração de ícones. |
| Documentação narrativa interna | Mantida somente no checkout completo de desenvolvimento; excluída desta publicação. |

## Dados e identidade

As interfaces de domínio estão em `src/core/types.ts`. `AppId` é uma união fechada: dados importados não podem inventar um aplicativo nem carregar scripts. Entidades narrativas relacionam-se por IDs, evitando dependência de títulos, nomes de arquivos ou índices de listas.

O conteúdo estático e o save mutável são separados. O save inclui versão de esquema, relógios, aplicativo ativo, registros abertos, aplicativos recentes, preferências, evidências descobertas, eventos consumidos, notificações, decisões e anotações. Ele não duplica todo o roteiro nem armazena credenciais.

O esquema atual é `schemaVersion: 1`. Futuras mudanças exigem migração explícita e teste com saves anteriores. Importações inválidas devem falhar antes de substituir o progresso. Falhas de armazenamento devem ser visíveis; um banco indisponível não deve ser apresentado como progresso salvo.

## Tempo e progressão

Instantes narrativos são strings ISO 8601 com deslocamento explícito. A interface sempre os formata em `America/Sao_Paulo`. A cronologia mestre fornece os horários canônicos; contradições intencionais dizem respeito ao que personagens afirmam, sem alterar arbitrariamente o horário do registro.

O relógio apresentado no telefone e o tempo de progressão são campos separados. Nesta fundação a sessão parte de um instante virtual fixo; uma simulação contínua de dias e agendamento extenso pertence à Fase 2. Nenhum evento crítico exige horas de espera real.

Condições narrativas são dados discriminados (`evidence`, `event`, `all`, `any`). O avaliador não usa `eval`, `Function` nem expressões JavaScript vindas da história. Eventos consumidos são persistidos para evitar notificações repetidas após recarga.

## Navegação

O sistema seleciona o aplicativo ativo e o registro interno por ID. Os aplicativos podem manter instâncias montadas para preservar filtros e rolagem durante alternância. Links do caderno investigativo voltam ao registro original. Persistência após recarga limita-se ao que está no contrato de save; não se promete persistência de toda seleção efêmera da interface.

Há alternativas por botão para ações essenciais de gestos. Um gesto do simulador não substitui gestos reservados pelo Safari/iOS. A moldura do aparelho é um tratamento visual de desktop; a área mobile usa viewport dinâmica e insets de segurança.

## PWA e implantação

`vite-plugin-pwa` gera manifesto, registro de precache e service worker versionado a partir do build. Atualizações aguardam confirmação em vez de substituir código em uma sessão ativa. O SW é desativado no servidor de desenvolvimento.

`VITE_BASE_PATH` determina o prefixo do build, do manifesto e do escopo. O workflow do Pages publica `dist/`, excluindo documentação e ferramentas locais. Nenhuma página fictícia usa navegação externa, HTML arbitrário ou protocolo `tel:`.

## Segurança e limites

Conteúdo textual é renderizado pelo React, sem `dangerouslySetInnerHTML`. Importações são validadas e limitadas em tamanho. Assets estão no próprio build. Não há acesso automático a sensores ou serviços privados. Saves locais podem ser modificados pelo dono do dispositivo; não são evidência forense nem sistema antitrapaça.

Os dados distribuídos para funcionamento offline podem ser inspecionados. Separar documentos com spoilers do build reduz exposição acidental, sem prometer confidencialidade técnica.
