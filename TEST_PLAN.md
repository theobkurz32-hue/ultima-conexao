# Plano e registro de testes

## Comandos reproduzíveis

| Comando | O que verifica |
| --- | --- |
| `npm test` | Condições narrativas, integridade, persistência e ações de estado cobertas pelas suítes. |
| `npm run validate:story` | Integridade de IDs/referências e dependências do conteúdo narrativo. |
| `npm run build` | TypeScript e bundle de produção, incluindo manifesto e service worker. |
| `npm run verify:build` | Inspeção estática dos caminhos de assets, manifesto e escopo do build gerado. |
| `VITE_BASE_PATH=/ultima-conexao/ npm run build` | Compilação com prefixo de repositório de projeto. |
| `npm run test:e2e` | Fluxos de interface definidos em `e2e/` em Chromium desktop e resolução mobile. |

Em execução local, instale o Chromium com `npx playwright install chromium`. No ambiente Cloud gerenciado, use somente a URL de preview fornecida pelo daemon em `PLAYWRIGHT_BASE_URL`; nenhum servidor adicional deve ser iniciado pela configuração de testes.

## Registro da entrega

Resultados efetivamente executados na integração de 14/11/2026. Um teste escrito ou previsto pelo CI não é um teste executado. Os detalhes das suítes ficam no código e os limites abaixo se aplicam mesmo quando os checks automatizados passam.

| Verificação | Resultado da integração |
| --- | --- |
| Testes unitários, estado, persistência e interface React em jsdom | Aprovados: 22 testes em quatro arquivos. Destes, 18 cobrem estado/narrativa/persistência e três renderizam o `PhoneShell` real em jsdom. |
| Validação narrativa | Aprovada: `npm run validate:story`. |
| Build de produção | Aprovado: `npm run build`, incluindo TypeScript e geração de manifesto/service worker. |
| Inspeção estática do build raiz | Aprovada: `npm run verify:build`. Não representa navegação em navegador. |
| Build com prefixo de projeto | Aprovados: `VITE_BASE_PATH=/ultima-conexao/ npm run build` e `VITE_BASE_PATH=/ultima-conexao/ npm run verify:build`; caminhos sob o prefixo verificados estaticamente. |
| Navegação em Chromium | Não executada neste ambiente: ferramenta `cua_repl` indisponível no ambiente gerenciado. A suíte Playwright contém dois fluxos em duas resoluções e está configurada para execução no CI. |
| Offline após instalação do SW | Não executado: build e inspeção estática sem erro não comprovam navegação offline. |
| Safari/iPhone real | Não executado: dispositivo real não disponibilizado. |
| PWA instalada no iOS | Não executado: instalação real não disponibilizada. |
| Android real | Não executado: dispositivo real não disponibilizado. |
| Firefox e Safari desktop | Não executados nesta entrega. |
| Auditoria com leitor de tela | Não executada nesta entrega. |
| Métricas de 60 fps e aparelho intermediário | Não medidas. |
| Playtest externo / duração do jogo | Não executado. |
| Publicação real no GitHub Pages | Não executada sem repositório autorizado/configurado. |

Os três testes React renderizam componentes reais em jsdom e verificam código incorreto/correto, abertura dos nove aplicativos, preservação de evidências, evento condicional, retorno ao registro de origem e anotações digitadas com persistência e retomada. jsdom simula o DOM; não mede layout, gestos físicos, renderização visual ou comportamento real do Safari.

## Casos de aceitação da fundação

1. Carregar o telefone e ler a identificação ficcional.
2. Abrir autenticação, testar código incorreto e desbloquear com a pista disponível.
3. Abrir cada aplicativo instalado e retornar ao início por alternativa de botão.
4. Trocar de aplicativo e verificar preservação do estado de navegação.
5. Abrir uma conversa, uma imagem, uma nota e um e-mail.
6. Preservar os registros da contradição em qualquer ordem e receber o evento uma vez.
7. Abrir a origem a partir de uma evidência no caderno.
8. Editar anotações e preferências, recarregar e confirmar retomada.
9. Exportar um save, importar uma cópia válida e rejeitar JSON inválido sem alterar a investigação atual.
10. Rejeitar arquivo grande, IDs desconhecidos, enumerações inválidas e preferências fora de faixa.
11. Confirmar reinício intencional; cancelar deve manter o estado.
12. Simular falha do armazenamento e verificar erro visível e preservação de save ilegível.

## Narrativa

Conferir a cronologia fonte em `src/story/chronology.ts`. A mensagem de Raul é um relato intencionalmente incompatível com a data da fotografia. Passagem validada não identifica passageiro e nota de plano não comprova execução. Os testes devem preservar esses limites inferenciais.

Validar unicidade de IDs, existência dos registros de origem, referências inversas de evidências, personagens/locais, datas com fuso e ordem das mensagens. Condições `all`/`any`, eventos em cascata, IDs consumidos e ciclos sem entrada precisam de cobertura. A análise estrutural não substitui revisão de roteiro ou playtest.

Os três finais ainda não existem. Portanto, nenhum resultado atual comprova alcançabilidade da história completa.

## PWA e publicação

Após build em prefixo, verificar os URLs de `index.html`, scripts, CSS, imagens, ícones, manifesto e `sw.js`; todos devem estar sob o mesmo prefixo. Servir por HTTPS ou localhost, esperar controle do SW, desligar rede e recarregar. Importar/exportar save antes e depois de uma atualização com novo cache. Verificar que documentos internos não aparecem em `dist/`.

Um teste automático em Chromium não reproduz políticas de cache, descarte de IndexedDB ou áreas reservadas do iOS. Esses testes precisam ser repetidos num iPhone real.

## Mobile e acessibilidade

Verificar retrato e paisagem, safe areas, teclado aberto, aumento de texto, redução de movimento e suspensão/retomada. Navegar somente por teclado, conferir foco em diálogos e fechamento por Escape. Usar VoiceOver/TalkBack para campos, botões do sistema, mensagens e avisos de erro. Medir contraste e áreas de toque sobre os estilos finais.

## Desempenho

Registrar tamanho inicial comprimido, tempo de interatividade, memória ao abrir fotos e rolagem em conversa extensa. Somente aplicar virtualização e otimizações adicionais onde as medições demonstrarem benefício. Não interpretar um bundle compilado ou animações CSS como comprovação de 60 fps.

O build integrado registrou aproximadamente 471,94 kB de JavaScript principal (148,56 kB gzip) e 48,64 kB de CSS (11,36 kB gzip). O precache gerado contém 29 entradas, totalizando cerca de 599,89 KiB. São medições de tamanho do artefato, não de velocidade de download, fluidez, uso de memória ou execução em aparelho intermediário.

## Revisão para publicação (14/11/2026)

Adicionado teste de regressão em jsdom para os botões de notificações e central de controle no modo iOS standalone simulado. As quatro suítes passaram com 22 testes. Os fluxos Playwright agora preservam o prefixo do Pages. Não equivale a teste em um iPhone real.

## Execução efetiva no GitHub Actions

Em 14/11/2026, no commit `72b7703`, passaram 22 testes em quatro suítes, validação narrativa, TypeScript, build com `/ultima-conexao/` e checagem de recursos. Os quatro fluxos Playwright também passaram em Chromium real do CI (desktop 1440×1000 e viewport mobile 390×844). O viewport mobile não comprova Safari/iPhone real.

Execução: https://github.com/theobkurz32-hue/ultima-conexao/actions/runs/43547922600

A configuração do Pages ainda retorna `Pages site not found`, portanto a implantação não foi concluída. A suíte separada `Verificar aplicação publicada e PWA offline` foi preparada para verificar a URL pública após uma implantação bem-sucedida; não foi executada ainda.
