import { expect, test as base, type Page } from '@playwright/test';

class LoginPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto('https://www.saucedemo.com/');
  }

  async signIn(username: string, password: string): Promise<void> {
    await this.page.locator('[data-test="username"]').fill(username);
    await this.page.locator('[data-test="password"]').fill(password);
    await this.page.locator('[data-test="login-button"]').click();
  }
}

class InventoryPage {
  constructor(private readonly page: Page) {}

  get title() {
    return this.page.locator('[data-test="title"]');
  }

  get backpackTitle() {
    return this.page.locator('[data-test="item-4-title-link"]');
  }

  get backpackPrice() {
    return this.page.getByText('$29.99');
  }

  get sortDropdown() {
    return this.page.locator('[data-test="product-sort-container"]');
  }

  get onesieAddButton() {
    return this.page.locator('[data-test="add-to-cart-sauce-labs-onesie"]');
  }

  get cartBadge() {
    return this.page.locator('[data-test="shopping-cart-badge"]');
  }

  get cartLink() {
    return this.page.locator('[data-test="shopping-cart-link"]');
  }

  async sortByPriceLowToHigh(): Promise<void> {
    await this.sortDropdown.selectOption('lohi');
  }

  async addLowestPricedItemToCart(): Promise<void> {
    await this.onesieAddButton.click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}

class CartPage {
  constructor(private readonly page: Page) {}

  get title() {
    return this.page.locator('[data-test="title"]');
  }

  get onesieTitle() {
    return this.page.locator('[data-test="item-2-title-link"]');
  }

  get itemPrice() {
    return this.page.locator('[data-test="inventory-item-price"]');
  }
}

type PageObjects = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
};

const test = base.extend<PageObjects>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
});

test.describe('Storefront and Catalog', () => {
  test('Browse the product catalog', async ({ loginPage, inventoryPage, cartPage }) => {
    // 1. Navigate to the Sauce Demo storefront.
    await loginPage.open();

    // 2. Sign in with the standard demo user.
    await loginPage.signIn('standard_user', 'secret_sauce');

    // 3. Verify the Products catalog is displayed.
    await expect(inventoryPage.title).toHaveText('Products');

    // 4. Verify product names and prices are shown.
    await expect(inventoryPage.backpackTitle).toBeVisible();
    await expect(inventoryPage.backpackPrice).toBeVisible();

    // 5. Sort products by price low to high and verify the sort selection.
    await inventoryPage.sortByPriceLowToHigh();
    await expect(inventoryPage.sortDropdown).toHaveValue('lohi');

    // 6. Add a product from the catalog to the cart.
    await inventoryPage.addLowestPricedItemToCart();

    // 7. Verify the cart badge increments.
    await expect(inventoryPage.cartBadge).toHaveText('1');

    // 8. Open the cart and verify the selected product is listed.
    await inventoryPage.openCart();
    await expect(cartPage.title).toHaveText('Your Cart');
    await expect(cartPage.onesieTitle).toBeVisible();
    await expect(cartPage.itemPrice).toHaveText('$7.99');
  });
});
