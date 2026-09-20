import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { test } from '../utilities/fixtures';

const { Given, When, Then } = createBdd(test);

Given('que ingreso a la página de login', async ({ loginPage  }) => {
  await loginPage.open();
  await loginPage.verifyPage();
});

When(
  'ingreso con el usuario válido',
  async ({ loginPage }) => {
    const usuario  = process.env.SAUCE_USER;
    const password = process.env.SAUCE_PASSWORD;

    if (!usuario || !password) {
        throw new Error(
            'SAUCE_USER y SAUCE_PASSWORD deben estar configurados.'
        );
    }
    await loginPage.login(usuario, password);
  }
);

Then('debería ver la página principal', async ({ page  }) => {
  await expect(page).toHaveURL(/.*inventory.html.*/);
});

Then('debería visualizar el mensaje de error {string}', async ({loginPage}, mensaje: string) => {
  await expect(loginPage.getErrorMessage()).toBeVisible();
  await expect(loginPage.getErrorMessage()).toHaveText(mensaje);
});