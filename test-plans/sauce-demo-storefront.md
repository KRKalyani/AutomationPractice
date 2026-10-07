# Sauce Demo Shopify Storefront Test Plan

## Application Overview

Functional QA coverage for https://sauce-demo.myshopify.com/, a Shopify demo storefront. The observed storefront includes a home page featuring three products, a seven-item catalog with available and sold-out items, product details, product search, a cart with quantity/update/remove/note controls, customer login and registration pages, and About Us and News pages. Each test is independent and begins in a fresh browser context with an empty cart and no authenticated customer. Use only approved test accounts and disposable data; do not submit a real purchase or payment.

## Test Scenarios

### 1. Storefront navigation and product discovery

**Seed:** `tests/seed.spec.ts`

#### 1.1. Verify homepage content and primary navigation destinations

**File:** `tests/storefront/homepage-and-primary-navigation.spec.ts`

**Steps:**
  1. Start a fresh browser context with an empty cart and open https://sauce-demo.myshopify.com/.
    - expect: The Sauce Demo home page loads successfully.
    - expect: The homepage displays Grey jacket (£55.00), Noir jacket (£60.00), and Striped top (£50.00).
    - expect: Header and main navigation links are visible and navigate to their intended Search, Catalog, Blog, About Us, Log In, and Sign up destinations.
    - expect: The cart count starts at zero and the checkout link opens the cart route.
  2. Open Catalog, Blog, About Us, Search, Log In, and Sign up from the storefront navigation, checking the resulting URL and page heading for each destination.
    - expect: Each internal navigation link loads its corresponding page without a broken-page response.
    - expect: The displayed page heading corresponds to the selected destination.
    - expect: The Sauce Demo logo or Home breadcrumb returns to the storefront home page.

#### 1.2. Browse catalog and inspect available and sold-out product details

**File:** `tests/storefront/catalog-and-product-details.spec.ts`

**Steps:**
  1. Start a fresh browser context with an empty cart and open the Catalog page.
    - expect: The catalog displays the listed products with names and prices, including Grey jacket £55.00, Noir jacket £60.00, Striped top £50.00, Black heels £45.00, Bronze sandals £39.99, Brown Shades £20.00, and White sandals £25.00.
    - expect: Brown Shades and White sandals are visibly marked Sold Out.
    - expect: Product cards navigate to the matching product detail page.
  2. Open Grey jacket from the catalog and inspect its title, price, variant selection, and purchase control.
    - expect: The detail page identifies Grey jacket at £55.00.
    - expect: An available product has an operable Add to Cart control and a selectable product option where applicable.
    - expect: The page provides a return path to the catalog or home page.
  3. Open Brown Shades from the catalog and inspect availability.
    - expect: The page identifies Brown Shades at £20.00 and visibly indicates it is sold out.
    - expect: The purchase control is disabled or otherwise unavailable.
    - expect: The unavailable product cannot be added to the cart.

#### 1.3. Search for matching and nonexistent products

**File:** `tests/storefront/product-search.spec.ts`

**Steps:**
  1. Start a fresh browser context with an empty cart and submit the search query "Grey jacket" using the header Search field.
    - expect: The search results page displays the submitted query and product results.
    - expect: A Grey jacket result is available and opens its product page.
    - expect: Results are relevant to the query; check that unrelated products are not incorrectly presented as exact matches.
  2. Replace the query with a distinctive term that cannot match a product, such as "zz-no-such-product-9471", and submit it.
    - expect: The query is handled without a server error.
    - expect: The page clearly communicates that no matching products were found and provides a usable path back to shopping.
  3. Submit the search form with an empty query.
    - expect: The empty query is handled gracefully without a broken page or unexpected result list.

### 2. Cart and checkout handoff

**Seed:** `tests/seed.spec.ts`

#### 2.1. Add an available product and verify cart contents and totals

**File:** `tests/cart/add-and-review-cart.spec.ts`

**Steps:**
  1. Start a fresh browser context and confirm the cart is empty.
    - expect: The cart count is zero and the cart page indicates there are no line items.
  2. Open Grey jacket, add one unit to the cart, and open the cart page.
    - expect: The cart count increases to one.
    - expect: The cart contains Grey jacket at £55.00 with quantity 1.
    - expect: The displayed line total and cart total are £55.00.
  3. Use Continue Shopping and add Noir jacket to the cart, then review the cart.
    - expect: Both product lines are present with their correct names and prices.
    - expect: The cart count reflects two units in total.
    - expect: The cart total is the sum of the line totals (£115.00).

#### 2.2. Update quantities, validate invalid quantities, and remove cart items

**File:** `tests/cart/update-and-remove-items.spec.ts`

**Steps:**
  1. Start a fresh browser context, add one Grey jacket, and open the cart.
    - expect: The cart contains one Grey jacket and the quantity field displays 1.
  2. Change the quantity to 2 and activate Update.
    - expect: The updated quantity is retained as 2.
    - expect: The line total and cart total update to £110.00.
  3. Try a zero, negative, non-numeric, or otherwise invalid quantity and activate Update.
    - expect: Invalid values are rejected or safely normalized according to the store's behavior.
    - expect: The cart never displays a negative or NaN total and communicates validation when applicable.
  4. Remove the Grey jacket using the item's remove control.
    - expect: The item disappears from the cart and the cart count returns to zero.
    - expect: The empty cart state is displayed and the total is £0.00 or omitted.

#### 2.3. Save an order note and verify checkout handoff without placing an order

**File:** `tests/cart/order-note-and-checkout-handoff.spec.ts`

**Steps:**
  1. Start a fresh browser context, add one available item, and open the cart.
    - expect: A valid cart item and total are displayed.
  2. Enter a short plain-text note in the order-note field and activate Update.
    - expect: The cart remains valid after updating.
    - expect: The note is retained if the cart template supports persistence; text entry does not alter item quantities or totals.
  3. Activate Check Out and inspect the resulting checkout page, stopping before entering payment details or submitting an order.
    - expect: The user is routed to a Shopify checkout or an explicit checkout error page rather than a silent failure.
    - expect: The checkout reflects the cart item and expected amount if checkout is available.
    - expect: No payment or order is submitted as part of this test.

### 3. Customer account flows

**Seed:** `tests/seed.spec.ts`

#### 3.1. Validate login errors and password recovery entry

**File:** `tests/account/login-validation-and-recovery.spec.ts`

**Steps:**
  1. Start a fresh browser context signed out and open Log In.
    - expect: The Customer Login page provides email and password fields, a Sign In action, and a password recovery entry point.
  2. Submit the login form with both fields empty.
    - expect: The form does not authenticate or navigate to an account page.
    - expect: Required-field validation or a clear login error is shown.
  3. Submit a syntactically invalid email and a password, then try a syntactically valid but unrecognized test email and password.
    - expect: Invalid email formatting is rejected by the form or clearly reported.
    - expect: Unrecognized credentials are not authenticated and an actionable error is shown without exposing sensitive account data.
  4. Open Forgot your password and submit an invalid email; then verify handling for an approved test email address without relying on a real customer account.
    - expect: The recovery form validates malformed email addresses.
    - expect: A valid-format address is handled with a non-disclosing response or appropriate error, and the user can return to login.

#### 3.2. Validate new customer registration fields and error handling

**File:** `tests/account/registration-validation.spec.ts`

**Steps:**
  1. Start a fresh browser context and open Sign up.
    - expect: The Create Account page provides first name, last name, email, and password inputs and a Create action.
  2. Submit the registration form with all fields empty, then with an invalid email and mismatching or invalid fields where applicable.
    - expect: Invalid or missing required input is not accepted.
    - expect: The form displays appropriate field-level or form-level feedback and preserves safe user-entered values where expected.
  3. If an approved disposable test identity and permission to create accounts are available, register once using unique test data; otherwise stop before submitting valid account-creation data.
    - expect: With approved test data, registration succeeds once and provides a clear confirmation or account state.
    - expect: Without approved test data, no customer account is created and this limitation is recorded.

### 4. Informational content and auxiliary navigation

**Seed:** `tests/seed.spec.ts`

#### 4.1. Verify About Us and News pages render and remain navigable

**File:** `tests/content/about-us-and-news.spec.ts`

**Steps:**
  1. Start a fresh browser context with an empty cart and open About Us from the main navigation.
    - expect: The About Us page displays its heading and explanatory content.
    - expect: The page loads without a broken layout, and primary navigation remains available.
  2. Open Blog/News from the main navigation and inspect the listing or empty state.
    - expect: The News page loads with a clear article listing or an explicit empty state.
    - expect: Any displayed article links open their corresponding article pages; no broken link is shown.

#### 4.2. Check wishlist and referral navigation entry points

**File:** `tests/content/wishlist-and-referral-entry-points.spec.ts`

**Steps:**
  1. Start a fresh browser context and activate Wish list from the main navigation.
    - expect: The link responds consistently, with either a visible wishlist experience, an authentication prompt, or a clear explanation if the feature is unavailable.
    - expect: The URL/hash change alone is not treated as proof that the wishlist feature is functional.
  2. Return to the storefront and activate Refer a friend.
    - expect: The link opens the expected sharing/referral experience or clearly communicates that the feature is unavailable.
    - expect: No unrelated navigation, JavaScript error, or broken overlay blocks the storefront.
