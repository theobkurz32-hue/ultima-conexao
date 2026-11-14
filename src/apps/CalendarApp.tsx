import { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, CalendarDays } from 'lucide-react';
import { calendarEvents, locations } from '../story/data';
import { formatTime, formatDate } from '../utils/time';
import { AppHeader, EmptyState } from './shared';
export default function CalendarApp() {
  const [day, setDay] = useState<number | null>(null);
  const [month, setMonth] = useState(10);
  const monthName = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date(2026, month, 1));
  const firstDay = new Date(2026, month, 1).getDay();
  const days = new Date(2026, month + 1, 0).getDate();
  const events = calendarEvents.filter(event => Number(event.timestamp.slice(5,7)) === month + 1 && (!day || Number(event.timestamp.slice(8,10)) === day));
  return <div className="app-view calendar-app"><AppHeader title="Calendário" eyebrow="2026"><CalendarDays size={23} /></AppHeader><div className="app-scroll"><div className="month-navigation"><button aria-label="Mês anterior" onClick={() => { setMonth(value => Math.max(0,value-1)); setDay(null); }} disabled={month === 0}><ChevronLeft size={20} /></button><h2>{monthName}</h2><button aria-label="Próximo mês" onClick={() => { setMonth(value => Math.min(11,value+1)); setDay(null); }} disabled={month === 11}><ChevronRight size={20} /></button></div><div className="calendar-grid">{['D','S','T','Q','Q','S','S'].map((label,index) => <span className="weekday" key={`week-${index}`}>{label}</span>)}{Array.from({ length: firstDay },(_,index) => <span key={`blank-${index}`} />)}{Array.from({ length: days },(_,index) => { const number = index + 1; const hasEvent = calendarEvents.some(event => Number(event.timestamp.slice(5,7)) === month+1 && Number(event.timestamp.slice(8,10)) === number); return <button aria-label={`${number} de ${monthName}${hasEvent ? ', com compromisso' : ''}`} key={number} className={`${day === number ? 'selected' : ''} ${number === 13 && month === 10 ? 'today' : ''}`} onClick={() => setDay(value => value === number ? null : number)}>{number}{hasEvent && <i />}</button>; })}</div><div className="section-heading"><h2>{day ? `${day} de ${monthName}` : 'Compromissos do mês'}</h2>{day && <button className="text-button" onClick={() => setDay(null)}>Ver todos</button>}</div>{events.map(event => <article className="calendar-event" key={event.id}><time>{formatTime(event.timestamp)}</time><div><strong>{event.title}</strong><small>{formatDate(event.timestamp)}</small><p>{event.description}</p>{event.locationId && <small><MapPin size={12} /> {locations.find(location => location.id === event.locationId)?.name}</small>}</div></article>)}{!events.length && <EmptyState>Nenhum compromisso neste período.</EmptyState>}</div></div>;
}
