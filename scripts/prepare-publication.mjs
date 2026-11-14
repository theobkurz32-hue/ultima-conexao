import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Build a new source tree without leaking internal documents through Git history.
// This command is local-only: it never creates a repository on GitHub or pushes.
const source = process.cwd();
const destination = path.resolve(process.argv[2] || '../ultima-conexao-publicacao');
if (destination === source || destination.startsWith(`${source}${path.sep}`)) throw new Error('Escolha um diretório externo ao checkout original.');
try { await access(destination); throw new Error('O diretório de destino já existe. Nenhum arquivo foi alterado.'); }
catch (error) { if (error.code !== 'ENOENT') throw error; }

// Usage: git ls-files -z | node scripts/prepare-publication.mjs ../destination
const chunks = [];
for await (const chunk of process.stdin) chunks.push(chunk);
const tracked = Buffer.concat(chunks).toString('utf8').split('\0').filter(Boolean);
if (tracked.length === 0) throw new Error('Forneça git ls-files -z pela entrada padrão.');
if (tracked.some(file => path.isAbsolute(file) || file.split('/').includes('..'))) throw new Error('Caminho inválido na lista de arquivos.');
const files = tracked.filter(file => !file.startsWith('docs/internal/'));
await mkdir(destination, { recursive: true });
for (const file of files) {
  await mkdir(path.dirname(path.join(destination, file)), { recursive: true });
  await writeFile(path.join(destination, file), await readFile(path.join(source, file)));
}
await writeFile(path.join(destination, 'STORY_BIBLE.md'), `# Documentação narrativa\n\nA bíblia com a verdade do caso e os segredos dos atos futuros permanece no checkout de desenvolvimento, fora desta publicação. O pacote público contém apenas os dados ficcionais necessários ao conteúdo jogável atual. Dados distribuídos para uso offline podem ser inspecionados.\n`);
await writeFile(path.join(destination, 'EVIDENCE_GRAPH.md'), `# Grafo narrativo inicial\n\nO motor e os testes validam os registros jogáveis em src/story e src/engine. O planejamento com spoilers dos atos futuros não integra esta publicação. Preservar um registro não confirma a interpretação de um personagem.\n`);
await writeFile(path.join(destination, 'docs/DELIVERY.md'), `# Pacote de publicação\n\nDestino proposto: https://github.com/theobkurz32-hue/ultima-conexao\n\nAplicativo proposto: https://theobkurz32-hue.github.io/ultima-conexao/\n\nEste pacote inclui código-fonte, recursos originais, testes, configurações e documentação técnica. Exclui docs/internal e todo o histórico Git do checkout completo. Um repositório novo deve ser iniciado a partir desta pasta, sem copiar o .git original. Nenhuma credencial, banco do jogador, node_modules ou dist é incluído.\n\nO repositório e a hospedagem ainda precisam ser criados após a confirmação de publicação. O script prepare-publication.mjs não faz chamadas externas.\n`);
const readmeFile = path.join(destination, 'README.md');
let readme = await readFile(readmeFile, 'utf8');
readme = readme.replace('O código-fonte desta entrega está em `/workspace/ultima-conexao`.', 'Este pacote contém o código-fonte público da entrega.');
readme = readme.replace(/Os documentos narrativos ficam fora de `public\/` e de `dist\/`\.[^\n]*/, 'Os documentos internos com a solução e segredos dos atos futuros não integram este pacote nem seu histórico Git. Uma experiência estática offline distribui os dados necessários ao conteúdo jogável: esses dados podem ser inspecionados.');
await writeFile(readmeFile, readme);
const architectureFile = path.join(destination, 'ARCHITECTURE.md');
const architecture = await readFile(architectureFile, 'utf8');
await writeFile(architectureFile, architecture.replace('| `docs/internal/` | Documentação narrativa com spoilers; não faz parte do build. |', '| Documentação narrativa interna | Mantida somente no checkout completo de desenvolvimento; excluída desta publicação. |'));
console.log(`Pacote local preparado em ${destination}: ${files.length} arquivos; sem documentos internos ou histórico Git.`);
