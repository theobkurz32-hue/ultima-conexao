import { ArrowLeft, Bookmark, Check, Search } from 'lucide-react';
import type { ReactNode } from 'react';
import { usePhoneStore } from '../core/store';
import type { Character } from '../core/types';
export function AppHeader({ title, eyebrow, back, children }: { title: string; eyebrow?: string; back?: () => void; children?: ReactNode }) {
  return <header className="app-header">{back && <button className="app-back" onClick={back}><ArrowLeft size={18} /> Voltar</button>}{eyebrow && <p className="app-caption">{eyebrow}</p>}<div className="app-title-row"><h1>{title}</h1>{children}</div></header>;
}
export function SearchField({ value, onChange, placeholder = 'Buscar' }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <label className="app-search"><Search size={17} /><input aria-label={placeholder} value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} type="search" /></label>;
}
export function Avatar({ character, small }: { character: Character; small?: boolean }) {
  return <span className={`avatar ${small ? 'small' : ''}`} style={{ backgroundColor: character.color }}>{character.initials}</span>;
}
export function EvidenceButton({ id }: { id?: string }) {
  const found = usePhoneStore(state => id ? state.discoveredEvidence.includes(id) : false);
  const discover = usePhoneStore(state => state.discoverEvidence);
  return id ? <button className={`evidence-button ${found ? 'saved' : ''}`} onClick={() => discover(id)}>{found ? <Check size={14} /> : <Bookmark size={14} />}{found ? 'Registro guardado' : 'Guardar registro'}</button> : null;
}
export function EmptyState({ children }: { children: ReactNode }) { return <p className="empty-state">{children}</p>; }
export function assetUrl(path: string) { return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`; }
