import type { AppId } from '../core/types';
import { lazy, Suspense } from 'react';
import './apps.css';
const appComponents = {
  messages: lazy(() => import('./MessagesApp')),
  photos: lazy(() => import('./PhotosApp')),
  notes: lazy(() => import('./NotesApp')),
  mail: lazy(() => import('./MailApp')),
  calendar: lazy(() => import('./CalendarApp')),
  maps: lazy(() => import('./MapsApp')),
  phone: lazy(() => import('./PhoneApp')),
  investigation: lazy(() => import('./InvestigationApp')),
  settings: lazy(() => import('./SettingsApp')),
};
export function AppRouter({ app }: { app: AppId }) {
  const Component = appComponents[app];
  return <Suspense fallback={<div className="app-view"><p className="empty-state" role="status">Abrindo aplicativo…</p></div>}><Component /></Suspense>;
}
