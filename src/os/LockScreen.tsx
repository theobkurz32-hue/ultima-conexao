import { useState, useRef } from 'react';
import { LockKeyhole, ArrowUp, Delete, ChevronLeft, Flashlight, Info } from 'lucide-react';
import { usePhoneStore } from '../core/store';
import { formatTime, formatDate } from '../utils/time';
import { AppIcon } from '../components/AppIcon';

export function LockScreen({ onInfo }: { onInfo: () => void }) {
  const time = usePhoneStore(state => state.virtualTime);
  const notifications = usePhoneStore(state => state.notifications);
  const unlock = usePhoneStore(state => state.unlock);
  const [auth, setAuth] = useState(false);
  const [code, setCode] = useState('');
  const [wrong, setWrong] = useState(false);
  const [torch, setTorch] = useState(false);
  const [showClue, setShowClue] = useState(false);
  const start = useRef(0);
  const enter = (digit: string) => {
    setWrong(false);
    const next = code + digit;
    if (next.length === 4) { if (!unlock(next)) { setCode(''); setWrong(true); } } else setCode(next);
  };
  const clue = notifications.find(item => item.id === 'marina-lock') ?? notifications[0];
  return <div className={`lock-screen ${auth ? 'auth-open' : ''} ${torch ? 'torch-on' : ''}`} onPointerDown={event => { start.current = event.clientY; }} onPointerUp={event => { if (!auth && start.current - event.clientY > 65) setAuth(true); }}>
    {!auth ? <>
      <div className="lock-heading"><LockKeyhole size={23} strokeWidth={1.7} /><p>{formatDate(time, { weekday: 'long', day: 'numeric', month: 'long' })}</p><h2>{formatTime(time)}</h2><span className="lock-owner">HELENA LEAL</span></div>
      <div className="lock-bottom">
        <div className="lock-focus"><span /> Não perturbe</div>
        {clue ? <button className="lock-notification" onClick={() => { setShowClue(true); setAuth(true); }}><AppIcon app="messages" small /><span><span className="notification-meta">MENSAGENS <small>agora</small></span><b>{clue.title}</b><span className="notification-body">{clue.body}</span></span></button> : null}
        <button className="unlock-button" onClick={() => setAuth(true)}><LockKeyhole size={13} /> Toque para desbloquear <ArrowUp size={14} /></button>
        <div className="lock-shortcuts"><button aria-label={torch ? 'Desligar lanterna simulada' : 'Ligar lanterna simulada'} aria-pressed={torch} onClick={() => setTorch(!torch)}><Flashlight size={20} /></button><span>SIMULAÇÃO FICCIONAL</span><button aria-label="Sobre a experiência" onClick={onInfo}><Info size={20} /></button></div>
      </div>
    </> : <div className="passcode-screen">
      <button className="passcode-back" onClick={() => { setAuth(false); setCode(''); setWrong(false); }}><ChevronLeft size={18} /> Voltar</button>
      <LockKeyhole size={26} strokeWidth={1.5} /><h2>Digite o código</h2><p>Este telefone pertence a Helena.</p>
      <div className={`passcode-dots ${wrong ? 'code-error' : ''}`} aria-label={`${code.length} de 4 dígitos inseridos`}>{[0, 1, 2, 3].map(i => <i key={i} className={i < code.length ? 'filled' : ''} />)}</div>
      <p className="passcode-feedback" role="status">{wrong ? 'Código incorreto. Confira a mensagem de Marina.' : ' '}</p>
      <div className="keypad">{['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'delete'].map((digit, i) => digit ? <button key={digit} aria-label={digit === 'delete' ? 'Apagar dígito' : digit} className={digit === 'delete' ? 'delete-digit' : ''} onClick={() => digit === 'delete' ? setCode(code.slice(0, -1)) : enter(digit)}>{digit === 'delete' ? <Delete size={23} /> : <><span>{digit}</span><small>{['', '', 'ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQRS', 'TUV', 'WXYZ'][Number(digit)]}</small></>}</button> : <span key={`space-${i}`} />)}</div>
      <button className="clue-toggle" onClick={() => setShowClue(!showClue)}>{showClue ? 'Ocultar mensagem' : 'Ler mensagem de Marina'}</button>
      {showClue ? <div className="passcode-clue"><b>Marina Leal</b><p>{clue?.body ?? 'O código ainda é o aniversário dela. 17 de agosto.'}</p><small>Quatro dígitos: dia e mês.</small></div> : null}
    </div>}
  </div>;
}
