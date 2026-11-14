import { MessageCircle, NotebookPen, Mail, Map, Phone, Settings, Fingerprint } from 'lucide-react';
import { appRegistry } from '../core/appRegistry';
import type { AppId } from '../core/types';

export function AppIcon({ app, small = false }: { app: AppId; small?: boolean }) {
  const meta = appRegistry.find(item => item.id === app)!;
  const icons = { messages: MessageCircle, notes: NotebookPen, mail: Mail, maps: Map, phone: Phone, settings: Settings, investigation: Fingerprint };
  const Icon = app in icons ? icons[app as keyof typeof icons] : null;
  return <span aria-hidden="true" className={`app-icon icon-${meta.color} ${small ? 'icon-small' : ''}`}>
    {app === 'calendar' ? <span className="calendar-icon"><span>SEX</span><b>13</b></span> : null}
    {app === 'photos' ? <span className="photo-flower">{Array.from({ length: 8 }, (_, i) => <i key={i} style={{ '--petal': i } as React.CSSProperties} />)}</span> : null}
    {Icon ? <Icon size={small ? 19 : 31} strokeWidth={app === 'investigation' ? 1.5 : 1.8} fill={app === 'messages' ? 'white' : 'none'} /> : null}
  </span>;
}
