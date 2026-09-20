import { createBdd } from 'playwright-bdd';
import { test } from '../utilities/fixtures';
import { expect } from '@playwright/test';
import { parsePrice } from '../utilities/priceUtils';

const { Given, When, Then } = createBdd(test);


When("completo el formulario de checkout con mi nombre {string}, apellido {string} y postal {string}", 
  async ({checkoutPage}, nombre: string, apellido: string, postal: string) => {
  await checkoutPage.completarFormularioCheckout(nombre, apellido, postal);
});

Then("verifico que se muestre el resumen de mi compra", async ({checkoutPage}) => {
  await expect(checkoutPage.getDescripcionProducto()).toBeVisible();
});

Then("verifico que el precio total sea igual al precio del producto + impuestos", async ({checkoutPage}) => {
  const subtotalTexto  = await checkoutPage.getSubtotal().innerText();
  const impuestosTexto = await checkoutPage.getImpuestos().innerText();
  const totalTexto     = await checkoutPage.getPrecioTotal().innerText();

  const subtotal  = parsePrice(subtotalTexto);
  const impuestos = parsePrice(impuestosTexto);
  const total     = parsePrice(totalTexto);

  await expect(total).toBeCloseTo(subtotal + impuestos, 2);
  await checkoutPage.clicTerminarCompra();

});

Then("verfico que al finalizar la compra se muestre el mensaje de confirmacion de pedido {string}",
   async ({checkoutPage}, mensaje: string) => {
  await expect.soft(checkoutPage.getMensajeConfirmacionPedido()).toBeVisible();
  await expect.soft(checkoutPage.getMensajeConfirmacionPedido()).toHaveText(mensaje);

  await checkoutPage.regresarHome();
});

