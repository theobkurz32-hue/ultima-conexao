import { expect, test, type Page } from '@playwright/test';

async function unlock(page: Page) {
  await page.goto('./');
  await page.getByRole('button', { name: 'Toque para desbloquear' }).click();
  for (const digit of ['1', '7', '0', '8']) await page.getByRole('button', { name: digit, exact: true }).click();
  await expect(page.getByRole('button', { name: 'Abrir Mensagens', exact: true }).first()).toBeVisible();
}

test('pista, código incorreto, desbloqueio e todos os aplicativos instalados', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('./');
  await page.getByRole('button', { name: 'Toque para desbloquear' }).click();
  await page.getByRole('button', { name: 'Ler mensagem de Marina' }).click();
  await expect(page.getByText('Quatro dígitos: dia e mês.')).toBeVisible();
  for (let i = 0; i < 4; i++) await page.getByRole('button', { name: '0', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Código incorreto');
  for (const digit of ['1', '7', '0', '8']) await page.getByRole('button', { name: digit, exact: true }).click();
  for (const [app, heading] of [
    ['Mensagens', 'Conversas'], ['Fotos', 'Biblioteca'], ['Notas', 'Notas'],
    ['E-mail', 'Entrada'], ['Calendário', 'Calendário'], ['Mapas', 'Santa Aurora'],
    ['Investigação', 'Investigação'], ['Ajustes', 'Ajustes'], ['Telefone', 'Telefone'],
  ]) {
    await page.getByRole('button', { name: `Abrir ${app}`, exact: true }).first().click();
    await expect(page.locator('.phone-app-layer:not([hidden]) .app-header h1')).toContainText(heading);
    await page.getByRole('button', { name: 'Tela inicial', exact: true }).click();
  }
  expect(errors).toEqual([]);
});

test('cruza registros, recebe um aviso, abre a origem e restaura anotações', async ({ page }) => {
  await unlock(page);
  await page.getByRole('button', { name: 'Abrir Mensagens', exact: true }).first().click();
  await page.getByRole('button', { name: /Raul Monteiro/ }).click();
  await page.getByRole('button', { name: 'Guardar registro', exact: true }).click();
  await page.getByRole('button', { name: 'Tela inicial', exact: true }).click();
  await page.getByRole('button', { name: 'Abrir Fotos', exact: true }).first().click();
  await page.getByRole('button', { name: 'Abrir Farol, antes de anoitecer', exact: true }).click();
  await page.getByRole('button', { name: 'Guardar registro', exact: true }).click();
  await page.getByRole('button', { name: 'Tela inicial', exact: true }).click();
  await page.getByRole('button', { name: 'Abrir Investigação', exact: true }).click();
  await expect(page.getByText('2 registros guardados', { exact: true })).toBeVisible();
  await page.getByRole('tab', { name: 'Anotações', exact: true }).click();
  await page.getByRole('textbox', { name: 'Minhas anotações', exact: true }).fill('Conferir a data do arquivo original.');
  // A completed export provides a visible save action before checking restoration.
  await page.getByRole('button', { name: 'Tela inicial', exact: true }).click();
  await page.getByRole('button', { name: 'Abrir Ajustes', exact: true }).click();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Exportar progresso', exact: true }).click();
  await download;
  await page.reload();
  await expect(page.locator('.phone-app-layer:not([hidden]) h1')).toHaveText('Ajustes');
  await page.getByRole('button', { name: 'Tela inicial', exact: true }).click();
  await page.getByRole('button', { name: 'Abrir Investigação', exact: true }).click();
  await page.getByRole('tab', { name: 'Anotações', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Minhas anotações', exact: true })).toHaveValue('Conferir a data do arquivo original.');
  await page.getByRole('tab', { name: 'Registros', exact: true }).click();
  await page.locator('.evidence-card').first().click();
  await expect(page.locator('.phone-app-layer:not([hidden]) .evidence-button.saved')).toBeVisible();
  await page.getByRole('button', { name: 'Abrir notificações', exact: true }).click();
  await expect(page.locator('.panel-notification')).toHaveCount(2);
});
