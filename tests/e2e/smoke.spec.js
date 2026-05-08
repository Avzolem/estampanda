import { test, expect } from "@playwright/test";

/**
 * Smoke tests — flujo público sin uploads reales.
 *
 * Cubre:
 *   - Landing carga sin errores y tiene CTAs
 *   - /stickers/designer carga el FileUploader
 *   - /cart muestra "carrito vacío" en sesión nueva
 *   - Cookie cart-session-id se setea automáticamente
 *   - Header tiene CartBadge
 *
 * NO cubre uploads reales (consumen Cloudinary). Para eso hay que mockear
 * o usar una cuenta de test separada.
 */

test.describe("Estampanda — smoke tests del flujo público", () => {
  test("la landing carga y muestra el botón de diseñar", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Estampanda/);
    // Algún CTA visible que lleve al designer
    const designerCta = page.locator('a[href*="/stickers/designer"]').first();
    await expect(designerCta).toBeVisible();
  });

  test("el header muestra logo y CartBadge", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByAltText("Estampanda")).toBeVisible();
    // CartBadge link a /cart
    await expect(page.locator('a[href="/cart"]').first()).toBeVisible();
  });

  test("la cookie cart-session-id se setea al visitar /stickers/designer", async ({
    page,
    context,
  }) => {
    await page.goto("/stickers/designer");
    const cookies = await context.cookies();
    const sessionCookie = cookies.find((c) => c.name === "cart-session-id");
    expect(sessionCookie).toBeDefined();
    expect(sessionCookie?.value).toMatch(/^[0-9a-f-]{36}$/i); // UUID v4
    expect(sessionCookie?.httpOnly).toBe(true);
  });

  test("/stickers/designer muestra el FileUploader cuando no hay diseño", async ({
    page,
  }) => {
    await page.goto("/stickers/designer");
    await expect(
      page.getByRole("heading", { name: /diseña tu sticker/i })
    ).toBeVisible();
    // El dropzone tiene "Arrastra tu diseño aquí"
    await expect(page.getByText(/arrastra tu diseño/i).first()).toBeVisible();
  });

  test("/cart muestra estado vacío con CTA", async ({ page }) => {
    await page.goto("/cart");
    await expect(
      page.getByRole("heading", { name: /tu carrito/i })
    ).toBeVisible();
    await expect(page.getByText(/tu carrito está vacío/i)).toBeVisible();
    // CTA al designer
    const cta = page.locator('a[href="/stickers/designer"]').first();
    await expect(cta).toBeVisible();
  });

  test("/api/cart responde con cart vacío para sesión nueva", async ({
    request,
  }) => {
    const res = await request.get("/api/cart");
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.cart).toBeDefined();
    expect(Array.isArray(data.cart.items)).toBe(true);
    expect(data.cart.items.length).toBe(0);
    expect(data.cart.subtotal).toBe(0);
  });

  test("/api/cron/cleanup-expired rechaza sin Authorization", async ({
    request,
  }) => {
    const res = await request.get("/api/cron/cleanup-expired");
    expect(res.status()).toBe(401);
  });

  test("/api/upload/signature rechaza tipo de archivo inválido", async ({
    request,
  }) => {
    const res = await request.post("/api/upload/signature", {
      data: {
        filename: "fake.exe",
        contentType: "application/x-msdownload",
        fileSize: 1024,
      },
    });
    expect(res.status()).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/tipo de archivo no soportado/i);
  });
});
