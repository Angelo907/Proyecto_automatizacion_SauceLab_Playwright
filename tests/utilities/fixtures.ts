import { test as base } from 'playwright-bdd';
import { LoginPage } from '../pages/LoginPage';
import { ProductoPage } from '../pages/ProductoPage';
import { HeaderPage } from '../pages/HeaderPage';
import { DetalleProductoPage } from '../pages/DetalleProductoPage';
import { CarritoPage } from '../pages/CarritoPage';
import { CheckoutPage } from '../pages/CheckoutPage';

/**
 * En este archivo se crea una versión "extendida" del test de Playwright, 
 * que ahora sabe construir un loginPage, headerPage, etc. Cuando algún step lo pida.
 * En los steps, en vez de pedir { page } y luego instanciar, 
 * se pide directamente, ejem: { loginPage } — Playwright ya lo entrega listo para usar.
 */
type PageFixtures = {
  loginPage: LoginPage;
  headerPage: HeaderPage
  productoPage: ProductoPage;
  detalleProductoPage: DetalleProductoPage;
  carritoPage: CarritoPage;
  checkoutPage: CheckoutPage;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  headerPage: async ({ page }, use) => {
    await use(new HeaderPage(page));
  },

  productoPage: async ({ page }, use) => {
    await use(new ProductoPage(page));
  },

  detalleProductoPage: async ({ page }, use) => {
    await use(new DetalleProductoPage(page));
  },

  carritoPage: async ({ page }, use) => {
    await use(new CarritoPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});

