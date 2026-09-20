import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';
import { Logger } from './Logger';

const { Before, After, AfterStep } = createBdd(test);

function sanitize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .slice(0, 80);
}

let stepCounter = 0;

Before(async ({ page }) => {
  stepCounter = 0;
  Logger.info('Inicio de escenario: limpiando contexto');
  await page.context().clearCookies();
});

After(async () => {
  Logger.info('Fin de escenario');
});

AfterStep(async ({ page, $testInfo, $step }) => {
  stepCounter++;
  const scenarioName = sanitize($testInfo.title);
  const stepName = sanitize($step.title);
  const fileName = `${String(stepCounter).padStart(2, '0')}_${stepName}.png`;

  const screenshotBuffer = await page.screenshot();
  await $testInfo.attach(fileName, {
    body: screenshotBuffer,
    contentType: 'image/png',
  });

  Logger.step(`Screenshot capturado: ${scenarioName}/${fileName}`);
});