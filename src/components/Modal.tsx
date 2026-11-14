import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const dialog = ref.current;
    dialog?.showModal();
    return () => { dialog?.close(); previous?.focus(); };
  }, []);
  return <dialog ref={ref} className="info-dialog" onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <button className="modal-close" onClick={onClose} aria-label="Fechar"><X size={20} /></button>
    <p className="eyebrow">ÚLTIMA CONEXÃO</p><h2>{title}</h2>{children}
  </dialog>;
}
