import { describe, expect, it, vi } from 'vitest';
import { createPhoneStore, initialSave } from '../core/store';
import type { SaveGame } from '../core/types';
import type { SaveRepository } from '../database/repository';

function memoryRepository(saved?: SaveGame): SaveRepository {
  let value = saved;
  return { load: async () => value, save: async (save) => { value = structuredClone(save); }, clear: async () => { value = undefined; } };
}

describe('phone state', () => {
  it('authenticates the fictional code and preserves app navigation on restart', async () => {
    const repository = memoryRepository();
    const store = createPhoneStore(repository);
    await store.getState().hydrate();
    expect(store.getState().unlock('1234')).toBe(false);
    expect(store.getState().unlocked).toBe(false);
    expect(store.getState().unlock('1708')).toBe(true);
    store.getState().openApp('messages', 'marina');
    store.getState().home();
    store.getState().openApp('photos', 'photo-birthday');
    store.getState().setPlayerNotes('A fotografia é de outro dia.');
    await store.getState().flushSave();
    const resumed = createPhoneStore(repository);
    await resumed.getState().hydrate();
    expect(resumed.getState().activeApp).toBe('photos');
    expect(resumed.getState().appRecords.messages).toBe('marina');
    expect(resumed.getState().openedApps).toEqual(['messages', 'photos']);
    expect(resumed.getState().playerNotes).toContain('outro dia');
  });

  it('serializes disk writes so an older operation cannot overwrite newer progress', async () => {
    let activeWrites = 0;
    let maxActiveWrites = 0;
    let persisted: SaveGame | undefined;
    const repository: SaveRepository = {
      load: async () => undefined, clear: async () => undefined,
      save: async (save) => {
        maxActiveWrites = Math.max(maxActiveWrites, ++activeWrites);
        await new Promise((resolve) => setTimeout(resolve, 1));
        persisted = save;
        activeWrites--;
      },
    };
    const store = createPhoneStore(repository);
    await store.getState().hydrate();
    store.getState().setPlayerNotes('primeira');
    store.getState().setPlayerNotes('última');
    await store.getState().flushSave();
    expect(maxActiveWrites).toBe(1);
    expect(persisted?.playerNotes).toBe('última');
  });

  it('preserves existing progress when an import is invalid', async () => {
    const store = createPhoneStore(memoryRepository());
    await store.getState().hydrate();
    store.getState().setPlayerNotes('Não apagar');
    await expect(store.getState().importSave('{"schemaVersion":99}')).rejects.toThrow();
    expect(store.getState().playerNotes).toBe('Não apagar');
    const exported = store.getState().exportSave();
    await store.getState().resetGame();
    expect(store.getState().playerNotes).toBe('');
    await store.getState().importSave(exported);
    expect(store.getState().playerNotes).toBe('Não apagar');
  });

  it('does not autosave defaults after hydration failed', async () => {
    const save = vi.fn(async () => undefined);
    const repository: SaveRepository = { load: async () => { throw new Error('Progresso incompatível'); }, save, clear: async () => undefined };
    const store = createPhoneStore(repository);
    await store.getState().hydrate();
    store.getState().startGame();
    await store.getState().flushSave();
    expect(save).not.toHaveBeenCalled();
    expect(store.getState().storageError).toBe('Progresso incompatível');
  });

  it('surfaces write errors without discarding the in-memory investigation', async () => {
    const store = createPhoneStore({ load: async () => initialSave(), save: async () => { throw new Error('quota'); }, clear: async () => undefined });
    await store.getState().hydrate();
    store.getState().setPlayerNotes('Exportar este registro');
    await store.getState().flushSave();
    expect(store.getState().storageError).toContain('Exporte');
    expect(JSON.parse(store.getState().exportSave()).playerNotes).toBe('Exportar este registro');
  });

  it('fires a narrative notification once and never repeats it after a restart', async () => {
    const repository = memoryRepository();
    const store = createPhoneStore(repository);
    await store.getState().hydrate();
    store.getState().discoverEvidence('ev-raul');
    expect(store.getState().consumedEvents).toEqual([]);
    store.getState().discoverEvidence('ev-photo');
    expect(store.getState().consumedEvents).toEqual(['event-marina-checkin']);
    const triggered = store.getState().notifications.filter((notification) => notification.id === 'notification-marina-checkin');
    expect(triggered).toHaveLength(1);
    await store.getState().flushSave();
    const resumed = createPhoneStore(repository);
    await resumed.getState().hydrate();
    resumed.getState().discoverEvidence('ev-photo');
    expect(resumed.getState().notifications.filter((notification) => notification.id === 'notification-marina-checkin')).toHaveLength(1);
  });

  it('defers narrative delivery in airplane mode and delivers once after reconnecting', async () => {
    const repository = memoryRepository();
    const store = createPhoneStore(repository);
    await store.getState().hydrate();
    store.getState().setPreference('airplane', true);
    store.getState().discoverEvidence('ev-raul');
    store.getState().discoverEvidence('ev-photo');
    expect(store.getState().consumedEvents).toEqual([]);
    await store.getState().flushSave();
    const resumed = createPhoneStore(repository);
    await resumed.getState().hydrate();
    expect(resumed.getState().consumedEvents).toEqual([]);
    resumed.getState().setPreference('airplane', false);
    expect(resumed.getState().consumedEvents).toEqual(['event-marina-checkin']);
    resumed.getState().setPreference('wifi', false);
    resumed.getState().setPreference('wifi', true);
    expect(resumed.getState().notifications.filter((notification) => notification.id === 'notification-marina-checkin')).toHaveLength(1);
  });

  it('waits for initial hydration before importing so a slow disk read cannot undo the import', async () => {
    let finishLoad!: (save: SaveGame) => void;
    const repository: SaveRepository = {
      load: () => new Promise((resolve) => { finishLoad = resolve; }),
      save: async () => undefined, clear: async () => undefined,
    };
    const store = createPhoneStore(repository);
    const hydration = store.getState().hydrate();
    const importing = store.getState().importSave(JSON.stringify({ ...initialSave(), playerNotes: 'Arquivo escolhido pelo jogador' }));
    finishLoad({ ...initialSave(), playerNotes: 'Arquivo antigo no disco' });
    await hydration;
    await importing;
    expect(store.getState().playerNotes).toBe('Arquivo escolhido pelo jogador');
  });
});
