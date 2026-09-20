import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { test } from '../utilities/fixtures';

const { Given, When, Then } = createBdd(test);

When(`hago clic en el boton add to cart`, async ({detalleProductoPage}) => {
    await detalleProductoPage.agregarProductoCarrito();
});

Then(`debo observar el titulo de producto, descripcion, precio y boton de agregar`, async ({detalleProductoPage}) => {
    await expect(detalleProductoPage.getProducto()).toBeVisible();
    await expect(detalleProductoPage.getDescripcionProducto()).toBeVisible();
    await expect(detalleProductoPage.getPrecioProducto()).toBeVisible();
    await expect(detalleProductoPage.getProductoButton()).toBeVisible();
});

