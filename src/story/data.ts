import type { CalendarEvent, CallRecord, Character, Conversation, Evidence, Hypothesis, InvestigationEvent, LocationRecord, MailRecord, MediaAsset, NoteRecord } from '../core/types';
import { chronology as t } from './chronology';

export const characters: Character[] = [
  { id: 'helena', name: 'Helena Leal', age: 29, initials: 'HL', color: '#b38068', role: 'Fotógrafa e produtora independente' },
  { id: 'marina', name: 'Marina Leal', age: 26, initials: 'ML', color: '#a67586', role: 'Irmã de Helena' },
  { id: 'bia', name: 'Beatriz Nunes', age: 29, initials: 'BN', color: '#6e8b84', role: 'Melhor amiga desde o colégio' },
  { id: 'tiago', name: 'Tiago Farias', age: 32, initials: 'TF', color: '#788598', role: 'Antigo companheiro' },
  { id: 'raul', name: 'Raul Monteiro', age: 38, initials: 'RM', color: '#8b7b66', role: 'Produtor audiovisual' },
  { id: 'eva', name: 'Eva Martins', age: 34, initials: 'EM', color: '#937573', role: 'Jornalista independente' },
  { id: 'daniel', name: 'Daniel Costa', age: 41, initials: 'DC', color: '#6b888a', role: 'Vizinho do apartamento 302' },
  { id: 'unknown', name: 'Número desconhecido', age: 0, initials: '?', color: '#777581', role: 'Contato sem nome salvo' },
];

export const conversations: Conversation[] = [
  { id: 'marina', characterId: 'marina', pinned: true, unread: 3, messages: [
    { id: 'msg-marina-1', senderId: 'marina', text: 'mana, tu ficou com a minha jaqueta verde?', timestamp: '2026-11-10T18:02:00-03:00' },
    { id: 'msg-marina-2', senderId: 'helena', text: 'tá no banco do carro. um dia te devolvo uma coisa no prazo kkk', timestamp: '2026-11-10T18:05:00-03:00' },
    { id: 'msg-marina-3', senderId: 'marina', text: 'só traz domingo. mãe quer fazer almoço lá em casa', timestamp: '2026-11-10T18:06:00-03:00' },
    { id: 'msg-marina-4', senderId: 'helena', text: 'vou sim. levo a sobremesa ❤️', timestamp: '2026-11-10T18:09:00-03:00' },
    { id: 'msg-marina-5', senderId: 'marina', text: 'Helena? Tu chegou em casa?', timestamp: '2026-11-12T07:31:00-03:00' },
    { id: 'msg-marina-6', senderId: 'marina', text: 'Me liga quando ver isso. Só pra eu saber que tá tudo bem.', timestamp: '2026-11-12T10:24:00-03:00' },
    { id: 'msg-marina-pin', senderId: 'marina', text: 'Se esse telefone chegou até ti: sou a Marina, irmã da Helena. O código é o aniversário dela, 17 de agosto. Quatro números: dia e mês.', timestamp: '2026-11-13T21:39:00-03:00' },
    { id: 'msg-marina-7', senderId: 'marina', text: 'A gente ainda não sabe onde ela tá. Por favor, cuida do que tem aí.', timestamp: '2026-11-13T21:40:00-03:00' },
  ] },
  { id: 'chat-bia', characterId: 'bia', pinned: true, unread: 1, messages: [
    { id: 'msg-bia-1', senderId: 'bia', text: 'amg achei um apê com uma janela ABSURDA pra tua sessão', timestamp: '2026-11-09T11:20:00-03:00' },
    { id: 'msg-bia-2', senderId: 'helena', text: 'se a luz for boa eu aceito até o mofo', timestamp: '2026-11-09T11:22:00-03:00' },
    { id: 'msg-bia-3', senderId: 'bia', text: 'o mofo vem de brinde. e o café quinta, tá de pé?', timestamp: '2026-11-09T11:23:00-03:00' },
    { id: 'msg-bia-4', senderId: 'helena', text: 'quinta talvez não dê. preciso terminar uma coisa antes', timestamp: '2026-11-11T17:04:00-03:00' },
    { id: 'msg-bia-5', senderId: 'bia', text: 'trabalho do Raul de novo? tu prometeu dormir', timestamp: '2026-11-11T17:05:00-03:00' },
    { id: 'msg-bia-6', senderId: 'helena', text: 'dessa vez não é trabalho dele. depois te conto com calma', timestamp: '2026-11-11T17:08:00-03:00' },
    { id: 'msg-bia-7', senderId: 'bia', text: 'teu café ficou aqui te esperando. volta pra reclamar que esfriou, por favor', timestamp: '2026-11-13T14:12:00-03:00' },
  ] },
  { id: 'chat-raul', characterId: 'raul', unread: 0, messages: [
    { id: 'msg-raul-1', senderId: 'raul', text: 'Helena, o cliente aprovou as cores. Preciso do corte final até sexta, por gentileza.', timestamp: '2026-11-10T09:12:00-03:00' },
    { id: 'msg-raul-2', senderId: 'helena', text: 'envio o link amanhã. ainda falta corrigir o áudio da entrevista.', timestamp: '2026-11-10T09:33:00-03:00' },
    { id: 'msg-raul-3', senderId: 'raul', text: 'Ótimo. Sobre o material do cais: melhor não circular nada por enquanto.', timestamp: '2026-11-11T20:58:00-03:00' },
    { id: 'msg-raul-claim', senderId: 'raul', text: 'Se perguntarem: essa foto do farol é de hoje, às 21h. Estávamos os dois no cais, certo?', timestamp: t.raulClaim, evidenceId: 'ev-raul' },
    { id: 'msg-raul-4', senderId: 'helena', text: 'essa foto é do dia 9. por que tu precisa que eu diga isso?', timestamp: t.helenaQuestions },
    { id: 'msg-raul-5', senderId: 'raul', text: 'Me liga. Por mensagem as coisas ficam fora de contexto.', timestamp: '2026-11-11T21:11:00-03:00' },
  ] },
  { id: 'chat-eva', characterId: 'eva', unread: 0, messages: [
    { id: 'msg-eva-1', senderId: 'eva', text: 'Recebi os arquivos. Antes de publicar qualquer coisa, preciso confirmar a origem.', timestamp: '2026-11-10T14:20:00-03:00' },
    { id: 'msg-eva-2', senderId: 'helena', text: 'eu fiz as imagens. o que eu não sei é quem autorizou aquela entrada.', timestamp: '2026-11-10T14:28:00-03:00' },
    { id: 'msg-eva-3', senderId: 'eva', text: 'Imagem e interpretação são coisas diferentes. Guarda os originais, inclusive os que parecem repetidos.', timestamp: '2026-11-10T14:31:00-03:00' },
    { id: 'msg-eva-4', senderId: 'helena', text: 'tem uma cópia fora do telefone. amanhã te explico onde', timestamp: '2026-11-11T19:18:00-03:00' },
    { id: 'msg-eva-5', senderId: 'eva', text: 'Não vai sozinha. Se mudou alguma coisa, me avisa antes.', timestamp: '2026-11-11T19:21:00-03:00' },
  ] },
  { id: 'chat-tiago', characterId: 'tiago', unread: 0, messages: [
    { id: 'msg-tiago-1', senderId: 'tiago', text: 'Oi. Tua lente ainda tá aqui. Posso deixar na portaria?', timestamp: '2026-11-07T10:14:00-03:00' },
    { id: 'msg-tiago-2', senderId: 'helena', text: 'pode. obrigada por guardar.', timestamp: '2026-11-07T11:09:00-03:00' },
    { id: 'msg-tiago-3', senderId: 'tiago', text: 'Tem um livro teu junto. O das marés.', timestamp: '2026-11-07T11:11:00-03:00' },
    { id: 'msg-tiago-4', senderId: 'helena', text: 'esse era teu. pode ficar', timestamp: '2026-11-07T11:15:00-03:00' },
    { id: 'msg-tiago-5', senderId: 'tiago', text: 'A Marina me ligou. Eu não te vi na quarta. Mas tô tentando ajudar, de verdade.', timestamp: '2026-11-13T09:42:00-03:00' },
  ] },
  { id: 'chat-daniel', characterId: 'daniel', unread: 0, messages: [
    { id: 'msg-daniel-1', senderId: 'daniel', text: 'Boa tarde, Helena. Chegou uma caixa no teu nome. Recebi aqui no 302.', timestamp: '2026-11-05T15:12:00-03:00' },
    { id: 'msg-daniel-2', senderId: 'helena', text: 'obrigada, Daniel! pego quando voltar do estúdio.', timestamp: '2026-11-05T15:20:00-03:00' },
    { id: 'msg-daniel-3', senderId: 'daniel', text: 'Sem pressa. Cuidado com o degrau da entrada que tá solto.', timestamp: '2026-11-05T15:23:00-03:00' },
    { id: 'msg-daniel-4', senderId: 'helena', text: 'já quase perdi o tornozelo ali 😅 vou avisar a síndica', timestamp: '2026-11-05T15:24:00-03:00' },
    { id: 'msg-daniel-5', senderId: 'daniel', text: 'Tu deixou a luz da cozinha acesa. Tá tudo bem?', timestamp: '2026-11-12T06:48:00-03:00' },
  ] },
  { id: 'chat-unknown', characterId: 'unknown', unread: 0, messages: [
    { id: 'msg-unknown-1', senderId: 'unknown', text: 'Trocaram o cadeado. O caminho antigo ainda existe.', timestamp: '2026-11-11T22:02:00-03:00' },
    { id: 'msg-unknown-2', senderId: 'helena', text: 'quem te passou esse número?', timestamp: '2026-11-11T22:04:00-03:00' },
    { id: 'msg-unknown-3', senderId: 'unknown', text: 'Não leva o cartão original.', timestamp: '2026-11-11T22:07:00-03:00' },
  ] },
];

export const locations: LocationRecord[] = [
  { id: 'casa', name: 'Apartamento da Helena', address: 'Rua das Acácias, 218 · Centro', x: 37, y: 67, description: 'A janela da cozinha dá para os fundos da padaria.' },
  { id: 'cafe', name: 'Café Maré Mansa', address: 'Rua das Acácias, 92 · Centro', x: 31, y: 55, description: 'Café pequeno, pão de queijo e uma mesa perto da janela. Fecha às 19h.' },
  { id: 'estudio', name: 'Estúdio Horizonte', address: 'Av. dos Pescadores, 410 · Vila Nova', x: 25, y: 31, description: 'Ilha de edição e aluguel de equipamentos audiovisuais.' },
  { id: 'farol', name: 'Farol do Sul', address: 'Estrada do Farol · Ponta Sul', x: 78, y: 24, description: 'Farol desativado. A trilha costeira permanece aberta durante o dia.' },
  { id: 'cais', name: 'Cais da Aurora', address: 'Av. do Porto · Bairro do Porto', x: 65, y: 58, description: 'Armazéns antigos e acesso de serviço. O portão principal fecha às 22h.' },
  { id: 'balsa', name: 'Terminal da Balsa', address: 'Av. do Porto, 870 · Bairro do Porto', x: 72, y: 78, description: 'Travessia para a Ilha das Pedras. Última saída regular às 23h40.' },
  { id: 'dunas', name: 'Dunas do Norte', address: 'Estrada da Praia · Praia Norte', x: 57, y: 14, description: 'Passarela de madeira e vegetação de restinga. Um dos lugares favoritos de Helena.' },
];

export const photos: MediaAsset[] = [
  { id: 'photo-birthday', title: 'Depois da chuva', src: 'assets/coast.svg', timestamp: t.oldCoastPhoto, locationId: 'dunas', description: 'O mar numa tarde do aniversário de Helena. Reconstrução visual original.' },
  { id: 'photo-coffee', title: 'Um café antes de tudo', src: 'assets/coffee.svg', timestamp: t.coffeePhoto, locationId: 'cafe', description: 'Uma xícara na mesa perto da janela do Maré Mansa. Reconstrução visual original.' },
  { id: 'photo-studio', title: 'Mais uma tarde de edição', src: 'assets/studio.svg', timestamp: t.studioPhoto, locationId: 'estudio', description: 'Equipamentos de edição e a janela do estúdio. Reconstrução visual original.' },
  { id: 'photo-farol', title: 'Farol, antes de anoitecer', src: 'assets/lighthouse.svg', timestamp: t.lighthousePhoto, locationId: 'farol', description: 'O farol sob a luz do fim de tarde. Arquivo original preservado; captura em 9 de novembro. Reconstrução visual original.', evidenceId: 'ev-photo' },
  { id: 'photo-dunes', title: 'O caminho de sempre', src: 'assets/dunes.svg', timestamp: t.dunesPhoto, locationId: 'dunas', description: 'A passarela desaparece entre as dunas. Reconstrução visual original.' },
  { id: 'photo-ferry', title: 'Luzes na travessia', src: 'assets/ferry.svg', timestamp: t.ferryPhoto, locationId: 'balsa', description: 'Luzes do terminal refletidas na água. O enquadramento não permite identificar quem estava presente. Reconstrução visual original.' },
];

export const emails: MailRecord[] = [
  { id: 'mail-balsa', sender: 'Travessias Santa Aurora', subject: 'Sua passagem · Travessia noturna', timestamp: t.ferryReceipt, body: 'Olá, Helena.\n\nBilhete SA-1148 validado no Terminal da Balsa em 11/11/2026, às 23h40.\nDestino: Ilha das Pedras.\nTipo: pedestre · somente ida.\n\nO bilhete é transferível. A validação registra a passagem pelo terminal, não a identidade do passageiro.\n\nBoa travessia.\nEquipe Travessias Santa Aurora', evidenceId: 'ev-ferry' },
  { id: 'mail-work', sender: 'Estúdio Horizonte', subject: 'Reserva confirmada — sala 02', timestamp: '2026-11-10T16:08:00-03:00', body: 'Helena, tua sala está reservada para sexta, dia 13, das 14h às 18h.\n\nA chaleira nova já chegou. Pode trazer teu chá.\n\nAbraço,\nCris · Estúdio Horizonte' },
  { id: 'mail-shop', sender: 'Papel & Afeto', subject: 'Teu pedido saiu para entrega 📦', timestamp: '2026-11-05T08:30:00-03:00', body: 'Um caderno pontilhado, duas canetas e um marcador verde estão a caminho.\n\nEntrega prevista: hoje, até 18h.\nEndereço: Rua das Acácias, 218.\n\nObrigada por apoiar uma papelaria local!' },
  { id: 'mail-library', sender: 'Biblioteca Municipal', subject: 'Renovação: Atlas do litoral sul', timestamp: '2026-11-03T09:00:00-03:00', body: 'Empréstimo renovado até 17 de novembro de 2026.\n\nLivro: Atlas do litoral sul.\nA biblioteca funciona de segunda a sexta, das 9h às 18h.' },
  { id: 'mail-news', sender: 'Cinema da Praça', subject: 'Domingo tem sessão ao ar livre', timestamp: '2026-11-02T12:15:00-03:00', body: 'Leva uma cadeira, um casaco e quem tu gosta. Nossa próxima sessão começa às 20h, se a chuva deixar.\n\nEntrada gratuita. Praça do Coreto, Santa Aurora.' },
];

export const notes: NoteRecord[] = [
  { id: 'note-mare', title: 'Não esquecer', timestamp: t.lastNote, body: 'maré baixa — 02:14\n\nnão usar o portão principal\nlevar bateria reserva\no original fica\n\nperguntar pra E. antes de entregar qualquer coisa', evidenceId: 'ev-note' },
  { id: 'note-shopping', title: 'Mercado / casa', timestamp: '2026-11-10T08:11:00-03:00', body: 'Café\nFiltro de papel\nTomate\nSabão de roupa\nPilha pro controle\n\nDevolver a jaqueta da Marina no domingo.' },
  { id: 'note-film', title: 'Filmes pra ver com a Bia', timestamp: '2026-10-27T22:10:00-03:00', body: 'A casa do outro lado\nPequenos dias\nO último verão\n\nSem escolher filme de três horas numa terça. Acordar cedo também é um plano.' },
  { id: 'note-client', title: 'Horizonte — ajustes', timestamp: '2026-11-10T09:45:00-03:00', body: 'Corrigir ruído na entrevista 03.\nMenos contraste nos planos da praia.\nLegendas: conferir nomes com a produção.\nExportar uma cópia sem trilha.' },
];

export const calendarEvents: CalendarEvent[] = [
  { id: 'cal-cafe', title: 'Café com Bia', timestamp: '2026-11-12T16:00:00-03:00', locationId: 'cafe', description: 'Mesa da janela, se não estiver chovendo.' },
  { id: 'cal-work', title: 'Finalizar corte · Horizonte', timestamp: '2026-11-13T14:00:00-03:00', locationId: 'estudio', description: 'Sala 02 reservada até as 18h. Levar fone.' },
  { id: 'cal-lunch', title: 'Almoço na mãe', timestamp: '2026-11-15T12:30:00-03:00', description: 'Levar sobremesa e a jaqueta da Marina.' },
  { id: 'cal-book', title: 'Devolver livro da biblioteca', timestamp: '2026-11-17T17:00:00-03:00', description: 'Atlas do litoral sul. Conferir horário antes de sair.' },
];

export const calls: CallRecord[] = [
  { id: 'call-1', characterId: 'marina', timestamp: '2026-11-13T20:21:00-03:00', direction: 'missed', duration: 0 },
  { id: 'call-2', characterId: 'bia', timestamp: '2026-11-13T18:07:00-03:00', direction: 'missed', duration: 0 },
  { id: 'call-3', characterId: 'marina', timestamp: '2026-11-12T10:22:00-03:00', direction: 'missed', duration: 0 },
  { id: 'call-4', characterId: 'eva', timestamp: '2026-11-12T08:10:00-03:00', direction: 'missed', duration: 0 },
  { id: 'call-5', characterId: 'unknown', timestamp: '2026-11-12T01:52:00-03:00', direction: 'incoming', duration: 41 },
  { id: 'call-6', characterId: 'raul', timestamp: '2026-11-11T21:13:00-03:00', direction: 'outgoing', duration: 123 },
  { id: 'call-7', characterId: 'bia', timestamp: '2026-11-10T12:12:00-03:00', direction: 'incoming', duration: 486 },
  { id: 'call-8', characterId: 'daniel', timestamp: '2026-11-05T18:31:00-03:00', direction: 'outgoing', duration: 28 },
];

export const evidence: Evidence[] = [
  { id: 'ev-raul', title: 'O pedido de Raul', description: 'Raul pede que Helena confirme que a fotografia do farol foi feita em 11 de novembro, às 21h.', sourceApp: 'messages', sourceRecordId: 'msg-raul-claim', gameTimestamp: t.raulClaim, relatedCharacters: ['raul', 'helena'], relatedLocations: ['cais', 'farol'], relatedEvidenceIds: ['ev-photo'], reliability: 'testimony', importance: 'major', narrativeTags: ['horário', 'relato', 'fotografia'] },
  { id: 'ev-photo', title: 'O arquivo original do farol', description: 'Os metadados registram a captura em 9 de novembro, às 18h07, no Farol do Sul.', sourceApp: 'photos', sourceRecordId: 'photo-farol', gameTimestamp: t.lighthousePhoto, relatedCharacters: ['helena'], relatedLocations: ['farol'], relatedEvidenceIds: ['ev-raul'], reliability: 'record', importance: 'major', narrativeTags: ['metadados', 'horário', 'fotografia'] },
  { id: 'ev-ferry', title: 'Uma passagem validada', description: 'Um bilhete no nome de Helena foi validado às 23h40 no terminal. O bilhete era transferível.', sourceApp: 'mail', sourceRecordId: 'mail-balsa', gameTimestamp: t.ferryReceipt, relatedCharacters: ['helena'], relatedLocations: ['balsa'], relatedEvidenceIds: ['ev-note'], reliability: 'record', importance: 'major', narrativeTags: ['travessia', 'deslocamento'] },
  { id: 'ev-note', title: 'O horário na anotação', description: 'Helena anotou “maré baixa — 02:14” e uma instrução para evitar o portão principal.', sourceApp: 'notes', sourceRecordId: 'note-mare', gameTimestamp: t.lastNote, relatedCharacters: ['helena', 'eva'], relatedLocations: ['cais'], relatedEvidenceIds: ['ev-ferry'], reliability: 'record', importance: 'major', narrativeTags: ['horário', 'preparação'] },
];

export const hypotheses: Hypothesis[] = [
  { id: 'hyp-photo', title: 'A fotografia comprova o encontro descrito por Raul?', supportingEvidence: ['ev-raul'], contradictingEvidence: ['ev-photo'] },
  { id: 'hyp-ferry', title: 'Helena pretendia sair da cidade naquela noite?', supportingEvidence: ['ev-ferry', 'ev-note'], contradictingEvidence: [] },
];

export const storyEvents: InvestigationEvent[] = [
  { id: 'event-marina-checkin', condition: { type: 'all', conditions: [{ type: 'evidence', id: 'ev-raul' }, { type: 'evidence', id: 'ev-photo' }] }, notification: { id: 'notification-marina-checkin', app: 'messages', title: 'Marina Leal', body: 'Tu conseguiu abrir as fotos? O que o Raul falou não bate com o que ele contou pra mim.', timestamp: t.marinaFollowUp, recordId: 'marina' } },
];
