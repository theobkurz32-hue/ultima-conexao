export const STORY_TIME = '2026-11-13T21:41:00-03:00';
export const STORY_ZONE = 'America/Sao_Paulo';
export function formatTime(instant: string) {
  return new Intl.DateTimeFormat('pt-BR', { timeZone: STORY_ZONE, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(instant));
}
export function formatDate(instant: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('pt-BR', { timeZone: STORY_ZONE, day: 'numeric', month: 'long', ...options }).format(new Date(instant));
}
