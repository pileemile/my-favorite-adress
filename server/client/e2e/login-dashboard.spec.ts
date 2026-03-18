import { expect, test } from '@playwright/test';

test('se connecte avec le compte créé et affiche le Dashboard', async ({ page }) => {
    const timestamp = Date.now();
    const email = `playwright.login.${timestamp}@example.com`;
    const password = 'P@ssword1234!';

    await page.goto('/signup');
    await page.getByPlaceholder(/user email/i).fill(email);
    await page.getByPlaceholder(/password/i).fill(password);
    await page.getByRole('button', { name: /sign\s*up|s\'inscrire|inscription/i }).click();
    await expect(page.getByText(/user created, you can signin/i)).toBeVisible();

    await page.goto('/signin');
    await page.getByPlaceholder(/user email/i).fill(email);
    await page.getByPlaceholder(/password/i).fill(password);
    await page.getByRole('button', { name: /sign\s*in|connexion|se connecter/i }).click();

    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
});
