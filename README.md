# SACUE LAB — Framework de Automatización Playwright + BDD + POM

Arquitectura base para un framework de automatización con **Playwright + TypeScript**, **BDD (Gherkin)** y **Page Object Model**, con trazabilidad (Logger), capturas automáticas por step y reporte tipo Allure.

---

## 1. Librerías elegidas y por qué

| Librería            | Para qué                                  | Por qué esta y no otra                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@playwright/test`  | Motor de automatización y test runner     | Es el runner oficial de Microsoft, con paralelización, trazas, video y reintentos nativos.                                                                                                                                                                                                                                                                                                                                                                                             |
| `playwright-bdd`    | Conecta Gherkin (.feature) con Playwright | Convierte los `.feature` en tests **nativos** de Playwright. A diferencia de usar `@cucumber/cucumber` directo (que exige reconstruir manualmente el ciclo de vida del navegador, paralelización y reportes), con `playwright-bdd` heredas gratis TODO lo que ya trae el runner de Playwright: trazas, video, paralelización, reintentos y reportes HTML. Es el enfoque más recomendado actualmente en la documentación y comunidad de Playwright + BDD, y está activamente mantenido. |
| `allure-playwright` | Reporte tipo Allure                       | Se integra directamente como reporter de Playwright, sin necesidad de plugins adicionales de Cucumber.                                                                                                                                                                                                                                                                                                                                                                                 |
| `typescript`        | Tipado                                    | Ver el análisis de por qué TypeScript es la opción nativa recomendada por Playwright (documento aparte ya entregado).                                                                                                                                                                                                                                                                                                                                                                  |

**Nota importante:** antes de instalar, confirma en `npm view playwright-bdd versions` y en la documentación oficial (`vitalets.github.io/playwright-bdd`) que las versiones fijadas en `package.json` siguen siendo las más recientes y compatibles con tu versión de `@playwright/test` — este ecosistema se actualiza con frecuencia.

---

## 2. Estructura del proyecto

```
tests/
  features/         → Archivos .feature (Gherkin), el "qué" en lenguaje natural
  pages/             → Page Objects (BasePage + páginas concretas)
  steps/             → Step Definitions, conectan Gherkin con los Page Objects
  utilities/         → Logger, hooks globales (Before/After/AfterStep)
playwright.config.ts → Configuración central: ambientes, reporters, proyectos de navegador
tsconfig.json
package.json
```

**Regla de oro de esta arquitectura:** los steps NUNCA acceden a selectores directamente. Siempre pasan por un método público de un Page Object. Las validaciones que dependen del escenario (assertions de negocio) viven en los steps; las validaciones fijas de la página (¿cargó correctamente?) viven en el Page Object, en `verifyPage()`.

---

## 3. Cómo funciona `BasePage`

Todo Page Object debe extender `BasePage` e implementar `verifyPage()`. Esto aplica los 4 pilares de POO:

- **Encapsulamiento:** selectores `private readonly`, solo accesibles vía métodos públicos.
- **Abstracción:** `BasePage` oculta el detalle de cómo se hace click/fill, exponiendo métodos con nombres claros.
- **Herencia:** cada página hereda `click`, `fill`, `goto`, sin duplicar código.
- **Polimorfismo:** cada página implementa `verifyPage()` a su manera, pero cualquier orquestador puede llamar `pagina.verifyPage()` sin saber cuál es.

---

## 4. Cómo ejecutar

```bash
npm install
npx playwright install       # instala los navegadores la primera vez

npm test                     # genera los tests desde los .feature y corre todo
npm run test:headed          # igual, pero con navegador visible
npm run report:playwright    # abre el reporte HTML nativo de Playwright

npm run allure:generate      # genera el reporte Allure a partir de allure-results
npm run allure:open          # lo abre en el navegador
```

Para cambiar de ambiente:

```bash
TEST_ENV=uat npm test
```

(agrega tantas claves como necesites en el objeto `environments` de `playwright.config.ts`)

---

## 5. Capturas automáticas por step

El hook `AfterStep` en `tests/utilities/hooks.ts` toma una captura después de cada paso del Gherkin y la adjunta al reporte (visible tanto en el reporte HTML de Playwright como en Allure, ya que ambos leen los `attachments` del test).

**Antes de usar esto en el trabajo real**, verifica el nombre exacto de los fixtures especiales (`$step`, `$testInfo`) contra la versión de `playwright-bdd` que instales — el README lo deja marcado con un comentario, porque estas APIs pueden variar ligeramente entre versiones del paquete.

Si en el futuro decides que solo quieres evidencia en los tests que fallan (para no generar cientos de capturas en cada corrida), puedes quitar `hooks.ts` del array `steps` en `playwright.config.ts` y dejar que Playwright capture automáticamente con `screenshot: 'only-on-failure'` (ya configurado en `use`).

---

## 6. Siguientes pasos sugeridos

1. Reemplazar los selectores de ejemplo en `LoginPage.ts` por los reales de tu aplicación, priorizando `data-testid` o `getByRole`.
2. Crear un Page Object por cada pantalla nueva, siempre extendiendo `BasePage`.
3. Definir un estándar de tags de Gherkin (`@smoke`, `@regression`) para poder filtrar ejecuciones: `npx playwright test --grep @smoke`.
4. Configurar el pipeline de CI para correr `npm test` y publicar el reporte de Allure como artefacto.

## 7. Fixtures: cómo evitamos repetir `new Page(page)` en cada step

Este proyecto usa **fixtures de Playwright** en vez de instanciar los Page Objects manualmente dentro de cada step.

### El problema que resuelve

Sin fixtures, cada step que necesita un Page Object repetiría esto:

```typescript
Given("...", async ({ page }) => {
  const loginPage = new LoginPage(page);
  // ...
});
```

Con varios steps usando la misma página, esa línea se duplica una y otra vez.

### La solución: `tests/utilities/fixtures.ts`

```typescript
import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

type PageFixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
});
```

### Cómo se usa en los steps

```typescript
import { createBdd } from "playwright-bdd";
import { test } from "../utilities/fixtures";

const { Given, When, Then } = createBdd(test); // 👈 se le pasa el test extendido

Given("que ingreso a la página de login", async ({ loginPage }) => {
  // loginPage ya viene instanciado, no hace falta "new"
  await loginPage.goto("/login");
  await loginPage.verifyPage();
});
```

### Reglas para agregar un Page Object nuevo al proyecto

1. Crea el Page Object en `tests/pages/`, extendiendo `BasePage`.
2. Agrégalo a `PageFixtures` (el tipo) y a `base.extend({...})` en `tests/utilities/fixtures.ts`.
3. En cualquier step nuevo, pídelo como parámetro: `async ({ miNuevaPage }) => {...}`.

### Por qué este enfoque y no `test.beforeEach`

- Cada fixture se construye **una sola vez por escenario**, y solo si algún step realmente la usa (no se crea "por si acaso").
- No depende de que cada archivo tenga su propio `test.describe` + `beforeEach` — se define una vez, en un solo lugar, y se reutiliza en todo el proyecto.
- Es el mecanismo que `playwright-bdd` espera para este propósito, en vez de recurrir a hooks manuales de Cucumber.
