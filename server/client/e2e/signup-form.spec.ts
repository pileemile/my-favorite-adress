import { expect, test } from '@playwright/test';

test('remplit le formulaire d\'inscription et affiche un toast de succès', async ({ page }) => {
    const timestamp = Date.now();
    const email = `playwright.user.${timestamp}@example.com`;

    await page.goto('/signup');

    await page.getByLabel(/name|nom/i).fill('Playwright User');
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/password|mot de passe/i).fill('P@ssword1234!');

    await page.getByRole('button', { name: /sign\s*up|s\'inscrire|inscription/i }).click();

    await expect(page.getByText(/success|succès|compte créé|account created/i)).toBeVisible();
});
