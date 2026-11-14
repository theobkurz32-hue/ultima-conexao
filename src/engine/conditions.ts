import type { InvestigationEvent, NarrativeCondition } from '../core/types';

export interface EvaluationState { evidenceIds: readonly string[]; eventIds: readonly string[]; }

/** Declarative evaluation only; no expressions, dynamic code, network or wall clock. */
export function evaluateCondition(condition: NarrativeCondition, state: EvaluationState): boolean {
  switch (condition.type) {
    case 'evidence': return state.evidenceIds.includes(condition.id);
    case 'event': return state.eventIds.includes(condition.id);
    case 'all': return condition.conditions.every(child => evaluateCondition(child, state));
    case 'any': return condition.conditions.some(child => evaluateCondition(child, state));
  }
}

/** Resolves cascading events to a fixed point; consumed event IDs make reloads idempotent. */
export function collectTriggeredEvents(events: readonly InvestigationEvent[], state: EvaluationState): InvestigationEvent[] {
  const eventIds = new Set(state.eventIds);
  const triggered: InvestigationEvent[] = [];
  let changed = true;
  while (changed) {
    changed = false;
    for (const event of events) {
      if (!eventIds.has(event.id) && evaluateCondition(event.condition, { evidenceIds: state.evidenceIds, eventIds: [...eventIds] })) {
        eventIds.add(event.id);
        triggered.push(event);
        changed = true;
      }
    }
  }
  return triggered;
}
