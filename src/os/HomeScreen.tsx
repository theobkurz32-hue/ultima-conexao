import { useState, useRef } from 'react';
import { CloudMoon, Search, ChevronRight, MapPin } from 'lucide-react';
import { usePhoneStore } from '../core/store';
import { appRegistry } from '../core/appRegistry';
import { AppIcon } from '../components/AppIcon';
import type { AppId } from '../core/types';

function HomeApp({ app, dock = false }: { app: AppId; dock?: boolean }) {
  const openApp = usePhoneStore(state => state.openApp);
  const count = usePhoneStore(state => state.notifications.filter(item => item.app === app).length);
  return <button className={`home-app ${dock ? 'dock-app' : ''}`} onClick={() => openApp(app)} aria-label={`Abrir ${appRegistry.find(item => item.id === app)!.name}`}>
    <span className="icon-wrap"><AppIcon app={app} />{count > 0 ? <span className="app-badge">{count}</span> : null}</span>
    {!dock ? <span>{appRegistry.find(item => item.id === app)!.name}</span> : null}
  </button>;
}

export function HomeScreen() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState<string | null>(null);
  const openApp = usePhoneStore(state => state.openApp);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const visibleApps = page === 0 ? appRegistry.filter(app => app.id !== 'phone') : appRegistry.filter(app => ['phone', 'notes', 'maps', 'settings'].includes(app.id));
  return <div className="home-screen" onPointerDown={event => { touchStart.current = { x: event.clientX, y: event.clientY }; }} onPointerUp={event => {
    const start = touchStart.current;
    if (start && Math.abs(event.clientX - start.x) > 65 && Math.abs(event.clientY - start.y) < 35) setPage(event.clientX < start.x ? 1 : 0);
    touchStart.current = null;
  }}>
    <div className="home-widgets">
      <button className="weather-widget" onClick={() => openApp('maps')} aria-label="Ver Santa Aurora no mapa">
        <span className="widget-city">Santa Aurora <MapPin size={10} /></span><span className="weather-number">16°</span>
        <span className="weather-description"><CloudMoon size={18} /> Nuvens esparsas</span><span className="weather-range">Máx. 18° · Mín. 13°</span>
      </button>
      <button className="date-widget" onClick={() => openApp('calendar')} aria-label="Abrir calendário de 13 de novembro">
        <span className="widget-day">SEXTA-FEIRA</span><span className="widget-date">13</span><span className="widget-month">novembro</span><span className="widget-event"><i /> Nenhum evento hoje</span>
      </button>
    </div>
    <div className="home-app-grid" aria-label={`Página ${page + 1} dos aplicativos`}>
      {visibleApps.map(app => <HomeApp key={app.id} app={app.id} />)}
    </div>
    {page === 1 ? <div className="home-memory"><p>O mar sempre devolve<br />alguma coisa.</p><span>NOTA DE HELENA · 9 NOV</span><button onClick={() => openApp('notes')}>Abrir notas <ChevronRight size={14} /></button></div> : null}
    <div className="home-spacer" />
    <div className="home-pagination" aria-label="Páginas da tela inicial">{[0, 1].map(index => <button key={index} aria-label={`Página ${index + 1}`} aria-pressed={page === index} onClick={() => setPage(index)}><i className={page === index ? 'current' : ''} /></button>)}</div>
    <button className="home-search" onClick={() => setSearch('')}><Search size={13} /> Buscar</button>
    <div className="dock"><HomeApp app="phone" dock /><HomeApp app="messages" dock /><HomeApp app="photos" dock /><HomeApp app="mail" dock /></div>
    {search !== null ? <div className="search-overlay"><div className="search-input"><Search size={18} /><input autoFocus aria-label="Buscar aplicativos" placeholder="Buscar aplicativos" value={search} onChange={event => setSearch(event.target.value)} /><button onClick={() => setSearch(null)}>Cancelar</button></div>
      <p className="section-label">APLICATIVOS</p>{appRegistry.filter(app => `${app.name} ${app.subtitle}`.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR'))).map(app => <button className="search-result" key={app.id} onClick={() => { openApp(app.id); setSearch(null); }}><AppIcon app={app.id} small /><span><b>{app.name}</b><small>{app.subtitle}</small></span><ChevronRight size={16} /></button>)}
      <p className="search-note">A busca nesta entrega encontra aplicativos. Pesquise os registros dentro de cada app.</p>
    </div> : null}
  </div>;
}
