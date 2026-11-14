# Entrega publicada — fundação 0.1.0

Aplicativo: [https://theobkurz32-hue.github.io/ultima-conexao/](https://theobkurz32-hue.github.io/ultima-conexao/)

Repositório: https://github.com/theobkurz32-hue/ultima-conexao

Implantação concluída em 14/11/2026: [GitHub Actions, tentativa 3](https://github.com/theobkurz32-hue/ultima-conexao/actions/runs/43547922600/attempts/3). Os jobs `verify`, `build` e `deploy` passaram. A página e 14 recursos foram confirmados por HTTP 200; o manifesto informa modo standalone e escopo/start_url em `/ultima-conexao/`.

## Conteúdo desta publicação

A fundação da Fase 1 possui bloqueio narrativo, tela inicial, nove aplicativos com funções iniciais, progresso em IndexedDB e dados ficcionais: 39 mensagens, seis ilustrações originais e quatro evidências. A história completa, os atos futuros e os três finais ainda não estão implementados.

O pacote público inclui código-fonte, recursos originais, testes, configurações e documentação técnica. Exclui `docs/internal/` e todo o histórico Git do checkout completo. Nenhuma credencial, banco do jogador ou `node_modules/` foi publicado; o Pages distribui somente o build `dist/`.

## Verificação efetiva

- 22 testes de estado, persistência, narrativa e componentes React aprovados.
- Quatro casos Playwright aprovados em Chromium real do CI, nas resoluções desktop e mobile.
- Validação narrativa, TypeScript, build com prefixo de projeto e inspeção dos recursos aprovados.
- Publicação e recursos externos do próprio aplicativo verificados por HTTP.
- Seis testes na URL publicada aprovados no [workflow dedicado](https://github.com/theobkurz32-hue/ultima-conexao/actions/runs/43548576366), incluindo cache, recarga sem rede, evidência e notas restauradas e abertura de Fotos pelo service worker em Chromium desktop/mobile.

Instalação no iPhone/Android real, Safari, leitor de tela, métricas de desempenho em aparelho e playtest externo não foram executados. Resolução mobile em Chromium não representa um teste em Safari ou PWA instalada.

## Instalar

No iPhone, abra o endereço do jogo no Safari e use **Compartilhar → Adicionar à Tela de Início**. Em outros navegadores, use a opção de instalação quando disponível. Abra uma vez com conexão para permitir o cache e exporte o progresso em Ajustes para guardar uma cópia. O progresso permanece somente no navegador/dispositivo atual.
