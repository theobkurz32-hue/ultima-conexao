import { useEffect, useState } from 'react';
import { Fingerprint, ArrowUpRight, CircleHelp, ShieldCheck, Download, ChevronRight } from 'lucide-react';
import { usePhoneStore } from './core/store';
import { PhoneShell } from './os/PhoneShell';
import { Modal } from './components/Modal';
import { usePWA } from './hooks/usePWA';

export default function App() {
  const hydrate = usePhoneStore(state => state.hydrate);
  const storageError = usePhoneStore(state => state.storageError);
  const [info, setInfo] = useState<'about' | 'install' | null>(null);
  const { updateAvailable, offlineReady, pwaError, applyUpdate } = usePWA();
  useEffect(() => { void hydrate(); }, [hydrate]);
  return <div className="experience">
    <header className="experience-header"><a className="wordmark" href={import.meta.env.BASE_URL} aria-label="Última Conexão — início"><Fingerprint size={28} strokeWidth={1.3} /><span>ÚLTIMA<br /><b>CONEXÃO</b></span></a><div className="header-meta"><span className="status-dot" /> UMA HISTÓRIA AINDA EM ABERTO</div><button className="about-button" onClick={() => setInfo('about')}>Sobre a experiência <ArrowUpRight size={15} /></button></header>
    <div className="experience-layout">
      <aside className="story-intro"><div className="case-tag"><span /> SANTA AURORA, RS <i>·</i> NOVEMBRO DE 2026</div><h1>Algumas ausências<br />deixam <em>rastros.</em></h1><div className="intro-rule" /><p className="intro-description">Helena Leal desapareceu.<br />O telefone dela, não.</p><p className="intro-detail">Entre conversas interrompidas, memórias e pequenos silêncios, uma vida espera ser reconstruída.</p><div className="case-detail"><span>ÚLTIMA CONEXÃO</span><b>12 nov · 02:14</b><span className="case-line" /><span className="case-pending">SEM RESPOSTA</span></div><div className="intro-instruction"><span>01</span><p>Comece pelo telefone.<br /><b>A mensagem de Marina pode ajudar.</b></p><ChevronRight size={15} /></div></aside>
      <section className="device-stage" aria-label="Experiência interativa"><div className="device-caption"><span className="status-dot" /> DISPOSITIVO RECUPERADO <span>01 / HL</span></div><PhoneShell onInfo={() => setInfo('about')} /><div className="device-bottom-caption"><ShieldCheck size={12} /><span>Progresso salvo neste dispositivo</span><button aria-label="Ajuda e controles" onClick={() => setInfo('about')}><CircleHelp size={14} /></button></div></section>
      <aside className="side-note"><span>UM TELEFONE.</span><span>UMA VIDA.</span><span>O QUE FICOU.</span></aside>
    </div>
    <footer className="experience-footer"><span>UMA EXPERIÊNCIA FICCIONAL DE INVESTIGAÇÃO DIGITAL</span><span>Explore. Observe. Conecte.</span><button onClick={() => setInfo('install')}><Download size={13} /> Leve a investigação com você <ArrowUpRight size={13} /></button></footer>
    {storageError ? <div className="app-warning" role="alert">{storageError}</div> : null}
    {updateAvailable ? <div className="update-banner" role="status">Uma atualização está disponível.<button onClick={() => { void applyUpdate(); }}>Salvar e atualizar</button></div> : null}
    {info === 'about' ? <Modal title="Toda ausência tem uma história." onClose={() => setInfo(null)}><p>Você tem em mãos o telefone de Helena Leal, fotógrafa de 29 anos, desaparecida em Santa Aurora. Explore os registros no seu ritmo.</p><p>Para desbloquear, leia a mensagem de Marina. No telefone, o traço inferior volta ao início; segure para ver os apps recentes. Há botões para as mesmas ações. No computador, Esc volta à tela inicial.</p><p>Esta é uma simulação ficcional independente. Nenhuma mensagem ou ligação é real. Câmera, microfone e contas pessoais não são acessados.</p><small>Entrega 0.1 · Fundação navegável com conteúdo inicial. A investigação completa será desenvolvida nas próximas fases.</small><button className="dialog-primary" onClick={() => setInfo(null)}>Voltar ao telefone</button></Modal> : null}
    {info === 'install' ? <Modal title="Sua próxima conexão." onClose={() => setInfo(null)}><p>No iPhone, abra no Safari, toque em Compartilhar e escolha <b>Adicionar à Tela de Início</b>. No Android, use a opção de instalação do navegador.</p><p>{offlineReady ? 'Os recursos desta versão já estão disponíveis offline.' : pwaError || 'O funcionamento offline fica disponível quando o cache de recursos é concluído. Abra uma vez com conexão.'}</p><p>O progresso fica apenas neste navegador e dispositivo. Em Ajustes, você pode exportar uma cópia para transferir ou guardar.</p><button className="dialog-primary" onClick={() => setInfo(null)}>Entendi</button></Modal> : null}
  </div>;
}
