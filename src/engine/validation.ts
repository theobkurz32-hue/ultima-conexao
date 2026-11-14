import type { NarrativeCondition } from '../core/types';
import { calls, calendarEvents, characters, conversations, emails, evidence, hypotheses, locations, notes, photos, storyEvents } from '../story/data';
import { collectTriggeredEvents } from './conditions';

export function validateStoryData(): string[] {
  const errors: string[] = [];
  const collections = [characters, conversations, emails, evidence, hypotheses, locations, notes, photos, storyEvents, calls, calendarEvents, conversations.flatMap(chat => chat.messages)];
  // IDs are unique within their entity namespace; foreign keys identify the target type.
  for (const records of collections) {
    const ids = new Set<string>();
    for (const item of records) {
      if (ids.has(item.id)) errors.push(`ID duplicado: ${item.id}`);
      ids.add(item.id);
    }
  }
  const characterIds = new Set(characters.map(record => record.id));
  const locationIds = new Set(locations.map(record => record.id));
  const evidenceIds = new Set(evidence.map(record => record.id));
  const eventIds = new Set(storyEvents.map(record => record.id));
  const sourceIds = {
    messages: new Set(conversations.flatMap(chat => chat.messages.map(message => message.id))),
    photos: new Set(photos.map(record => record.id)),
    mail: new Set(emails.map(record => record.id)),
    notes: new Set(notes.map(record => record.id)),
  };
  const discoverableSources = [
    ...conversations.flatMap(chat => chat.messages.map(message => ({ ...message, sourceApp: 'messages' }))),
    ...photos.map(photo => ({ ...photo, sourceApp: 'photos' })),
    ...emails.map(mail => ({ ...mail, sourceApp: 'mail' })),
    ...notes.map(note => ({ ...note, sourceApp: 'notes' })),
  ];
  const requireRef = (exists: boolean, owner: string, ref: string) => { if (!exists) errors.push(`${owner}: referência ausente ${ref}`); };
  const checkTimestamp = (owner: string, timestamp: string) => {
    if (!timestamp.endsWith('-03:00') || !Number.isFinite(Date.parse(timestamp))) errors.push(`${owner}: instante inválido ${timestamp}`);
  };
  for (const chat of conversations) {
    requireRef(characterIds.has(chat.characterId), chat.id, chat.characterId);
    let previous = -Infinity;
    for (const message of chat.messages) {
      requireRef(characterIds.has(message.senderId), message.id, message.senderId);
      checkTimestamp(message.id, message.timestamp);
      if (Date.parse(message.timestamp) < previous) errors.push(`${chat.id}: mensagens fora de ordem`);
      previous = Date.parse(message.timestamp);
      if (message.evidenceId) requireRef(evidenceIds.has(message.evidenceId), message.id, message.evidenceId);
    }
  }
  for (const item of evidence) {
    const validSource = item.sourceApp in sourceIds && sourceIds[item.sourceApp as keyof typeof sourceIds].has(item.sourceRecordId);
    requireRef(validSource, item.id, item.sourceRecordId);
    checkTimestamp(item.id, item.gameTimestamp);
    const source = discoverableSources.find(record => record.id === item.sourceRecordId && record.sourceApp === item.sourceApp);
    if (source && source.timestamp !== item.gameTimestamp) errors.push(`${item.id}: horário diverge do registro original`);
    if (source && source.evidenceId !== item.id) errors.push(`${item.id}: registro original não vincula a evidência`);
    for (const id of item.relatedCharacters) requireRef(characterIds.has(id), item.id, id);
    for (const id of item.relatedLocations) requireRef(locationIds.has(id), item.id, id);
    for (const id of item.relatedEvidenceIds) requireRef(evidenceIds.has(id), item.id, id);
  }
  for (const source of discoverableSources) if (source.evidenceId) {
    const linked = evidence.find(item => item.id === source.evidenceId);
    requireRef(Boolean(linked), source.id, source.evidenceId);
    if (linked && (linked.sourceRecordId !== source.id || linked.sourceApp !== source.sourceApp)) errors.push(`${source.id}: vínculo inverso de evidência inválido`);
  }
  for (const item of photos) requireRef(locationIds.has(item.locationId), item.id, item.locationId);
  for (const item of calendarEvents) if (item.locationId) requireRef(locationIds.has(item.locationId), item.id, item.locationId);
  for (const item of calls) requireRef(characterIds.has(item.characterId), item.id, item.characterId);
  for (const item of [...photos, ...emails, ...notes, ...calls, ...calendarEvents]) checkTimestamp(item.id, item.timestamp);
  function checkCondition(condition: NarrativeCondition, owner: string): void {
    if (condition.type === 'evidence') requireRef(evidenceIds.has(condition.id), owner, condition.id);
    else if (condition.type === 'event') requireRef(eventIds.has(condition.id), owner, condition.id);
    else {
      if (condition.conditions.length === 0) errors.push(`${owner}: condição vazia`);
      condition.conditions.forEach(child => checkCondition(child, owner));
    }
  }
  for (const event of storyEvents) {
    checkCondition(event.condition, event.id);
    checkTimestamp(event.id, event.notification.timestamp);
    if (event.notification.recordId) {
      const isKnownRecord = event.notification.app === 'messages'
        ? conversations.some(chat => chat.id === event.notification.recordId)
        : allIdsForNotifications().has(event.notification.recordId);
      requireRef(isKnownRecord, event.id, event.notification.recordId);
    }
  }
  const reachable = new Set(collectTriggeredEvents(storyEvents, { evidenceIds: [...evidenceIds], eventIds: [] }).map(item => item.id));
  for (const event of storyEvents) if (!reachable.has(event.id)) errors.push(`${event.id}: evento inalcançável ou ciclo sem entrada`);
  for (const hypothesis of hypotheses) for (const id of [...hypothesis.supportingEvidence, ...hypothesis.contradictingEvidence]) requireRef(evidenceIds.has(id), hypothesis.id, id);
  return errors;
}

function allIdsForNotifications(): Set<string> {
  return new Set([...photos, ...emails, ...notes, ...calls, ...calendarEvents, ...locations].map(item => item.id));
}
