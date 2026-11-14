import { useState } from 'react';
import { ChevronRight, Inbox } from 'lucide-react';
import { emails } from '../story/data';
import { usePhoneStore } from '../core/store';
import { formatTime, formatDate } from '../utils/time';
import { AppHeader, EvidenceButton, SearchField, EmptyState } from './shared';
export default function MailApp() {
  const [query, setQuery] = useState('');
  const record = usePhoneStore(state => state.appRecords.mail);
  const open = usePhoneStore(state => state.openApp);
  const email = emails.find(item => item.id === record);
  if (email) return <div className="app-view mail-app"><AppHeader title={email.subject} back={() => open('mail', '')} /><div className="app-scroll mail-detail"><div className="mail-sender"><span className="mail-avatar">{email.sender.slice(0,1)}</span><div><strong>{email.sender}</strong><small>Para: Helena Leal</small><small>{formatDate(email.timestamp)} · {formatTime(email.timestamp)}</small></div></div><div className="mail-body">{email.body}</div><EvidenceButton id={email.evidenceId} /></div></div>;
  const filtered = emails.filter(item => `${item.subject} ${item.sender} ${item.body}`.toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR')));
  return <div className="app-view mail-app"><AppHeader title="Entrada" eyebrow="E-MAIL"><Inbox size={23} /></AppHeader><div className="app-scroll"><SearchField value={query} onChange={setQuery} placeholder="Buscar nos e-mails" /><div className="mail-list">{filtered.map(item => <button className="list-row mail-row" key={item.id} onClick={() => open('mail', item.id)}><span className="mail-unread" /><span className="row-body"><span className="row-top"><strong>{item.sender}</strong><small>{formatDate(item.timestamp, { month: 'short' })}</small></span><b className="mail-subject">{item.subject}</b><span className="row-preview">{item.body}</span></span><ChevronRight size={13} /></button>)}</div>{!filtered.length && <EmptyState>Nenhum e-mail encontrado.</EmptyState>}<p className="app-footnote">Atualizado em 13 de novembro · {emails.length} mensagens locais</p></div></div>;
}
