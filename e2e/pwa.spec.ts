import { expect, test } from '@playwright/test';

test.describe('PWA publicada', () => {
  test.skip(process.env.PLAYWRIGHT_TEST_PWA !== '1', 'Requer o build de produção publicado, com service worker.');
  test.setTimeout(120_000);

  test('restaura progresso e abre fotos sem rede após instalar o cache de produção', async ({ page, context }) => {
    await page.goto('./');
    await expect(page.getByRole('button', { name: 'Toque para desbloquear' })).toBeVisible();
    expect(new URL(page.url()).pathname).toBe('/ultima-conexao/');
    expect(await page.evaluate(() => 'serviceWorker' in navigator)).toBe(true);

    const scope = await page.evaluate(async () => (await navigator.serviceWorker.ready).scope);
    expect(new URL(scope).pathname).toBe('/ultima-conexao/');
    // The first visit installs the cache. A second navigation becomes controlled,
    // without requiring clientsClaim or forcing an update during a saved game.
    await page.reload();
    await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);

    const cachedPaths = await page.evaluate(async () => {
      const paths: string[] = [];
      for (const name of await caches.keys()) {
        const cache = await caches.open(name);
        for (const request of await cache.keys()) paths.push(new URL(request.url).pathname);
      }
      return paths;
    });
    expect(cachedPaths).toContain('/ultima-conexao/index.html');
    expect(cachedPaths).toContain('/ultima-conexao/assets/lighthouse.svg');
    expect(cachedPaths.some(path => /\/assets\/PhotosApp-[^/]+\.js$/.test(path))).toBe(true);

    await page.getByRole('button', { name: 'Toque para desbloquear' }).click();
    for (const digit of ['1', '7', '0', '8']) await page.getByRole('button', { name: digit, exact: true }).click();
    await page.getByRole('button', { name: 'Abrir Mensagens', exact: true }).first().click();
    await page.getByRole('button', { name: /Raul Monteiro/ }).click();
    await page.getByRole('button', { name: 'Guardar registro', exact: true }).click();
    await page.getByRole('button', { name: 'Tela inicial', exact: true }).click();

    await page.getByRole('button', { name: 'Abrir Notas', exact: true }).click();
    await page.getByRole('button', { name: /Meu caderno de investigação/ }).click();
    const note = 'Retomar a investigação mesmo sem conexão.';
    await page.getByRole('textbox', { name: 'Anotações da investigação', exact: true }).fill(note);
    await page.getByRole('button', { name: 'Tela inicial', exact: true }).click();
    await page.getByRole('button', { name: 'Abrir Ajustes', exact: true }).click();
    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Exportar progresso', exact: true }).click();
    await download; // Export waits for every queued IndexedDB write.

    await context.setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' });
    expect(await page.evaluate(() => navigator.onLine)).toBe(false);
    await expect(page.locator('.phone-app-layer:not([hidden]) h1')).toHaveText('Ajustes');
    await page.getByRole('button', { name: 'Tela inicial', exact: true }).click();
    await expect(page.locator('.phone-home-layer:not([hidden])')).toBeVisible();

    await page.getByRole('button', { name: 'Abrir Notas', exact: true }).click();
    await expect(page.getByRole('textbox', { name: 'Anotações da investigação', exact: true })).toHaveValue(note);
    await page.getByRole('button', { name: 'Tela inicial', exact: true }).click();
    await page.getByRole('button', { name: 'Abrir Investigação', exact: true }).click();
    await expect(page.getByText('1 registro guardado', { exact: true })).toBeVisible();
    await expect(page.locator('.phone-app-layer:not([hidden]) .evidence-card h3')).toHaveText('O pedido de Raul');
    await page.getByRole('button', { name: 'Tela inicial', exact: true }).click();

    // Photos was never opened online: its lazy module and its illustrations must
    // now load from the production precache, rather than a previously open app.
    const photoResponse = page.waitForResponse(response =>
      new URL(response.url()).pathname.endsWith('/assets/lighthouse.svg') && response.fromServiceWorker(),
    );
    await page.getByRole('button', { name: 'Abrir Fotos', exact: true }).first().click();
    await page.getByRole('button', { name: 'Abrir Farol, antes de anoitecer', exact: true }).click();
    const photo = page.locator('.phone-app-layer:not([hidden]) .photo-detail img');
    await expect(photo).toBeVisible();
    await expect.poll(() => photo.evaluate(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0)).toBe(true);
    expect((await photoResponse).ok()).toBe(true);
  });
});
