import { expect, test } from '@playwright/test';

test('remplit le formulaire d\'inscription et affiche un toast de succès', async ({ page }) => {
    const timestamp = Date.now();
    const email = `playwright.user.${timestamp}@example.com`;

    await page.goto('/signup');

    await page.getByPlaceholder(/user email/i).fill(email);
    await page.getByPlaceholder(/password/i).fill('P@ssword1234!');
    await page.getByRole('button', { name: /sign\s*up|s\'inscrire|inscription/i }).click();

    await expect(page.getByText(/user created, you can signin/i)).toBeVisible();
});
