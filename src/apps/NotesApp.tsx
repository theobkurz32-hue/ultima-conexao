import { useState } from 'react';
import { ChevronRight, NotebookPen } from 'lucide-react';
import { notes } from '../story/data';
import { usePhoneStore } from '../core/store';
import { formatDate } from '../utils/time';
import { AppHeader, EvidenceButton, SearchField, EmptyState } from './shared';
export default function NotesApp() {
  const [query, setQuery] = useState('');
  const record = usePhoneStore(state => state.appRecords.notes);
  const playerNotes = usePhoneStore(state => state.playerNotes);
  const setNotes = usePhoneStore(state => state.setPlayerNotes);
  const open = usePhoneStore(state => state.openApp);
  const note = notes.find(item => item.id === record);
  if (record === 'player') return <div className="app-view notes-app"><AppHeader title="Meu caderno" back={() => open('notes', '')} /><div className="app-scroll note-page"><p className="app-caption">SUAS ANOTAÇÕES · SALVAS NESTE DISPOSITIVO</p><textarea aria-label="Anotações da investigação" className="player-notes" value={playerNotes} onChange={event => setNotes(event.target.value)} placeholder="Uma hipótese, um horário, uma pergunta…" maxLength={20000} /></div></div>;
  if (note) return <div className="app-view notes-app"><AppHeader title={note.title} back={() => open('notes', '')} /><div className="app-scroll note-page"><p className="note-date">{formatDate(note.timestamp)} · Arquivo de Helena</p><div className="note-body">{note.body}</div><EvidenceButton id={note.evidenceId} /></div></div>;
  const filtered = notes.filter(item => `${item.title} ${item.body}`.toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR')));
  return <div className="app-view notes-app"><AppHeader title="Notas" eyebrow="NO MEU TELEFONE"><NotebookPen size={23} /></AppHeader><div className="app-scroll"><SearchField value={query} onChange={setQuery} placeholder="Buscar nas notas" /><button className="personal-note" onClick={() => open('notes', 'player')}><NotebookPen size={20} /><span><strong>Meu caderno de investigação</strong><small>{playerNotes ? 'Continuar escrevendo' : 'Criar uma anotação pessoal'}</small></span><ChevronRight size={16} /></button><div className="rounded-list">{filtered.map(item => <button className="list-row note-row" key={item.id} onClick={() => open('notes', item.id)}><span className="row-body"><strong>{item.title}</strong><span className="row-preview">{item.body}</span><small>{formatDate(item.timestamp)}</small></span><ChevronRight size={16} /></button>)}</div>{!filtered.length && <EmptyState>Nenhuma nota encontrada.</EmptyState>}</div></div>;
}
