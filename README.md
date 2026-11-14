# Última Conexão

Um telefone encontrado. Uma vida interrompida. Uma investigação ficcional ambientada em Santa Aurora, no litoral gaúcho.

Esta entrega é a **fundação executável da Fase 1**, com conteúdo inicial para explorar a interface. Não é a versão completa de três a cinco horas: a expansão da narrativa, os aplicativos multimídia e os três finais pertencem às fases seguintes.

Este pacote contém o código-fonte público da entrega. A entrada React é `src/main.tsx`; o telefone virtual é composto em `src/os/PhoneShell.tsx`.

## Executar

Requisitos: Node.js 24 e npm. Não é necessário backend, conta externa ou chave de API.

```bash
npm ci
npm run dev
```

Abra a URL exibida pelo Vite. O código fictício do telefone pode ser deduzido da notificação de Marina na tela de bloqueio. Nenhuma senha pessoal é solicitada.

```bash
npm test
npm run validate:story
npm run build
npm run verify:build
npm run preview
```

Os testes de navegador usam Playwright:

```bash
npx playwright install chromium
npm run test:e2e
```

No ambiente Cloud gerenciado, os testes devem usar a URL de preview fornecida pelo ambiente em `PLAYWRIGHT_BASE_URL`; a configuração não inicia outro servidor nesse ambiente.

## Escopo desta versão

- Tela de bloqueio com autenticação narrativa, tela inicial e navegação entre aplicativos.
- Mensagens, Fotos, Notas, E-mail, Calendário, Mapas, Telefone, Investigação e Ajustes com dados fictícios iniciais.
- Estado local em IndexedDB, exportação e importação validadas de progresso.
- Identidade visual própria, ilustrações originais e layout responsivo em retrato.
- Manifesto, ícones e service worker gerados no build de produção.
- Pipeline de testes, compilação e publicação no GitHub Pages.

Consulte [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) para distinguir recursos completos, parciais e pendentes e [TEST_PLAN.md](TEST_PLAN.md) para resultados efetivamente verificados.

## Instalar e jogar offline

No Safari do iPhone, use **Compartilhar → Adicionar à Tela de Início**. Em outros navegadores compatíveis, use a opção de instalação do navegador. A instalação e o modo independente dependem do sistema e da versão do navegador.

O service worker só funciona no build de produção servido por HTTPS ou `localhost`; ele é desativado em desenvolvimento. Abra a aplicação online ao menos uma vez para permitir o cache dos arquivos. O progresso fica **somente no dispositivo e navegador atuais**. Use exportação antes de limpar dados do navegador ou trocar de dispositivo. Não há sincronização em nuvem.

Uma atualização não deve apagar o IndexedDB. Quando uma nova versão estiver disponível, salve o progresso antes de recarregar. Limpar os dados do site ou desinstalar a PWA pode remover o progresso conforme o comportamento do sistema.

## Publicar no GitHub Pages

1. Crie um repositório, envie estes arquivos e use `main` como branch principal; ajuste o workflow se usar outro nome.
2. Em **Settings → Pages → Build and deployment**, selecione **GitHub Actions**.
3. Execute o workflow **Testar e publicar no GitHub Pages**, ou envie um commit para `main`.
4. O workflow valida os dados, executa testes, compila e envia **apenas `dist/`** ao Pages.

O workflow calcula automaticamente `/NOME-REPOSITORIO/` para repositórios de projeto e `/` para `USUARIO.github.io`. Para compilar manualmente:

```bash
VITE_BASE_PATH=/NOME-REPOSITORIO/ npm run build
VITE_BASE_PATH=/NOME-REPOSITORIO/ npm run verify:build
```

O manifesto e os caminhos dos recursos acompanham esse prefixo. Não há roteamento por URL interna: abrir aplicativos altera o estado da simulação, preservando a URL de entrada do Pages.

O pipeline está preparado; a publicação real exige um repositório GitHub acessível e Pages habilitado. Não se presume que configurar o workflow significa que uma publicação foi executada.

## Atualizações e saves

Mantenha `package-lock.json` versionado e use `npm ci` no CI. Faça alterações de esquema por migrações, preserve IDs narrativos e execute testes antes de publicar. Nunca copie um banco local de desenvolvimento para `public/`. Exporte um save, atualize o build e teste a importação e a retomada antes de lançar versões que alterem persistência.

## Documentação

- [Arquitetura](ARCHITECTURE.md)
- [Aplicativos](APP_SPECIFICATIONS.md)
- [Design system](DESIGN_SYSTEM.md)
- [Testes e limitações](TEST_PLAN.md)
- [Estado da implementação](IMPLEMENTATION_STATUS.md)
- [Licenças de assets](ASSET_LICENSES.md)
- [Bíblia narrativa — contém spoilers de desenvolvimento](STORY_BIBLE.md)
- [Grafo de evidências — contém spoilers de desenvolvimento](EVIDENCE_GRAPH.md)

Os documentos internos com a solução e segredos dos atos futuros não integram este pacote nem seu histórico Git. Uma experiência estática offline distribui os dados necessários ao conteúdo jogável: esses dados podem ser inspecionados.

Esta é uma simulação ficcional independente, sem vínculo oficial com fabricantes de telefones ou serviços de mensagens e música. O jogo não acessa câmera ou microfone, não importa contas privadas e não realiza chamadas ou mensagens reais.
