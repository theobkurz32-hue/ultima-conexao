import { useEffect, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Phone, PhoneMissed, PhoneOff, Search, UserRound } from 'lucide-react';
import { characters, calls } from '../story/data';
import { formatDate, formatTime } from '../utils/time';
import type { Character } from '../core/types';

export default function PhoneApp() {
  const [tab, setTab] = useState<'recents' | 'contacts'>('recents');
  const [query, setQuery] = useState('');
  const [calling, setCalling] = useState<Character | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!calling) return;
    const timer = window.setInterval(() => setElapsed(value => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [calling]);

  function startCall(character: Character) {
    setElapsed(0);
    setCalling(character);
  }

  return <div className="app-view phone-app">
    <header className="app-header"><p className="app-caption">MANTER CONTATO</p><h1>Telefone</h1></header>
    <div className="app-scroll">
      <div className="app-segmented" aria-label="Visualização do telefone"><button aria-pressed={tab === 'recents'} className={tab === 'recents' ? 'selected' : ''} onClick={() => setTab('recents')}>Recentes</button><button aria-pressed={tab === 'contacts'} className={tab === 'contacts' ? 'selected' : ''} onClick={() => setTab('contacts')}>Contatos</button></div>
      <label className="app-search"><Search size={17} /><input aria-label="Buscar contatos" value={query} placeholder="Buscar contatos" onChange={event => setQuery(event.target.value)} /></label>
      {tab === 'recents' ? <div className="phone-call-list">{[...calls].sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp)).filter(call => characters.find(character => character.id === call.characterId)?.name.toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR'))).map(call => {
        const character = characters.find(person => person.id === call.characterId);
        if (!character) return null;
        const Icon = call.direction === 'missed' ? PhoneMissed : call.direction === 'outgoing' ? ArrowUpRight : ArrowDownLeft;
        return <button className={`list-row ${call.direction === 'missed' ? 'missed-call' : ''}`} key={call.id} onClick={() => startCall(character)} aria-label={`Ligar para ${character.name}, chamada ${call.direction === 'missed' ? 'perdida' : call.direction === 'incoming' ? 'recebida' : 'realizada'} em ${formatDate(call.timestamp)} às ${formatTime(call.timestamp)}`}><Icon size={19} /><span className="row-body"><strong>{character.name}</strong><small>{call.direction === 'missed' ? 'Não atendida' : call.direction === 'incoming' ? 'Recebida' : 'Realizada'}{call.duration ? ` · ${Math.floor(call.duration / 60)} min ${call.duration % 60} s` : ''}</small></span><span className="row-meta">{formatDate(call.timestamp, { month: '2-digit', day: '2-digit' })}<small>{formatTime(call.timestamp)}</small></span></button>;
      })}</div> : <div className="phone-contact-list">{characters.filter(character => character.id !== 'helena' && character.name.toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR'))).map(character => <button className="list-row" key={character.id} onClick={() => startCall(character)}><span className="avatar" style={{ background: character.color }}>{character.initials}</span><span className="row-body"><strong>{character.name}</strong><small>{character.role}</small></span><Phone size={18} /></button>)}</div>}
      <p className="app-footnote">Chamadas acontecem somente dentro deste telefone fictício. Nenhuma ligação real é iniciada.</p>
    </div>
    {calling && <div className="call-screen" role="dialog" aria-modal="true" aria-label={`Chamada para ${calling.name}`} onKeyDown={event => { if (event.key === 'Escape') setCalling(null); if (event.key === 'Tab') event.preventDefault(); }}><p className="app-caption">CHAMADA SIMULADA</p><div className="avatar" style={{ background: calling.color }}><UserRound size={44} /></div><h2>{calling.name}</h2><p aria-live="polite">{elapsed < 12 ? 'Chamando…' : 'Sem resposta'}</p><span>{Math.floor(elapsed / 60).toString().padStart(2, '0')}:{(elapsed % 60).toString().padStart(2, '0')}</span><p className="call-note">A pessoa não está disponível neste momento da história.</p><button className="call-end" autoFocus aria-label="Encerrar chamada" onClick={() => setCalling(null)}><PhoneOff size={26} /></button><small>encerrar</small></div>}
  </div>;
}
