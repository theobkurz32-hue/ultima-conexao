import { useEffect, useRef, useState } from 'react';
import { Signal, Wifi, Plane, BatteryFull, Layers2, LockKeyhole, Bell, SlidersHorizontal } from 'lucide-react';
import { usePhoneStore } from '../core/store';
import { AppRouter } from '../apps/AppRouter';
import { HomeScreen } from './HomeScreen';
import { LockScreen } from './LockScreen';
import { SystemPanels } from './SystemPanels';
import type { SystemPanel } from './SystemPanels';
import { formatTime } from '../utils/time';

export function PhoneShell({ onInfo }: { onInfo: () => void }) {
  const hydrated = usePhoneStore(state => state.hydrated);
  const unlocked = usePhoneStore(state => state.unlocked);
  const activeApp = usePhoneStore(state => state.activeApp);
  const openedApps = usePhoneStore(state => state.openedApps);
  const preferences = usePhoneStore(state => state.preferences);
  const home = usePhoneStore(state => state.home);
  const lock = usePhoneStore(state => state.lock);
  const time = usePhoneStore(state => state.virtualTime);
  const [panel, setPanel] = useState<SystemPanel>(null);
  const start = useRef<{ x: number; y: number; at: number } | null>(null);
  const held = useRef(false);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const keyHandler = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || document.querySelector('dialog[open]') || (event.target instanceof Element && event.target.closest('[role="dialog"]'))) return;
      if (panel) setPanel(null); else if (unlocked) home();
    };
    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [panel, unlocked, home]);
  useEffect(() => () => { if (holdTimer.current) clearTimeout(holdTimer.current); }, []);
  const isIOSStandalone = /iPad|iPhone|iPod/.test(navigator.userAgent) && (window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone);
  return <div className={`phone-frame ${isIOSStandalone ? 'ios-standalone' : ''}`}><div className={`phone-screen wallpaper-${preferences.wallpaper} ${!unlocked ? 'is-locked' : ''}`} data-theme={preferences.dark ? 'dark' : 'light'}>
    <div className="phone-wallpaper" />
    <div className={`statusbar ${activeApp && unlocked && !panel ? 'status-in-app' : ''}`}>
      <button aria-label="Abrir notificações" disabled={!unlocked} onClick={() => setPanel(panel === 'notifications' ? null : 'notifications')}>{formatTime(time)}</button>
      <div className="island" aria-hidden="true"><i /></div>
      <button className="status-connectivity" aria-label="Abrir central de controle" disabled={!unlocked} onClick={() => setPanel(panel === 'control' ? null : 'control')}>
        {preferences.airplane ? <Plane size={13} /> : <Signal size={15} fill="currentColor" />}{preferences.wifi ? <Wifi size={14} /> : null}<BatteryFull size={24} />
      </button>
    </div>
    <main className="phone-content" aria-label="Telefone de Helena Leal">
      {!hydrated ? <div className="phone-loading"><LockKeyhole size={27} /><p>Recuperando o telefone…</p></div> : <>
        <div className="phone-home-layer" hidden={!unlocked || activeApp !== null} inert={panel !== null}><HomeScreen /></div>
        {openedApps.map(app => <div key={app} className="phone-app-layer" hidden={!unlocked || activeApp !== app} inert={panel !== null}><AppRouter app={app} /></div>)}
        {!unlocked ? <LockScreen onInfo={onInfo} /> : null}
        {unlocked ? <SystemPanels panel={panel} close={() => setPanel(null)} /> : null}
      </>}
    </main>
    <div className={`gesture-bar ${unlocked && activeApp && !panel ? 'gesture-on-app' : ''}`}>
      {unlocked ? <>
        <button className="recent-button" onClick={() => setPanel(panel === 'recents' ? null : 'recents')} aria-label="Aplicativos recentes"><Layers2 size={16} /></button>
        {isIOSStandalone ? <button className="standalone-notifications-button" onClick={() => setPanel(panel === 'notifications' ? null : 'notifications')} aria-label="Abrir notificações"><Bell size={17} /></button> : null}
        <button className="home-indicator" aria-label="Tela inicial" title="Tela inicial · segure para apps recentes" onPointerDown={event => {
          event.currentTarget.setPointerCapture(event.pointerId); held.current = false;
          start.current = { x: event.clientX, y: event.clientY, at: Date.now() };
          holdTimer.current = setTimeout(() => { held.current = true; setPanel('recents'); }, 500);
        }} onPointerMove={event => {
          if (start.current && start.current.y - event.clientY > 35) { if (holdTimer.current) clearTimeout(holdTimer.current); held.current = true; home(); setPanel(null); }
        }} onPointerUp={() => { if (holdTimer.current) clearTimeout(holdTimer.current); if (!held.current) { home(); setPanel(null); } start.current = null; }} onPointerCancel={() => { if (holdTimer.current) clearTimeout(holdTimer.current); start.current = null; }} onClick={event => { if (event.detail === 0) { home(); setPanel(null); } }}><i /></button>
        {isIOSStandalone ? <button className="standalone-control-button" onClick={() => setPanel(panel === 'control' ? null : 'control')} aria-label="Abrir central de controle"><SlidersHorizontal size={17} /></button> : null}
        <button className="lock-phone-button" onClick={() => { lock(); setPanel(null); }} aria-label="Bloquear telefone"><LockKeyhole size={14} /></button>
      </> : <span className="locked-home-indicator" />}
    </div>
    <div className="brightness-shade" style={{ opacity: 1 - preferences.brightness }} aria-hidden="true" />
  </div></div>;
}
