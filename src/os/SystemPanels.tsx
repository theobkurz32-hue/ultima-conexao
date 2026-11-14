import { useState } from 'react';
import { X, Wifi, Bluetooth, Plane, Moon, Sun, Volume2, LockKeyhole, Bell, Check, AppWindow } from 'lucide-react';
import { usePhoneStore } from '../core/store';
import { getAppName } from '../core/appRegistry';
import { AppIcon } from '../components/AppIcon';
import { formatTime } from '../utils/time';
import { playInterfaceTone } from '../utils/sound';

export type SystemPanel = 'control' | 'notifications' | 'recents' | null;

export function SystemPanels({ panel, close }: { panel: SystemPanel; close: () => void }) {
  const preferences = usePhoneStore(state => state.preferences);
  const setPreference = usePhoneStore(state => state.setPreference);
  const notifications = usePhoneStore(state => state.notifications);
  const dismissNotification = usePhoneStore(state => state.dismissNotification);
  const openApp = usePhoneStore(state => state.openApp);
  const apps = usePhoneStore(state => state.openedApps);
  const closeApp = usePhoneStore(state => state.closeApp);
  const lock = usePhoneStore(state => state.lock);
  const [soundStatus, setSoundStatus] = useState('');
  if (!panel) return null;
  const title = panel === 'control' ? 'Central de controle' : panel === 'notifications' ? 'Notificações' : 'Apps recentes';
  return <section className={`system-panel panel-${panel}`} aria-label={title}>
    <div className="panel-heading"><div><span className="section-label">ESTE TELEFONE</span><h2>{title}</h2></div><button className="system-close" onClick={close} aria-label="Fechar painel"><X size={22} /></button></div>
    {panel === 'control' ? <>
      <div className="connection-toggles">
        <button className={preferences.airplane ? 'enabled' : ''} aria-pressed={preferences.airplane} onClick={() => setPreference('airplane', !preferences.airplane)}><Plane size={25} /><span>Modo avião</span><small>{preferences.airplane ? 'Ativado' : 'Desativado'}</small></button>
        <button className={preferences.wifi ? 'enabled' : ''} aria-pressed={preferences.wifi} onClick={() => setPreference('wifi', !preferences.wifi)}><Wifi size={25} /><span>Wi-Fi</span><small>{preferences.wifi ? 'Casa de Helena' : 'Desativado'}</small></button>
        <button className={preferences.bluetooth ? 'enabled' : ''} aria-pressed={preferences.bluetooth} onClick={() => setPreference('bluetooth', !preferences.bluetooth)}><Bluetooth size={25} /><span>Bluetooth</span><small>{preferences.bluetooth ? 'Ativado' : 'Desativado'}</small></button>
        <button className={preferences.dark ? 'enabled' : ''} aria-pressed={preferences.dark} onClick={() => setPreference('dark', !preferences.dark)}><Moon size={25} /><span>Aparência</span><small>{preferences.dark ? 'Escura' : 'Clara'}</small></button>
      </div>
      <label className="control-slider"><Sun size={21} /><span>Brilho</span><input aria-label="Brilho da interface" type="range" min="0.3" max="1" step="0.05" value={preferences.brightness} onChange={event => setPreference('brightness', Number(event.target.value))} /></label>
      <label className="control-slider"><Volume2 size={21} /><span>Volume</span><input aria-label="Volume do jogo" type="range" min="0" max="1" step="0.05" value={preferences.volume} onChange={event => setPreference('volume', Number(event.target.value))} /></label>
      <button className="panel-action" onClick={() => setSoundStatus(playInterfaceTone(preferences.volume) ? (preferences.volume ? 'Som de teste reproduzido.' : 'Volume silenciado.') : 'Áudio indisponível neste navegador.')}><Volume2 size={17} /> Testar som</button><p role="status" className="system-note">{soundStatus}</p>
      <button className="panel-action" onClick={() => { lock(); close(); }}><LockKeyhole size={17} /> Bloquear telefone</button>
      <p className="system-note">Conectividade e brilho são simulados. Estes controles afetam somente o jogo.</p>
    </> : null}
    {panel === 'notifications' ? <div className="notification-list">{notifications.length === 0 ? <div className="system-empty"><Bell size={36} strokeWidth={1} /><h3>Tudo em dia.</h3><p>Nenhuma notificação por aqui.</p></div> : notifications.map(item => <article className="panel-notification" key={item.id}><button onClick={() => { openApp(item.app, item.recordId); close(); }}><AppIcon app={item.app} small /><span><small>{getAppName(item.app)} · {formatTime(item.timestamp)}</small><b>{item.title}</b><span>{item.body}</span></span></button><button aria-label={`Dispensar notificação de ${item.title}`} className="dismiss-notification" onClick={() => dismissNotification(item.id)}><Check size={16} /></button></article>)}</div> : null}
    {panel === 'recents' ? <div className="recent-list">{apps.length === 0 ? <div className="system-empty"><AppWindow size={36} strokeWidth={1} /><h3>Seu ponto de partida.</h3><p>Os aplicativos que você abrir aparecerão aqui.</p></div> : [...apps].reverse().map(app => <article className="recent-card" key={app}><button className="recent-open" onClick={() => { openApp(app); close(); }}><AppIcon app={app} /><b>{getAppName(app)}</b><span>Continuar de onde parou</span><div className="recent-preview"><i /><i /><i /><small>Estado preservado</small></div></button><button className="recent-close" onClick={() => closeApp(app)} aria-label={`Fechar ${getAppName(app)}`}><X size={17} /></button></article>)}</div> : null}
  </section>;
}
