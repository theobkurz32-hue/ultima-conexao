/** Canonical instants. Dates in the fictional records derive from this timeline. */
export const chronology = {
  oldCoastPhoto: '2026-08-17T17:32:00-03:00',
  coffeePhoto: '2026-10-29T09:18:00-03:00',
  studioPhoto: '2026-11-05T16:52:00-03:00',
  lighthousePhoto: '2026-11-09T18:07:00-03:00',
  dunesPhoto: '2026-11-10T18:32:00-03:00',
  raulClaim: '2026-11-11T21:06:00-03:00',
  helenaQuestions: '2026-11-11T21:09:00-03:00',
  lastNote: '2026-11-11T22:18:00-03:00',
  ferryReceipt: '2026-11-11T23:40:00-03:00',
  ferryPhoto: '2026-11-11T23:46:00-03:00',
  lastKnownRecord: '2026-11-12T02:14:00-03:00',
  phoneRecovered: '2026-11-13T19:25:00-03:00',
  investigationStart: '2026-11-13T21:41:00-03:00',
  marinaFollowUp: '2026-11-13T21:43:00-03:00',
} as const;

export const canonicalFacts = [
  { id: 'fact-photo', at: chronology.lighthousePhoto, place: 'farol', people: ['helena'], recordIds: ['photo-farol'], kind: 'fact', description: 'Helena fotografa o farol no dia 9. O arquivo original conserva o horário de captura.' },
  { id: 'claim-raul', at: chronology.raulClaim, place: 'cais', people: ['raul'], recordIds: ['msg-raul-claim'], kind: 'intentional-contradiction', description: 'Raul usa uma imagem antiga como se registrasse uma presença conjunta no dia 11. A mensagem é um relato, não um fato comprovado.' },
  { id: 'fact-ferry', at: chronology.ferryReceipt, place: 'balsa', people: ['helena'], recordIds: ['mail-balsa'], kind: 'fact', description: 'Uma passagem da travessia noturna foi validada no terminal. A validação não identifica quem embarcou.' },
  { id: 'fact-last', at: chronology.lastKnownRecord, place: 'cais', people: ['helena'], recordIds: ['note-mare'], kind: 'fact', description: '02:14 é o último horário associado ao desaparecimento. O capítulo inicial não estabelece o que aconteceu nesse instante.' },
] as const;
