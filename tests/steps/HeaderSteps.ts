import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { test } from '../utilities/fixtures';
import { Logger } from '../utilities/Logger';

const { Given, When, Then } = createBdd(test);

Given(`observo y verifico que estoy en el catalogo de productos`, async ({headerPage}) => {
    await expect(headerPage.getTitulo()).toBeVisible();
});

When(`selecciono el filtro que deseo {string}`, async ({headerPage},filtro: string) => {
    await headerPage.seleccionarFiltro(filtro);
});

Then(`debo poder regresar al catalogo al dar clic en back to products`, async ({headerPage}) => {
    await headerPage.regresarPantallaAnterior();
});

Then(`verifico que se muestre el carrito con la cantidad {string} de productos añadidos`, async ({headerPage},cantidadEsperada: string) => {
    await expect.soft(headerPage.getCantidad()).toBeVisible();    
    await expect.soft(headerPage.getCantidad()).toHaveText(cantidadEsperada);
    await headerPage.irCarritoCompras();
});

Then(`debo obversar que se refleje la cantidad {string} en el carrito`, async ({headerPage},cantidadEsperada: string) => {
    await expect(headerPage.getCantidad()).toHaveText(cantidadEsperada);
});