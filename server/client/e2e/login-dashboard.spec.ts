import { expect, test } from '@playwright/test';

test('se connecte avec le compte créé et affiche le Dashboard', async ({ page }) => {
    const timestamp = Date.now();
    const email = `playwright.login.${timestamp}@example.com`;
    const password = 'P@ssword1234!';

    await page.goto('/signup');
    await page.getByLabel(/name|nom/i).fill('Playwright Login User');
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/password|mot de passe/i).fill(password);
    await page.getByRole('button', { name: /sign\s*up|s\'inscrire|inscription/i }).click();

    await page.goto('/login');
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/password|mot de passe/i).fill(password);
    await page.getByRole('button', { name: /log\s*in|connexion|se connecter/i }).click();

    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
});
