import Dexie, { type EntityTable } from 'dexie';
import type { SaveGame } from '../core/types';
import { parseSave } from './schema';

/** Implement this boundary to add optional authenticated sync without changing the phone. */
export interface SaveRepository {
  load(): Promise<SaveGame | undefined>;
  save(save: SaveGame): Promise<void>;
  clear(): Promise<void>;
}

export class PhoneDatabase extends Dexie {
  saves!: EntityTable<SaveGame, 'id'>;
  constructor(name = 'ultima-conexao') {
    super(name);
    // The first public schema. Future upgrades must add .version(n).upgrade(...).
    this.version(1).stores({ saves: '&id, updatedAt' });
  }
}

export function createIndexedDbRepository(database = new PhoneDatabase()): SaveRepository {
  return {
    async load() {
      const record = await database.saves.get('local-main');
      return record === undefined ? undefined : parseSave(record);
    },
    async save(save) { await database.saves.put(parseSave(save)); },
    async clear() { await database.saves.delete('local-main'); },
  };
}

export const saveRepository = createIndexedDbRepository();
