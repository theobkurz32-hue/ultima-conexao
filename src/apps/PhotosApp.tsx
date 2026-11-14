import { useState } from 'react';
import { Heart, Info, MapPin, ZoomIn, ZoomOut } from 'lucide-react';
import { photos, locations } from '../story/data';
import { usePhoneStore } from '../core/store';
import { formatTime, formatDate } from '../utils/time';
import { AppHeader, assetUrl, EvidenceButton, SearchField, EmptyState } from './shared';
export default function PhotosApp() {
  const [query, setQuery] = useState('');
  const [zoomed, setZoomed] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filter, setFilter] = useState('all');
  const selected = usePhoneStore(state => state.appRecords.photos);
  const open = usePhoneStore(state => state.openApp);
  const photo = photos.find(item => item.id === selected);
  if (photo) return <div className="app-view photos-app"><AppHeader title={formatDate(photo.timestamp)} back={() => { setZoomed(false); open('photos', ''); }}><button className="icon-control" aria-label={zoomed ? 'Reduzir imagem' : 'Ampliar imagem'} onClick={() => setZoomed(value => !value)}>{zoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}</button></AppHeader><div className="app-scroll"><div className={`photo-detail ${zoomed ? 'zoomed' : ''}`}><img src={assetUrl(photo.src)} alt={photo.description} /></div><div className="photo-info"><span className="section-eyebrow"><Info size={13} /> INFORMAÇÕES DO ARQUIVO</span><h2>{photo.title}</h2><p>{photo.description}</p><dl><div><dt>Capturada em</dt><dd>{formatDate(photo.timestamp)} · {formatTime(photo.timestamp)}</dd></div><div><dt>Localização</dt><dd><MapPin size={13} /> {locations.find(location => location.id === photo.locationId)?.name}</dd></div><div><dt>Arquivo</dt><dd>Ilustração original · arquivo local</dd></div></dl><EvidenceButton id={photo.evidenceId} /><button className="text-button" onClick={() => setFavorites(items => items.includes(photo.id) ? items.filter(id => id !== photo.id) : [...items, photo.id])}><Heart size={16} fill={favorites.includes(photo.id) ? 'currentColor' : 'none'} />{favorites.includes(photo.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos desta sessão'}</button></div></div></div>;
  const filtered = photos.filter(item => `${item.title} ${item.description} ${locations.find(location => location.id === item.locationId)?.name}`.toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR')) && (filter !== 'favorites' || favorites.includes(item.id)));
  return <div className="app-view photos-app"><AppHeader title="Biblioteca" eyebrow="FOTOGRAFIAS"><span className="header-count">{photos.length}</span></AppHeader><div className="app-scroll"><SearchField value={query} onChange={setQuery} placeholder="Buscar lugar ou lembrança" /><div className="segmented-control"><button className={filter === 'all' ? 'selected' : ''} onClick={() => setFilter('all')}>Todas</button><button className={filter === 'favorites' ? 'selected' : ''} onClick={() => setFilter('favorites')}>Favoritas da sessão</button></div><p className="gallery-month">Memórias de Helena</p><div className="photo-grid">{filtered.map(item => <button key={item.id} onClick={() => open('photos', item.id)} aria-label={`Abrir ${item.title}`}><img src={assetUrl(item.src)} alt={item.description} loading="lazy" /><span>{item.title}</span></button>)}</div>{!filtered.length && <EmptyState>Nenhuma imagem encontrada.</EmptyState>}<p className="app-footnote">{photos.length} lembranças · acervo inicial ilustrado</p></div></div>;
}
