import { create } from 'zustand';
import type { AppId, Preferences, SaveGame } from './types';
import { saveRepository, type SaveRepository } from '../database/repository';
import { isValidAppRecord, parseSaveFile } from '../database/schema';
import { STORY_TIME } from '../utils/time';
import { collectTriggeredEvents } from '../engine/conditions';
import { evidence, storyEvents } from '../story/data';

export function initialSave(): SaveGame {
  return {
    schemaVersion: 1, id: 'local-main', updatedAt: new Date().toISOString(),
    unlocked: false, started: false, virtualTime: STORY_TIME, narrativeTime: STORY_TIME,
    activeApp: null, openedApps: [], appRecords: {}, discoveredEvidence: [], consumedEvents: [],
    notifications: [{
      id: 'marina-lock', app: 'messages', title: 'Marina Leal',
      body: 'O código ainda é o aniversário dela. 17 de agosto. Por favor, encontra alguma coisa.',
      timestamp: STORY_TIME, recordId: 'marina',
    }],
    playerNotes: '', decisions: [],
    preferences: { dark: false, brightness: 1, volume: 0.7, airplane: false, wifi: true, bluetooth: false, wallpaper: 'coast' },
  };
}

export interface PhoneState extends SaveGame {
  hydrated: boolean;
  storageError: string | null;
  hydrate(): Promise<void>;
  startGame(): void;
  unlock(code: string): boolean;
  lock(): void;
  home(): void;
  openApp(app: AppId, recordId?: string): void;
  closeApp(app: AppId): void;
  setPreference<K extends keyof Preferences>(key: K, value: Preferences[K]): void;
  setPlayerNotes(text: string): void;
  discoverEvidence(id: string): void;
  dismissNotification(id: string): void;
  resetGame(): Promise<void>;
  exportSave(): string;
  importSave(text: string): Promise<void>;
  flushSave(): Promise<void>;
}

/** Explicit snapshot keeps actions and transient errors out of IndexedDB/export files. */
export function snapshot(state: SaveGame): SaveGame {
  return {
    schemaVersion: 1, id: 'local-main', updatedAt: state.updatedAt,
    unlocked: state.unlocked, started: state.started, virtualTime: state.virtualTime,
    narrativeTime: state.narrativeTime, activeApp: state.activeApp, openedApps: [...state.openedApps],
    appRecords: { ...state.appRecords }, discoveredEvidence: [...state.discoveredEvidence],
    consumedEvents: [...state.consumedEvents], notifications: state.notifications.map((item) => ({ ...item })),
    playerNotes: state.playerNotes, decisions: state.decisions.map((item) => ({ ...item })),
    preferences: { ...state.preferences },
  };
}

function narrativePatch(state: SaveGame): Pick<SaveGame, 'consumedEvents' | 'notifications' | 'narrativeTime'> {
  const triggered = state.preferences.airplane ? [] : collectTriggeredEvents(storyEvents, {
    evidenceIds: state.discoveredEvidence, eventIds: state.consumedEvents,
  });
  const notifications = [...state.notifications];
  for (const event of triggered) {
    if (!notifications.some((item) => item.id === event.notification.id)) notifications.push(event.notification);
  }
  return {
    consumedEvents: [...state.consumedEvents, ...triggered.map((event) => event.id)], notifications,
    narrativeTime: triggered.reduce((time, event) => Date.parse(event.notification.timestamp) > Date.parse(time) ? event.notification.timestamp : time, state.narrativeTime),
  };
}

export function createPhoneStore(repository: SaveRepository = saveRepository) {
  let writeQueue: Promise<void> = Promise.resolve();
  let hydration: Promise<void> | undefined;
  let writable = false;
  let replacing = false;
  return create<PhoneState>((set, get) => {
    function enqueueSave(save: SaveGame): Promise<void> {
      const operation = writeQueue.then(() => repository.save(save));
      writeQueue = operation.then(
        () => { set({ storageError: null }); },
        () => { set({ storageError: 'Não foi possível salvar neste navegador. Exporte seu progresso antes de sair.' }); },
      );
      return operation;
    }
    function change(patch: Partial<SaveGame>) {
      if (replacing || !get().hydrated) return;
      set({ ...patch, updatedAt: new Date().toISOString() });
      if (writable && get().hydrated) void enqueueSave(snapshot(get())).catch(() => undefined);
    }
    return {
      ...initialSave(), hydrated: false, storageError: null,
      hydrate() {
        if (!hydration) hydration = (async () => {
          try {
            const saved = await repository.load();
            const restored = saved ?? initialSave();
            const events = narrativePatch(restored);
            writable = true;
            set({ ...restored, ...events, hydrated: true, storageError: null });
            if (saved && events.consumedEvents.length !== saved.consumedEvents.length) {
              void enqueueSave(snapshot(get())).catch(() => undefined);
            }
          } catch (error) {
            // Never autosave defaults over an unreadable or unsupported existing save.
            writable = false;
            set({ hydrated: true, storageError: error instanceof Error ? error.message : 'O progresso não pôde ser lido. Exporte ou reinicie para continuar.' });
          }
        })();
        return hydration;
      },
      startGame() { change({ started: true }); },
      unlock(code) {
        if (code !== '1708' || replacing || !get().hydrated) return false;
        change({ unlocked: true, started: true });
        return true;
      },
      lock() { change({ unlocked: false }); },
      home() { change({ activeApp: null }); },
      openApp(app, recordId) {
        if (!get().unlocked) return;
        const state = get();
        const appRecords = { ...state.appRecords };
        if (recordId === '') delete appRecords[app];
        else if (recordId !== undefined && isValidAppRecord(app, recordId)) appRecords[app] = recordId;
        change({ activeApp: app, openedApps: [...state.openedApps.filter((id) => id !== app), app],
          appRecords });
      },
      closeApp(app) { change({ openedApps: get().openedApps.filter((id) => id !== app), activeApp: get().activeApp === app ? null : get().activeApp }); },
      setPreference(key, value) {
        if (key === 'brightness' && (typeof value !== 'number' || value < 0.3 || value > 1 || !Number.isFinite(value))) return;
        if (key === 'volume' && (typeof value !== 'number' || value < 0 || value > 1 || !Number.isFinite(value))) return;
        const preferences = { ...get().preferences, [key]: value };
        change({ preferences, ...narrativePatch({ ...get(), preferences }) });
      },
      setPlayerNotes(text) { change({ playerNotes: text.slice(0, 50_000) }); },
      discoverEvidence(id) {
        const state = get();
        if (state.discoveredEvidence.includes(id) || !evidence.some((item) => item.id === id)) return;
        const discoveredEvidence = [...state.discoveredEvidence, id];
        change({ discoveredEvidence, ...narrativePatch({ ...state, discoveredEvidence }) });
      },
      dismissNotification(id) { change({ notifications: get().notifications.filter((item) => item.id !== id) }); },
      async resetGame() {
        await get().hydrate();
        if (replacing) throw new Error('Outra operação de progresso está em andamento.');
        replacing = true;
        try {
          await writeQueue;
          const fresh = initialSave();
          await repository.save(fresh);
          writable = true;
          set({ ...fresh, hydrated: true, storageError: null });
        } catch { set({ storageError: 'Não foi possível reiniciar o progresso. O estado atual foi preservado.' }); throw new Error('Falha ao reiniciar.'); }
        finally { replacing = false; }
      },
      exportSave() { return JSON.stringify(snapshot(get()), null, 2); },
      async importSave(text) {
        // Validate before mutation or disk access. A malformed file leaves the current run intact.
        const save = parseSaveFile(text);
        await get().hydrate();
        if (replacing) throw new Error('Outra operação de progresso está em andamento.');
        replacing = true;
        try {
          await writeQueue;
          const restored = { ...save, ...narrativePatch(save) };
          await repository.save(restored);
          writable = true;
          set({ ...restored, hydrated: true, storageError: null });
        } catch { set({ storageError: 'Não foi possível importar o progresso. A investigação atual foi preservada.' }); throw new Error('Falha ao salvar o progresso importado.'); }
        finally { replacing = false; }
      },
      async flushSave() { await writeQueue; },
    };
  });
}

export const usePhoneStore = createPhoneStore();
