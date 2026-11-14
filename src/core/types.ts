export type AppId = 'messages' | 'photos' | 'notes' | 'mail' | 'calendar' | 'maps' | 'phone' | 'investigation' | 'settings';
export interface Character { id: string; name: string; age: number; initials: string; color: string; role: string; }
export interface Message { id: string; senderId: string; text: string; timestamp: string; evidenceId?: string; }
export interface Conversation { id: string; characterId: string; pinned?: boolean; unread: number; messages: Message[]; }
export interface MediaAsset { id: string; title: string; src: string; timestamp: string; locationId: string; description: string; evidenceId?: string; }
export interface CallRecord { id: string; characterId: string; timestamp: string; direction: 'incoming' | 'outgoing' | 'missed'; duration: number; }
export interface LocationRecord { id: string; name: string; address: string; x: number; y: number; description: string; }
export interface CalendarEvent { id: string; title: string; timestamp: string; locationId?: string; description: string; }
export interface MailRecord { id: string; sender: string; subject: string; timestamp: string; body: string; evidenceId?: string; }
export interface NoteRecord { id: string; title: string; body: string; timestamp: string; evidenceId?: string; }
export type NarrativeCondition = { type: 'evidence'; id: string } | { type: 'event'; id: string } | { type: 'all' | 'any'; conditions: NarrativeCondition[] };
export interface Evidence { id: string; title: string; description: string; sourceApp: AppId; sourceRecordId: string; gameTimestamp: string; relatedCharacters: string[]; relatedLocations: string[]; relatedEvidenceIds: string[]; reliability: 'record' | 'testimony'; importance: 'minor' | 'major'; narrativeTags: string[]; }
export interface Clue { id: string; evidenceIds: string[]; description: string; }
export interface Hypothesis { id: string; title: string; supportingEvidence: string[]; contradictingEvidence: string[]; }
export interface InvestigationEvent { id: string; condition: NarrativeCondition; notification: PhoneNotification; }
export interface StoryChapter { id: string; title: string; condition?: NarrativeCondition; }
export interface PlayerDecision { id: string; option: string; timestamp: string; }
export interface Ending { id: string; title: string; condition: NarrativeCondition; }
export interface PhoneNotification { id: string; app: AppId; title: string; body: string; timestamp: string; recordId?: string; }
export interface Preferences { dark: boolean; brightness: number; volume: number; airplane: boolean; wifi: boolean; bluetooth: boolean; wallpaper: 'coast' | 'dusk'; }
export interface SaveGame {
  schemaVersion: 1; id: string; updatedAt: string; unlocked: boolean; started: boolean;
  virtualTime: string; narrativeTime: string; activeApp: AppId | null;
  openedApps: AppId[]; appRecords: Partial<Record<AppId, string>>;
  discoveredEvidence: string[]; consumedEvents: string[]; notifications: PhoneNotification[];
  playerNotes: string; decisions: PlayerDecision[]; preferences: Preferences;
}
