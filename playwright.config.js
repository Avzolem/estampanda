import { defineConfig, devices } from "@playwright/test";

/**
 * Configuración de Playwright para tests E2E de Estampanda.
 *
 * Para ejecutar:
 *   1. Una vez (descarga browsers, ~300 MB): npx playwright install --with-deps chromium
 *   2. Levantar el dev server: npm run dev
 *   3. Correr los tests: npm run test:e2e
 *
 * Los tests son SMOKE TESTS — verifican que las rutas cargan y la UI
 * crítica está presente. NO hacen uploads reales a Cloudinary porque
 * requieren credenciales reales y consumen el plan free.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",

  use: {
    baseURL: process.env.E2E_BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // Si quieres añadir más navegadores, descomenta:
    // { name: "firefox",  use: { ...devices["Desktop Firefox"] } },
    // { name: "webkit",   use: { ...devices["Desktop Safari"] } },
    // { name: "mobile",   use: { ...devices["Pixel 7"] } },
  ],

  // No levantamos webServer automáticamente — el dev server tiene
  // dependencias (Mongo, Cloudinary) que el agente de tests no debe
  // gestionar. El usuario corre `npm run dev` aparte.
});
