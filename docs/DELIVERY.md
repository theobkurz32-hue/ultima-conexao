# Pacote de publicação

Destino proposto: https://github.com/theobkurz32-hue/ultima-conexao

Aplicativo proposto: https://theobkurz32-hue.github.io/ultima-conexao/

Este pacote inclui código-fonte, recursos originais, testes, configurações e documentação técnica. Exclui docs/internal e todo o histórico Git do checkout completo. Um repositório novo deve ser iniciado a partir desta pasta, sem copiar o .git original. Nenhuma credencial, banco do jogador, node_modules ou dist é incluído.

O repositório foi criado pelo mantenedor e o código foi enviado a `main` (commit `72b7703`). Os testes do CI passaram, incluindo quatro fluxos Chromium. A hospedagem permanece pendente: a etapa configure-pages retorna `Pages site not found`. A configuração deve ser concluída em Settings → Pages. O script prepare-publication.mjs não faz chamadas externas.
