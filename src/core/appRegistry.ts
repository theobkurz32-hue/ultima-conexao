import type { AppId } from './types';

export const appRegistry: { id: AppId; name: string; subtitle: string; color: string }[] = [
  { id: 'messages', name: 'Mensagens', subtitle: 'Conversas e conexões', color: 'green' },
  { id: 'photos', name: 'Fotos', subtitle: 'Memórias de Helena', color: 'photos' },
  { id: 'calendar', name: 'Calendário', subtitle: 'Compromissos e datas', color: 'calendar' },
  { id: 'notes', name: 'Notas', subtitle: 'Ideias e pequenas coisas', color: 'yellow' },
  { id: 'mail', name: 'E-mail', subtitle: 'A vida na caixa de entrada', color: 'blue' },
  { id: 'maps', name: 'Mapas', subtitle: 'Pelos caminhos de Santa Aurora', color: 'maps' },
  { id: 'investigation', name: 'Investigação', subtitle: 'Um lugar para conectar os fatos', color: 'ink' },
  { id: 'settings', name: 'Ajustes', subtitle: 'Este telefone', color: 'gray' },
  { id: 'phone', name: 'Telefone', subtitle: 'Contatos e ligações', color: 'green' },
];
export const getAppName = (app: AppId) => appRegistry.find(item => item.id === app)?.name ?? app;
