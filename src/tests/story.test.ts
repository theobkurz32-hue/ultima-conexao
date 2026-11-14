import { describe, expect, it } from 'vitest';
import type { InvestigationEvent } from '../core/types';
import { collectTriggeredEvents, evaluateCondition } from '../engine/conditions';
import { validateStoryData } from '../engine/validation';
import { chronology } from '../story/chronology';
import { storyEvents } from '../story/data';

describe('integridade da narrativa', () => {
  it('mantém referências, instantes, ordenação e eventos alcançáveis', () => expect(validateStoryData()).toEqual([]));
  it('preserva a diferença deliberada entre captura e relato', () => {
    expect(Date.parse(chronology.lighthousePhoto)).toBeLessThan(Date.parse(chronology.raulClaim));
    expect(Date.parse(chronology.ferryReceipt)).toBeLessThan(Date.parse(chronology.lastKnownRecord));
  });
});

describe('condições determinísticas', () => {
  it('não dispara a reação de Marina com apenas uma das fontes', () => {
    expect(collectTriggeredEvents(storyEvents, { evidenceIds: ['ev-photo'], eventIds: [] })).toEqual([]);
    expect(collectTriggeredEvents(storyEvents, { evidenceIds: ['ev-raul'], eventIds: [] })).toEqual([]);
  });
  it('permite descobrir as duas fontes em qualquer ordem, sem repetir eventos consumidos', () => {
    for (const evidenceIds of [['ev-photo', 'ev-raul'], ['ev-raul', 'ev-photo']]) {
      const result = collectTriggeredEvents(storyEvents, { evidenceIds, eventIds: [] });
      expect(result.map(item => item.id)).toEqual(['event-marina-checkin']);
      expect(collectTriggeredEvents(storyEvents, { evidenceIds, eventIds: result.map(item => item.id) })).toEqual([]);
    }
  });
  it('avalia alternativas sem confundir testemunho com confirmação', () => {
    expect(evaluateCondition({ type: 'any', conditions: [{ type: 'evidence', id: 'ev-ferry' }, { type: 'event', id: 'event-marina-checkin' }] }, { evidenceIds: [], eventIds: ['event-marina-checkin'] })).toBe(true);
    expect(evaluateCondition({ type: 'all', conditions: [{ type: 'evidence', id: 'ev-ferry' }, { type: 'event', id: 'event-marina-checkin' }] }, { evidenceIds: [], eventIds: ['event-marina-checkin'] })).toBe(false);
  });
  it('resolve cascatas e encerra ciclos sem entrada', () => {
    const base = storyEvents[0];
    const cascade: InvestigationEvent[] = [
      { ...base, id: 'second', condition: { type: 'event', id: 'first' } },
      { ...base, id: 'first', condition: { type: 'evidence', id: 'seed' } },
    ];
    expect(collectTriggeredEvents(cascade, { evidenceIds: ['seed'], eventIds: [] }).map(item => item.id)).toEqual(['first', 'second']);
    const cycle: InvestigationEvent[] = [
      { ...base, id: 'a', condition: { type: 'event', id: 'b' } },
      { ...base, id: 'b', condition: { type: 'event', id: 'a' } },
    ];
    expect(collectTriggeredEvents(cycle, { evidenceIds: ['seed'], eventIds: [] })).toEqual([]);
  });
});
