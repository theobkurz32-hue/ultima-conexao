# Especificações dos aplicativos

Esta especificação descreve o recorte inicial. Recursos listados como futuros não devem aparecer como controles utilizáveis antes de serem implementados.

| Aplicativo | Comportamento da fundação | Expansão prevista |
| --- | --- | --- |
| Mensagens | Lista de contatos e conversas fictícias; abertura de histórico, busca e registro de mensagens como evidência quando aplicável. | Grupos, mensagens de voz, anexos, respostas determinísticas, arquivo e histórico de chamadas integrado. |
| Fotos | Grade de ilustrações, pesquisa por metadados, visualização com ampliação por botão, favoritos da sessão, descrição, horário e local simulados; registro de item relevante. | Fotografias consistentes, zoom por gesto e arraste, álbuns, vídeos, favoritos persistentes e itens apagados. |
| Notas | Lista, pesquisa e leitura de notas pessoais fictícias; caderno editável do jogador com salvamento local. | Edição contextual das notas de Helena, listas e conteúdo formatado. |
| E-mail | Lista, pesquisa e leitura de correspondência fictícia com IDs persistentes. | Pastas, anexos, conversas agrupadas e rascunhos. |
| Calendário | Navegação pelos meses de 2026, seleção de dia e agenda com horários e locais consistentes. | Convites, outros anos e notificações agendadas. |
| Mapas | Mapa vetorial próprio de Santa Aurora, pesquisa e seleção de locais. | Histórico de rotas e caminhos associados a registros desbloqueados. |
| Telefone | Contatos, registros fictícios e interface de ligação simulada. | Correio de voz, áudio e chamadas narrativas condicionais. |
| Investigação | Evidências descobertas, acesso ao registro original e anotações do jogador. | Relações livres, hipóteses, argumentos a favor/contra, decisões e finais. |
| Ajustes | Preferências do ambiente, personalização, exportação/importação de save e reinício confirmado. | Perfis locais, migrações adicionais e sincronização opcional em módulo separado. |

Os nomes e identidades dos aplicativos são próprios do universo ficcional. Nenhum contato corresponde a uma conta real e nenhuma chamada inicia uma conexão telefônica real.

## Contratos comuns

- Todas as datas usam a cronologia compartilhada e o mesmo fuso.
- O botão de início permite sair sem apagar o estado do aplicativo.
- Voltar de um registro mantém o jogador no aplicativo correspondente.
- Registros relevantes possuem ID estável e podem ser referenciados no caderno.
- Um registro pode ser preservado sem afirmar que a interpretação do personagem é verdadeira.
- Filtros com resultado vazio mostram um estado compreensível.
- Conteúdo indisponível deve ser identificado; não deve usar botões decorativos sem efeito.

## Aplicativos ainda não instalados

Rede social, música, arquivos, gravador, navegador ficcional, clima completo, relógio, calculadora e câmera pertencem às próximas fases. O widget de clima simulado não implica a existência de um aplicativo meteorológico completo. Não há reprodução de gravações comerciais, vídeo nem uso da câmera real nesta entrega.
