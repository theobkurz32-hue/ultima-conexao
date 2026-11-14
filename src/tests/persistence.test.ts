import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it } from 'vitest';
import { createIndexedDbRepository, PhoneDatabase } from '../database/repository';
import { parseSaveFile, MAX_IMPORT_BYTES } from '../database/schema';
import { initialSave } from '../core/store';

const databases: PhoneDatabase[] = [];
afterEach(async () => { await Promise.all(databases.splice(0).map((database) => database.delete())); });

describe('save validation and IndexedDB', () => {
  it('round-trips all mutable progress through IndexedDB', async () => {
    const database = new PhoneDatabase(`persistence-${crypto.randomUUID()}`);
    databases.push(database);
    const repository = createIndexedDbRepository(database);
    const progress = { ...initialSave(), discoveredEvidence: ['ev-photo'], playerNotes: 'Conferir a data de captura.', unlocked: true, started: true };
    await repository.save(progress);
    expect(await repository.load()).toEqual(progress);
  });

  it('rejects unsafe imports, unexpected app ids and impossible preferences', () => {
    const save = initialSave();
    expect(() => parseSaveFile('{broken')).toThrow('JSON');
    expect(() => parseSaveFile(JSON.stringify({ ...save, activeApp: 'javascript:alert(1)' }))).toThrow('inválido');
    expect(() => parseSaveFile(JSON.stringify({ ...save, preferences: { ...save.preferences, brightness: 9 } }))).toThrow();
    expect(() => parseSaveFile(JSON.stringify({ ...save, schemaVersion: 2 }))).toThrow();
    expect(() => parseSaveFile(JSON.stringify({ ...save, notifications: [{ ...save.notifications[0], app: 'unknown' }] }))).toThrow();
    expect(() => parseSaveFile(JSON.stringify({ ...save, appRecords: { __unexpected: 'script' } }))).toThrow();
    expect(() => parseSaveFile(' '.repeat(MAX_IMPORT_BYTES + 1))).toThrow('1 MB');
  });

  it('does not rewrite an incompatible stored record', async () => {
    const database = new PhoneDatabase(`invalid-${crypto.randomUUID()}`);
    databases.push(database);
    const broken = { ...initialSave(), schemaVersion: 99 };
    await database.table('saves').put(broken);
    await expect(createIndexedDbRepository(database).load()).rejects.toThrow('incompatível');
    expect(await database.table('saves').get('local-main')).toEqual(broken);
  });

  it('rejects well-shaped saves whose narrative references are impossible', () => {
    const save = initialSave();
    const invalidStates = [
      { ...save, discoveredEvidence: ['ev-inexistente'] },
      { ...save, consumedEvents: ['event-inexistente'] },
      { ...save, consumedEvents: ['event-marina-checkin'] },
      { ...save, appRecords: { photos: 'photo-inexistente' } },
      { ...save, activeApp: 'messages', openedApps: [] },
      { ...save, notifications: [{ ...save.notifications[0], recordId: 'contato-inexistente' }] },
    ];
    for (const invalid of invalidStates) expect(() => parseSaveFile(JSON.stringify(invalid))).toThrow('inválido');
    expect(parseSaveFile(JSON.stringify({ ...save, appRecords: { messages: 'msg-raul-claim', notes: 'player' } }))).toMatchObject({ appRecords: { messages: 'msg-raul-claim', notes: 'player' } });
  });
});
