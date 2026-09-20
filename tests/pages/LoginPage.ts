import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private readonly userInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly logoLogin: Locator;

  constructor(page: Page) {
    super(page);
    this.userInput     = page.getByRole("textbox", {name: "Username"});
    this.passwordInput = page.getByRole("textbox", {name: "Password"});
    this.loginButton   = page.getByRole("button", {name: "Login"});
    this.errorMessage  = page.getByTestId("error");
    this.logoLogin     = page.locator(".login_logo");
  }

  async verifyPage(): Promise<void> {
    await this.expectVisible(this.logoLogin, 'logo del login');
  }

  async open(): Promise<void> {
    await super.open("/");
  }

  async login(user: string, password: string): Promise<void> {
    await this.fill(this.userInput, user, 'usuario de login');
    await this.fill(this.passwordInput, password, 'contraseña de login');
    await this.click(this.loginButton, 'botón de iniciar sesión');
  }

  getErrorMessage(): Locator {
    return this.errorMessage;
  }
}