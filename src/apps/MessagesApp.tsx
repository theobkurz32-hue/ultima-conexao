import { useEffect, useRef, useState } from 'react';
import { ChevronRight, Pin, LockKeyhole } from 'lucide-react';
import { characters, conversations, storyEvents } from '../story/data';
import { usePhoneStore } from '../core/store';
import { formatTime, formatDate } from '../utils/time';
import { AppHeader, Avatar, SearchField, EmptyState, EvidenceButton } from './shared';
export default function MessagesApp() {
  const [query, setQuery] = useState('');
  const record = usePhoneStore(state => state.appRecords.messages);
  const open = usePhoneStore(state => state.openApp);
  const consumedEvents = usePhoneStore(state => state.consumedEvents);
  const scroll = useRef<HTMLDivElement>(null);
  const conversation = conversations.find(item => item.id === record || item.messages.some(message => message.id === record));
  useEffect(() => {
    const container = scroll.current;
    if (!container || !conversation) return;
    const frame = requestAnimationFrame(() => {
      const target = record ? document.getElementById(record) : null;
      if (target && container.contains(target)) container.scrollTop = target.offsetTop - container.offsetTop - 20;
      else container.scrollTop = container.scrollHeight;
    });
    return () => cancelAnimationFrame(frame);
  }, [record, conversation, consumedEvents]);
  if (conversation) {
    const character = characters.find(person => person.id === conversation.characterId)!;
    const incoming = storyEvents.filter(event => consumedEvents.includes(event.id) && event.notification.recordId === conversation.id);
    const messages = [...conversation.messages, ...incoming.map(event => ({ id: `message-${event.id}`, senderId: conversation.characterId, text: event.notification.body, timestamp: event.notification.timestamp, evidenceId: undefined }))];
    return <div className="app-view messages-app"><AppHeader title={character.name} back={() => open('messages', '')}><Avatar character={character} small /></AppHeader><div className="conversation-meta"><LockKeyhole size={12} /> Conversa armazenada neste aparelho</div><div ref={scroll} className="app-scroll conversation-scroll">{messages.map((message, index) => <div key={message.id} id={message.id} className="message-record">{(index === 0 || message.timestamp.slice(0,10) !== messages[index - 1].timestamp.slice(0,10)) && <p className="message-date">{formatDate(message.timestamp)}</p>}<div className={`message-bubble ${message.senderId === 'helena' ? 'sent' : 'received'}`}><p>{message.text}</p><span className="message-time">{formatTime(message.timestamp)} {message.senderId === 'helena' && '✓✓'}</span></div><div className={message.senderId === 'helena' ? 'sent-action' : ''}><EvidenceButton id={message.evidenceId} /></div></div>)}<p className="app-footnote">Histórico recuperado · respostas serão habilitadas pela narrativa.</p></div></div>;
  }
  const filtered = conversations.filter(item => `${characters.find(person => person.id === item.characterId)?.name} ${item.messages.map(message => message.text).join(' ')}`.toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR')));
  return <div className="app-view messages-app"><AppHeader title="Conversas" eyebrow="MENSAGENS"><span className="header-count">{conversations.length}</span></AppHeader><div className="app-scroll"><SearchField value={query} onChange={setQuery} placeholder="Buscar contato ou mensagem" /><div className="conversations-list">{filtered.map(item => { const character = characters.find(person => person.id === item.characterId)!; const latest = item.messages.at(-1)!; return <button className="list-row conversation-row" key={item.id} onClick={() => open('messages', item.id)}><Avatar character={character} /><span className="row-body"><span className="row-top"><strong>{character.name}</strong><time>{formatTime(latest.timestamp)}</time></span><span className="row-preview">{latest.text}</span></span><span className="row-meta">{item.pinned && <Pin size={12} />}{item.unread > 0 && <span className="unread-dot">{item.unread}</span>}<ChevronRight size={13} /></span></button>; })}</div>{!filtered.length && <EmptyState>Nenhuma conversa encontrada.</EmptyState>}<p className="app-footnote">Somente neste telefone. Nenhuma mensagem é enviada.</p></div></div>;
}
