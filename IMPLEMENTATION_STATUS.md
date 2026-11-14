# Estado da implementação

Versão de fundação: `0.1.0`. O objetivo desta entrega é a Fase 1 com dados e funções iniciais suficientes para explorar o telefone. A existência de tipos de domínio e planos narrativos não significa que todas as mecânicas futuras estejam implementadas.

Aplicação publicada: [https://theobkurz32-hue.github.io/ultima-conexao/](https://theobkurz32-hue.github.io/ultima-conexao/). A [implantação no GitHub Actions](https://github.com/theobkurz32-hue/ultima-conexao/actions/runs/43547922600/attempts/3) terminou com sucesso; esta publicação continua sendo a fundação da Fase 1.

## Entregue no código

| Área | Estado | Recorte |
| --- | --- | --- |
| React + TypeScript + Vite | Implementado | Projeto modular, tipos explícitos e build estático. |
| Bloqueio | Implementado | Código fictício de quatro dígitos, pista em notificação e desbloqueio por interface interna. |
| Tela inicial | Implementado | Grade, dock, widget e abertura dos aplicativos instalados. |
| Navegação | Implementado no recorte | Voltar ao início, alternar aplicativos e manter instâncias abertas. |
| Persistência | Implementado | IndexedDB, esquema v1, hidratação, exportação/importação validadas e reinício. |
| PWA | Publicada e offline verificado em Chromium | Manifesto standalone, ícones, cache e service worker. Recarga sem rede com progresso preservado e Fotos acessível passou em desktop e viewport mobile. Instalação real no iOS segue pendente. |
| GitHub Pages | Publicado e verificado por HTTP | [Jogar](https://theobkurz32-hue.github.io/ultima-conexao/); testes, build e deployment aprovados no CI. Página e 14 recursos responderam HTTP 200 com prefixo correto. |
| Conteúdo inicial | Implementado | Oito personagens, sete conversas e uma contradição inicial. |
| Motor inicial | Implementado | Condições declarativas, eventos determinísticos e validação de referências/dependências. |
| Investigação | Parcial | Preservar quatro evidências, consultar origens e escrever anotações. |
| Aplicativos | Parcial | Nove aplicativos iniciais; consultar especificação para o recorte de cada um. |
| Sistema e gestos | Parcial / antecipação da Fase 2 | Controles e navegação internos existentes não equivalem a uma simulação completa de todos os gestos e serviços do sistema. |
| Assets | Recorte autoral | Seis ilustrações e ícones originais; retratos e fotografias finais pendentes. |

## Volume efetivo do conteúdo inicial

| Entidade | Implementado | Meta da versão completa |
| --- | --- | --- |
| Personagens | 8 | Pelo menos 8 relevantes, com desenvolvimento editorial completo. |
| Conversas | 7 | Pelo menos 15 relevantes. |
| Mensagens | 39 escritas individualmente | Pelo menos 400. |
| Recursos de galeria | 6 ilustrações | Pelo menos 80 recursos visuais coerentes. |
| Chamadas no histórico | 8 | Pelo menos 20. |
| E-mails | 5 | Pelo menos 25. |
| Notas + eventos de calendário | 8 | Pelo menos 20 notas, lembretes ou eventos. |
| Locais | 7 | Expansão conforme o roteiro. |
| Evidências | 4 | Pelo menos 30. |
| Hipóteses tipadas | 2 | Expansão conforme o grafo. |
| Evento condicional | 1 | Expansão conforme os capítulos. |
| Áudios narrativos | 0 | Pelo menos 10 gravações. |
| Publicações sociais | 0 | Pelo menos 15. |
| Contradições demonstradas | 1 | Pelo menos 10. |
| Finais jogáveis | 0 | 3. |

Não foi medida a duração do recorte com jogadores externos. Não se declara que ele entrega três a cinco horas nem que o desaparecimento já pode ser solucionado integralmente.

## Pendências por fase

1. **Completar verificação da fundação em dispositivos:** 22 testes de estado/narrativa/persistência/React e quatro casos Playwright em Chromium real do CI passaram; validação, build e publicação foram concluídos. Os seis testes da URL publicada passaram, incluindo retomada offline em Chromium desktop/mobile. Safari/iPhone real, instalação no dispositivo e acessibilidade com leitor de tela continuam pendentes. A lista efetiva de resultados fica em [TEST_PLAN.md](TEST_PLAN.md).
2. **Fase 2:** consolidar prioridades de gestos, tratamento do teclado, busca indexada, páginas/pastas, estados de notificações e suspensão/retomada.
3. **Fase 3:** ampliar recursos internos dos aplicativos, anexos, busca por registro e testes de links de evidência.
4. **Fase 4:** capítulo demonstrativo com conclusão parcial avaliável por jogador externo, caminhos alternativos e teste de entendimento.
5. **Fase 5:** rede social, player persistente, áudio acessível, vídeo e vida digital mais extensa.
6. **Fase 6:** escrever e implementar os três atos, decisões, hipóteses e três finais coerentes com a verdade fixada na bíblia interna.
7. **Fase 7:** medição de desempenho em aparelhos reais, auditoria de acessibilidade, revisão de licenças, testes de atualização/cache e publicação final.

## Limites verificados por escopo

- Não há backend, sincronização em nuvem, autenticação de contas reais ou integração externa obrigatória.
- Nenhum conteúdo privado real é importado. Ligações e conexões são internas à ficção.
- O relógio virtual inicial é controlado e persistido; simulação contínua de todos os horários é expansão futura.
- Resolução de viewport mobile não comprova funcionamento no Safari ou como PWA instalada.
- Offline requer um primeiro carregamento bem-sucedido e cache disponível; não impede políticas de descarte do navegador.
- Documentos internos não integram `dist/`, mas um repositório público e os dados estáticos podem ser inspecionados.
