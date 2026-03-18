import { expect, test } from '@playwright/test';

test('affiche la page et clique sur le bouton Signup', async ({ page }) => {
    await page.goto('/');

    const signupButton = page.getByRole('button', { name: /signup/i });
    await expect(signupButton).toBeVisible();
    await signupButton.click();
});
