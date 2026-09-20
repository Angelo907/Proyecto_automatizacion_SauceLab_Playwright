import { Page, Locator, expect } from '@playwright/test';
import { Logger } from '../utilities/Logger';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  abstract verifyPage(): Promise<void>;

  protected async click(locator: Locator, description: string, timeout = 5000): Promise<void> {
    Logger.info(`Click en: ${description}`);
    await locator.click({timeout});
  }

  protected async fill(locator: Locator, value: string, description: string, timeout = 5000): Promise<void> {
    Logger.info(`Rellenando "${description}" con valor: ${value}`);
    await locator.fill(value, {timeout});
  }

  protected async check(locator: Locator, description: string): Promise<void> {
    Logger.info(`Marcando checkbox/radio: ${description}`);
    await locator.check();
  }

  protected async uncheck(locator: Locator, description: string): Promise<void> {
    Logger.info(`Desmarcando checkbox/radio: ${description}`);
    await locator.uncheck();
  }

  protected async selectOption(locator: Locator, value: string, description: string): Promise<void> {
    Logger.info(`Seleccionando "${value}" en: ${description}`);
    await locator.selectOption(value);
  }

  protected async getText(locator: Locator, description: string): Promise<string> {
    Logger.info(`Obteniendo texto de: ${description}`);
    return await locator.innerText();
  }

  protected async isVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  protected async waitForVisible(locator: Locator, timeout = 5000): Promise<void> {
    Logger.info('Esperando a que el elemento esté visible');
    await locator.waitFor({ state: 'visible', timeout });
  }

  protected async expectVisible(locator: Locator, description: string): Promise<void> {
    Logger.info(`Verificando visibilidad de: ${description}`);
    await expect(locator).toBeVisible();
  }

  async open(path: string): Promise<void> {
    Logger.info(`Navegando a: ${path}`);
    await this.page.goto(path);
  }
}