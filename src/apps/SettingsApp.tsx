import { useRef, useState } from 'react';
import { Bluetooth, Download, FileUp, Info, LockKeyhole, Moon, Plane, RotateCcw, ShieldCheck, Sun, Volume2, Wifi } from 'lucide-react';
import { usePhoneStore } from '../core/store';
import type { Preferences } from '../core/types';

const toggleItems = [
  { key: 'airplane', title: 'Modo avião', Icon: Plane, color: '#d99754' },
  { key: 'wifi', title: 'Wi-Fi', Icon: Wifi, color: '#508bcd' },
  { key: 'bluetooth', title: 'Bluetooth', Icon: Bluetooth, color: '#508bcd' },
  { key: 'dark', title: 'Aparência escura', Icon: Moon, color: '#53576e' },
] as const;

export default function SettingsApp() {
  const preferences = usePhoneStore(s => s.preferences);
  const setPreference = usePhoneStore(s => s.setPreference);
  const exportSave = usePhoneStore(s => s.exportSave);
  const importSave = usePhoneStore(s => s.importSave);
  const resetGame = usePhoneStore(s => s.resetGame);
  const lock = usePhoneStore(s => s.lock);
  const storageError = usePhoneStore(s => s.storageError);
  const [status, setStatus] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const resetDialog = useRef<HTMLDivElement>(null);

  async function downloadSave() {
    try {
      await usePhoneStore.getState().flushSave();
      const data = await exportSave();
      const url = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'ultima-conexao-progresso.json';
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus('Arquivo de progresso exportado. Guarde uma cópia em um lugar seguro.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Não foi possível exportar o progresso.');
    }
  }

  async function readSave(file?: File) {
    if (!file) return;
    try {
      if (file.size > 1024 * 1024) throw new Error('O arquivo deve ter no máximo 1 MB.');
      await importSave(await file.text());
      setStatus('Progresso importado e validado.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Arquivo de progresso inválido.');
    } finally {
      if (fileInput.current) fileInput.current.value = '';
    }
  }

  function toggle(key: keyof Pick<Preferences, 'airplane' | 'wifi' | 'bluetooth' | 'dark'>) {
    setPreference(key, !preferences[key]);
  }

  return <div className="app-view settings-app">
    <header className="app-header"><p className="app-caption">SEU TELEFONE</p><h1>Ajustes</h1></header>
    <div className="app-scroll">
      <div className="settings-profile"><div className="avatar" style={{ background: '#d8e3db', color: '#486f60' }}>HL</div><div><strong>Helena Leal</strong><p className="subtle">Este aparelho • Santa Aurora</p></div></div>
      <section className="settings-group" aria-label="Conectividade e aparência">
        {toggleItems.map(({ key, title, Icon, color }) => <div className="settings-row" key={key}>
          <span className="settings-icon" style={{ background: color }}><Icon size={17} /></span>
          <span>{title}</span>
          <button className={`switch ${preferences[key] ? 'is-on' : ''}`} role="switch" aria-checked={preferences[key]} aria-label={title} onClick={() => toggle(key)}><span /></button>
        </div>)}
      </section>
      <p className="app-footnote">As conexões acima pertencem à simulação. O modo avião pausa a entrega de novos avisos narrativos.</p>
      <section className="settings-group range-group" aria-label="Tela e som">
        <label className="settings-slider"><span><Sun size={19} /> Brilho da tela</span><input aria-label="Brilho da tela" type="range" min="0.4" max="1" step="0.05" value={preferences.brightness} onChange={event => setPreference('brightness', Number(event.target.value))} /></label>
        <label className="settings-slider"><span><Volume2 size={19} /> Volume do jogo</span><input aria-label="Volume do jogo" type="range" min="0" max="1" step="0.05" value={preferences.volume} onChange={event => setPreference('volume', Number(event.target.value))} /></label>
        <label className="settings-row"><span>Papel de parede</span><select aria-label="Papel de parede" value={preferences.wallpaper} onChange={event => setPreference('wallpaper', event.target.value as Preferences['wallpaper'])}><option value="coast">Costa de Santa Aurora</option><option value="dusk">Depois do pôr do sol</option></select></label>
      </section>
      <h2 className="settings-section-label">PROGRESSO LOCAL</h2>
      <section className="settings-group">
        <button className="settings-row" onClick={() => void downloadSave()}><Download size={19} /><span>Exportar progresso</span></button>
        <button className="settings-row" onClick={() => fileInput.current?.click()}><FileUp size={19} /><span>Importar progresso</span></button>
        <input ref={fileInput} type="file" accept="application/json,.json" hidden onChange={event => void readSave(event.target.files?.[0])} />
        <button className="settings-row" onClick={lock}><LockKeyhole size={19} /><span>Bloquear telefone</span></button>
        <button className="settings-row danger-button" onClick={() => setConfirmReset(true)}><RotateCcw size={19} /><span>Reiniciar investigação</span></button>
      </section>
      {(status || storageError) && <p className="settings-status" role="status">{status || storageError}</p>}
      <div className="settings-about"><ShieldCheck size={23} /><p>O progresso fica neste navegador. A exportação cria uma cópia; não há sincronização entre aparelhos.</p></div>
      <div className="settings-about"><Info size={23} /><p>ÚLTIMA CONEXÃO · versão 0.1.0<br />Uma simulação ficcional independente. Pessoas, mensagens e lugares são fictícios.</p></div>
    </div>
    {confirmReset && <div className="app-modal-backdrop"><div ref={resetDialog} className="app-confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="reset-title" onKeyDown={event => {
      if (event.key === 'Escape') setConfirmReset(false);
      if (event.key === 'Tab') {
        const controls = resetDialog.current?.querySelectorAll<HTMLButtonElement>('button');
        if (!controls?.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    }}><h2 id="reset-title">Começar de novo?</h2><p>As evidências, anotações e configurações deste progresso serão apagadas. Exporte uma cópia antes de continuar.</p><button className="danger-button" onClick={() => void resetGame().then(() => setConfirmReset(false)).catch(error => { setStatus(error instanceof Error ? error.message : 'Não foi possível reiniciar.'); setConfirmReset(false); })}>Apagar e reiniciar</button><button autoFocus onClick={() => setConfirmReset(false)}>Cancelar</button></div></div>}
  </div>;
}
