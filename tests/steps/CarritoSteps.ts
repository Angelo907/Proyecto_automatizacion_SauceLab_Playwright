import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { test } from '../utilities/fixtures';

const { Given, When, Then } = createBdd(test);

Given("hago clic en el boton de checkout", async ({carritoPage}) => {
  await carritoPage.hacerClickCheckout();
});

Then(`verifico que al dar clic en el icono de carrito me redirija a la pagina del carrito`, async ({carritoPage, page}) => {
    await expect(page).toHaveURL(/.*cart.html.*/);
    await expect(carritoPage.getProducto()).toBeVisible();
    await expect(carritoPage.getDescripcionProducto()).toBeVisible();
    await expect(carritoPage.getPrecioProducto()).toBeVisible();
    await expect(carritoPage.getProductoButton()).toBeVisible();
});
