import { z } from 'zod';
import type { AppId, SaveGame } from '../core/types';
import { calls, calendarEvents, characters, conversations, emails, evidence, hypotheses, locations, notes, photos, storyEvents } from '../story/data';
import { evaluateCondition } from '../engine/conditions';

export const MAX_IMPORT_BYTES = 1_048_576;
export const appIdSchema = z.enum(['messages', 'photos', 'notes', 'mail', 'calendar', 'maps', 'phone', 'investigation', 'settings']);
const identifier = z.string().min(1).max(120).regex(/^[a-zA-Z0-9_-]+$/);
const timestamp = z.iso.datetime({ offset: true });
const uniqueIdentifiers = z.array(identifier).max(2_000).refine((ids) => new Set(ids).size === ids.length, 'Identificadores duplicados.');
const notificationSchema = z.strictObject({
  id: identifier, app: appIdSchema, title: z.string().max(160), body: z.string().max(4_000),
  timestamp, recordId: identifier.optional(),
});
const appRecordsSchema = z.strictObject({
  messages: identifier.optional(), photos: identifier.optional(), notes: identifier.optional(),
  mail: identifier.optional(), calendar: identifier.optional(), maps: identifier.optional(),
  phone: identifier.optional(), investigation: identifier.optional(), settings: identifier.optional(),
});

export const saveGameSchema: z.ZodType<SaveGame> = z.strictObject({
  schemaVersion: z.literal(1), id: z.literal('local-main'), updatedAt: timestamp,
  unlocked: z.boolean(), started: z.boolean(), virtualTime: timestamp, narrativeTime: timestamp,
  activeApp: appIdSchema.nullable(), openedApps: z.array(appIdSchema).max(9).refine((ids) => new Set(ids).size === ids.length),
  appRecords: appRecordsSchema, discoveredEvidence: uniqueIdentifiers, consumedEvents: uniqueIdentifiers,
  notifications: z.array(notificationSchema).max(500).refine((items) => new Set(items.map((item) => item.id)).size === items.length),
  playerNotes: z.string().max(50_000),
  decisions: z.array(z.strictObject({ id: identifier, option: z.string().max(2_000), timestamp })).max(500),
  preferences: z.strictObject({
    dark: z.boolean(), brightness: z.number().finite().min(0.3).max(1), volume: z.number().finite().min(0).max(1),
    airplane: z.boolean(), wifi: z.boolean(), bluetooth: z.boolean(), wallpaper: z.enum(['coast', 'dusk']),
  }),
});

const knownEvidenceIds = new Set(evidence.map((record) => record.id));
const knownEventIds = new Set(storyEvents.map((record) => record.id));
const appRecordIds: Record<AppId, Set<string>> = {
  messages: new Set([...conversations.map((chat) => chat.id), ...conversations.flatMap((chat) => chat.messages.map((message) => message.id))]),
  photos: new Set(photos.map((photo) => photo.id)),
  notes: new Set(['player', ...notes.map((note) => note.id)]),
  mail: new Set(emails.map((email) => email.id)),
  calendar: new Set(calendarEvents.map((event) => event.id)),
  maps: new Set(locations.map((location) => location.id)),
  phone: new Set([...calls.map((call) => call.id), ...characters.map((character) => character.id)]),
  investigation: new Set([...evidence.map((item) => item.id), ...hypotheses.map((item) => item.id)]),
  settings: new Set(),
};

export function isValidAppRecord(app: AppId, recordId: string): boolean {
  return appRecordIds[app].has(recordId);
}

/** Shape validation is insufficient: all deep links and narrative references must exist. */
function hasConsistentReferences(save: SaveGame): boolean {
  if (save.activeApp && !save.openedApps.includes(save.activeApp)) return false;
  if (save.unlocked && !save.started) return false;
  if (save.discoveredEvidence.some((id) => !knownEvidenceIds.has(id))) return false;
  if (save.consumedEvents.some((id) => !knownEventIds.has(id))) return false;
  for (const [app, recordId] of Object.entries(save.appRecords)) {
    if (recordId !== undefined && !isValidAppRecord(app as AppId, recordId)) return false;
  }
  for (const notification of save.notifications) {
    if (notification.recordId && !isValidAppRecord(notification.app, notification.recordId)) return false;
    const event = storyEvents.find((item) => item.notification.id === notification.id);
    if (event && !save.consumedEvents.includes(event.id)) return false;
  }
  return save.consumedEvents.every((id) => {
    const event = storyEvents.find((item) => item.id === id)!;
    return evaluateCondition(event.condition, { evidenceIds: save.discoveredEvidence, eventIds: save.consumedEvents });
  });
}

export function parseSave(data: unknown): SaveGame {
  const result = saveGameSchema.safeParse(data);
  if (!result.success || !hasConsistentReferences(result.data)) throw new Error('Progresso incompatível ou inválido. O arquivo original foi preservado.');
  return result.data;
}

export function parseSaveFile(text: string): SaveGame {
  if (new TextEncoder().encode(text).byteLength > MAX_IMPORT_BYTES) throw new Error('O arquivo excede o limite de 1 MB.');
  let data: unknown;
  try { data = JSON.parse(text); } catch { throw new Error('O arquivo não contém JSON válido.'); }
  return parseSave(data);
}
