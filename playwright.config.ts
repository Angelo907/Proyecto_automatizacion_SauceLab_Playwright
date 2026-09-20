import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import * as process from 'node:process';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });
// ------------------------------------------------------------------
// Ambientes: agrega aquí tantos como necesites (qa, uat, etc.)
// Se selecciona con: BASE_URL definido en el .env, o por CLI:
//   BASE_URL=https://uat.miapp.com npx playwright test
// ------------------------------------------------------------------
const environments: Record<string, string> = {
  dev: process.env.BASE_URL_DEV || '',
  uat: process.env.BASE_URL_UAT || '',
}as const;

const currentEnv = process.env.TEST_ENV ?? 'dev';
const baseURL = process.env.BASE_URL || environments[currentEnv as keyof typeof environments];

if (!baseURL) {
  throw new Error(
    `No se encontró la URL para el ambiente "${currentEnv}". ` +
    `Verifica tu archivo .env (BASE_URL_${currentEnv.toUpperCase()}) ` +
    `o las variables de entorno configuradas en el pipeline de CI.`
  );
}
// ------------------------------------------------------------------
// playwright-bdd: convierte los .feature en tests nativos de Playwright.
// Esto es lo que nos da, gratis, screenshots, trazas, video, paralelización
// y reportes, sin tener que reconstruirlo manualmente.
// ------------------------------------------------------------------

const testDir = defineBddConfig({
  features: 'tests/features/**/*.feature',
  steps: ['tests/steps/**/*.ts', 'tests/utilities/hooks.ts', 'tests/utilities/fixtures.ts'],
});
/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir,
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright', { detail: true, outputFolder: 'allure-results' }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL,

    headless: !!process.env.CI,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    // El screenshot "on" en cada paso lo maneja el hook AfterStep
    // (ver tests/utilities/hooks.ts). Este screenshot es solo el
    // que Playwright adjunta automáticamente si el test falla.
    screenshot: 'only-on-failure',

    testIdAttribute: "data-test",
  },

  /* Configure projects for major browsers */
  projects: [
    // {
    //   name: 'chromium',
    //   use: { ...devices['Desktop Chrome'] },
    // },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    {
      name: 'Google Chrome',
      use: { channel: 'chrome', viewport: null, launchOptions:{
        args: process.env.CI ? [] : ["--start-maximized"],
        slowMo: process.env.CI ? 0 : 700,
      } },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
