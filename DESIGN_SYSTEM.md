# Design system

## Direção

Um telefone pessoal discreto e crível, com referências de ergonomia mobile e identidade original. O ambiente externo é noturno, costeiro e silencioso. A interface do telefone usa hierarquia clara, ícones consistentes, separadores leves e transparência contida. Não há representação de produto oficial de terceiros.

## Tokens de referência

| Uso | Valor de referência |
| --- | --- |
| Fundo externo e tema PWA | `#10292c` |
| Texto principal claro | `#172328` |
| Acento | `#497e7b` |
| Superfície clara | `#f5f5f2` |
| Sinalização narrativa | Dourado desaturado, sem substituir rótulos textuais. |
| Tipografia | Pilha do sistema, sem download de fonte ou licença externa. |
| Raio visual do aparelho | Aplicado apenas onde a moldura de desktop cabe. |

Os estilos efetivos vivem em CSS junto ao sistema e aos aplicativos. A documentação não deve ser tratada como um segundo arquivo de constantes; alterações de tokens precisam ser refletidas aqui na revisão da entrega.

## Componentes e navegação

- Ícones em grade com rótulos legíveis e área de toque consistente.
- Cabeçalhos de aplicativo com título, ação de voltar e hierarquia familiar de listas.
- Campos de busca com rótulo acessível.
- Botões do sistema com nome acessível e alternativa para ações por gesto.
- Menus e confirmações com ação de cancelar explícita.
- Estados de foco perceptíveis, sem depender apenas de cor.

Toques importantes devem dar retorno imediato. Não usar animações para retardar artificialmente o progresso. Transições de tela usam principalmente opacidade e transformações; a preferência `prefers-reduced-motion` deve reduzir movimento.

## Responsividade

A referência mobile é cerca de 390 × 844 pixels CSS, sem escalar o telefone inteiro como imagem. A interface usa largura disponível, altura dinâmica e áreas seguras. Em desktop há moldura vertical centralizada; em mobile ela desaparece. Paisagem adapta o enquadramento, sem depender de bloqueio de orientação.

O teclado é o teclado do navegador nas entradas editáveis, preservando acessibilidade e ergonomia do aparelho real. O teclado numérico de autenticação é uma interface ficcional interna.

## Recursos visuais

As ilustrações costeiras deste recorte são originais e deliberadamente ilustradas. Não são fotografias finais nem imagens de bancos aleatórios. O ícone PWA usa uma forma de telefone, um ponto de conexão e arcos de sinal em traços próprios. Licenças e origem estão em [ASSET_LICENSES.md](ASSET_LICENSES.md).

## Verificação

A presença de estilos acessíveis não equivale a uma auditoria completa. Contraste final, leitor de tela em iOS, aumento de fonte, áreas de toque e desempenho de blur precisam de testes em dispositivos reais. Resultados e limites ficam em [TEST_PLAN.md](TEST_PLAN.md).
