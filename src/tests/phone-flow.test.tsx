// @vitest-environment jsdom
import 'fake-indexeddb/auto';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PhoneShell } from '../os/PhoneShell';
import { createPhoneStore, usePhoneStore } from '../core/store';
import { saveRepository } from '../database/repository';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
let host: HTMLDivElement;
let root: Root;

function visible(element: Element): boolean { return !element.closest('[hidden]'); }
function button(name: string, scope: ParentNode = host): HTMLButtonElement {
  const found = [...scope.querySelectorAll('button')].find(element => visible(element) && (element.getAttribute('aria-label') ?? element.textContent?.trim()) === name);
  if (!found) throw new Error(`Botão visível não encontrado: ${name}`);
  return found;
}
function buttonContaining(text: string, scope: ParentNode = host): HTMLButtonElement {
  const found = [...scope.querySelectorAll('button')].find(element => visible(element) && element.textContent?.includes(text));
  if (!found) throw new Error(`Botão com texto não encontrado: ${text}`);
  return found;
}
async function click(element: HTMLElement) { await act(async () => { element.click(); }); }
async function waitUntil(check: () => boolean) {
  for (let attempt = 0; attempt < 120; attempt++) {
    if (check()) return;
    await act(async () => { await new Promise(resolve => window.setTimeout(resolve, 10)); });
  }
  throw new Error('A interface não atingiu o estado esperado.');
}
function activeApp() {
  const layer = host.querySelector<HTMLElement>('.phone-app-layer:not([hidden])');
  if (!layer) throw new Error('Nenhum aplicativo visível.');
  return layer;
}
async function unlock() {
  await click(buttonContaining('Toque para desbloquear'));
  for (const digit of '1708') await click(button(digit));
  expect(usePhoneStore.getState().unlocked).toBe(true);
}
async function openApp(name: string, heading: string) {
  await click(button(`Abrir ${name}`));
  await waitUntil(() => activeApp().querySelector('h1')?.textContent === heading);
}
async function goHome() {
  await click(button('Tela inicial'));
  expect(usePhoneStore.getState().activeApp).toBeNull();
  expect(host.querySelector('.phone-home-layer')?.hasAttribute('hidden')).toBe(false);
}

beforeEach(async () => {
  vi.stubGlobal('matchMedia', vi.fn((query: string) => ({ matches: false, media: query, onchange: null, addListener: vi.fn(), removeListener: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn(() => true) })));
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => window.setTimeout(() => callback(performance.now()), 0));
  vi.stubGlobal('cancelAnimationFrame', (id: number) => window.clearTimeout(id));
  await usePhoneStore.getState().hydrate();
  await usePhoneStore.getState().resetGame();
  host = document.createElement('div');
  document.body.append(host);
  await act(async () => { root = createRoot(host); root.render(<PhoneShell onInfo={() => undefined} />); });
});

afterEach(async () => {
  await act(async () => root.unmount());
  await usePhoneStore.getState().flushSave();
  host.remove();
  vi.unstubAllGlobals();
});

describe('telefone renderizado, com estado e IndexedDB reais', () => {
  it('mantém notificações e controles acessíveis no iPhone instalado e preserva o aplicativo ao fechar os painéis', async () => {
    expect(host.querySelector('.standalone-notifications-button')).toBeNull();
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)');
    vi.stubGlobal('matchMedia', vi.fn((query: string) => ({ matches: query === '(display-mode: standalone)', media: query, onchange: null, addListener: vi.fn(), removeListener: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn(() => true) })));
    await act(async () => { root.render(<PhoneShell onInfo={() => undefined} />); });
    expect(host.querySelector('.phone-frame')?.classList.contains('ios-standalone')).toBe(true);
    await unlock();
    await openApp('Mensagens', 'Conversas');
    await click(buttonContaining('Raul Monteiro', activeApp()));
    const conversationId = usePhoneStore.getState().appRecords.messages;
    const notifications = host.querySelector<HTMLButtonElement>('.standalone-notifications-button')!;
    const controls = host.querySelector<HTMLButtonElement>('.standalone-control-button')!;
    expect(notifications.getAttribute('aria-label')).toBe('Abrir notificações');
    expect(controls.getAttribute('aria-label')).toBe('Abrir central de controle');
    await click(notifications);
    expect(host.querySelector('.panel-notifications')).not.toBeNull();
    await click(button('Fechar painel'));
    expect(host.querySelector('.system-panel')).toBeNull();
    expect(activeApp().querySelector('h1')?.textContent).toBe('Raul Monteiro');
    await click(controls);
    expect(host.querySelector('.panel-control')).not.toBeNull();
    await click(button('Fechar painel'));
    expect(host.querySelector('.system-panel')).toBeNull();
    expect(usePhoneStore.getState().appRecords.messages).toBe(conversationId);
    await goHome();
    await openApp('Mensagens', 'Raul Monteiro');
    expect(usePhoneStore.getState().appRecords.messages).toBe(conversationId);
  }, 10000);

  it('rejeita código incorreto e permite abrir os nove aplicativos e voltar para a tela inicial', async () => {
    expect(host.querySelector('.lock-screen')).not.toBeNull();
    await click(buttonContaining('Toque para desbloquear'));
    for (const digit of '1234') await click(button(digit));
    expect(usePhoneStore.getState().unlocked).toBe(false);
    expect(host.querySelector('.passcode-feedback')?.textContent).toContain('Código incorreto');
    for (const digit of '1708') await click(button(digit));
    expect(host.querySelector('.lock-screen')).toBeNull();
    for (const [name, heading] of [['Mensagens','Conversas'], ['Fotos','Biblioteca'], ['Calendário','Calendário'], ['Notas','Notas'], ['E-mail','Entrada'], ['Mapas','Santa Aurora'], ['Investigação','Investigação'], ['Ajustes','Ajustes'], ['Telefone','Telefone']]) {
      await openApp(name, heading);
      await goHome();
    }
    await usePhoneStore.getState().flushSave();
    const saved = await saveRepository.load();
    expect(saved?.unlocked).toBe(true);
    expect(saved?.openedApps).toHaveLength(9);
    expect(saved?.activeApp).toBeNull();
  }, 15000);

  it('guarda os dois registros da contradição, recebe o evento e retorna à mensagem original pelo caderno', async () => {
    await unlock();
    await openApp('Mensagens','Conversas');
    await click(buttonContaining('Raul Monteiro', activeApp()));
    await click(button('Guardar registro', activeApp()));
    expect(usePhoneStore.getState().discoveredEvidence).toEqual(['ev-raul']);
    expect(usePhoneStore.getState().consumedEvents).toEqual([]);
    await goHome();
    await openApp('Fotos','Biblioteca');
    await click(button('Abrir Farol, antes de anoitecer', activeApp()));
    expect(activeApp().textContent).toContain('9 de novembro');
    await click(button('Guardar registro', activeApp()));
    expect(usePhoneStore.getState().discoveredEvidence).toEqual(['ev-raul', 'ev-photo']);
    expect(usePhoneStore.getState().consumedEvents).toEqual(['event-marina-checkin']);
    expect(usePhoneStore.getState().notifications.filter(item => item.id === 'notification-marina-checkin')).toHaveLength(1);
    await goHome();
    await openApp('Investigação','Investigação');
    expect(activeApp().textContent).toContain('A fotografia comprova o encontro descrito por Raul?');
    await click(buttonContaining('O pedido de Raul', activeApp()));
    await waitUntil(() => activeApp().querySelector('h1')?.textContent === 'Raul Monteiro');
    expect(usePhoneStore.getState().activeApp).toBe('messages');
    expect(usePhoneStore.getState().appRecords.messages).toBe('msg-raul-claim');
    expect(activeApp().querySelector('#msg-raul-claim')?.textContent).toContain('Se perguntarem');
    await usePhoneStore.getState().flushSave();
    const saved = await saveRepository.load();
    expect(saved?.discoveredEvidence).toEqual(['ev-raul', 'ev-photo']);
    expect(saved?.consumedEvents).toEqual(['event-marina-checkin']);
  }, 10000);

  it('mantém a anotação digitada e o registro aberto ao restaurar um novo store do IndexedDB', async () => {
    await unlock();
    await openApp('Notas','Notas');
    await click(buttonContaining('Meu caderno de investigação', activeApp()));
    const textarea = activeApp().querySelector('textarea');
    expect(textarea).not.toBeNull();
    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')!.set!;
      setter.call(textarea, 'Conferir a data da fotografia do farol.');
      textarea!.dispatchEvent(new Event('input', { bubbles: true }));
    });
    expect(usePhoneStore.getState().playerNotes).toBe('Conferir a data da fotografia do farol.');
    await goHome();
    await openApp('Notas','Meu caderno');
    expect(activeApp().querySelector('textarea')?.value).toBe('Conferir a data da fotografia do farol.');
    await usePhoneStore.getState().flushSave();
    const restored = createPhoneStore(saveRepository);
    await restored.getState().hydrate();
    expect(restored.getState().activeApp).toBe('notes');
    expect(restored.getState().appRecords.notes).toBe('player');
    expect(restored.getState().playerNotes).toBe('Conferir a data da fotografia do farol.');
  }, 10000);
});
