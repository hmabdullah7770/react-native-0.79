# Feature Specification: Move product fetching to ProductBottomnav and make ProductDropdown presentational

**Feature Branch**: `008-feature-move-product`
**Created**: 2025-09-21
**Status**: Draft
**Input**: User description: "Move product fetching to ProductBottomnav and make ProductDropdown presentational. ProductBottomnav should read storeId from Keychain once, dispatch getStoreProductRequest one time when visible if storeId exists, and provide products to ProductDropdown. ProductDropdown should not dispatch actions or read Keychain; it should only render provided products and emit selection events. UI: dropdown header showing selected product image+name and arrow; dropdown list shows image, product name, and price (as in attached sketch). Ensure no duplicate API calls."

## Execution Flow (main)

1. When the Product Bottom Sheet (ProductBottomnav) opens (visible=true):
   - Read `storeId` from Keychain using service `storeId`.
   - If a storeId exists: set mode to `product` and dispatch `getStoreProductRequest(storeId)` exactly once to fetch products.
   - If no storeId: set mode to `url` and do not dispatch product fetch.
2. ProductBottomnav keeps products (from Redux state `storeproduct`) and passes them as props to `ProductDropdown`.
3. ProductDropdown is purely presentational:
   - Accepts `products`, `loading`, `error`, `isOpen`, `onToggle`, `onProductSelect`, `selectedProductId` props.
   - Renders dropdown header showing selected product image + name (or placeholder "Select a product"), and an arrow indicating open/closed.
   - When opened, shows a list of products (image, product name, price) and emits `onProductSelect(product)` when the user picks one.
4. ProductBottomnav handles `onApply` and `onRemove` actions and closing the sheet.

## ⚡ Quick Guidelines
- Focus on user-visible behavior: Product selection UI and where the API call happens.
- Avoid implementation detail beyond the necessary (e.g. exact Keychain API is acceptable here because it's already in the codebase).

## User Scenarios & Testing *(mandatory)*

### Primary User Story
As a user with a store configured in the app, when I open "Add Product" bottom sheet, I should see a "Select Product" dropdown. Tapping the dropdown shows my store's products (image, name, price). I should be able to pick one product which becomes applied to the post. The app should fetch products once when the sheet opens and should not perform duplicate API calls.

### Acceptance Scenarios
1. Given the user has a storeId saved in Keychain, When the ProductBottomnav opens, Then ProductBottomnav dispatches `getStoreProductRequest(storeId)` once and `ProductDropdown` displays fetched products.
2. Given the user does not have a storeId saved, When ProductBottomnav opens, Then UI defaults to `URL` mode and no product fetch is performed.
3. Given products are loading, When user opens the dropdown, Then a loading indicator is shown in the dropdown.
4. Given there is an API error, When user opens dropdown, Then an error text "Error loading products" is displayed in the dropdown.

### Edge Cases
- Network error or slow response: dropdown shows loading and then error state; ProductBottomnav should not crash.
- Empty product list: dropdown shows "No items" message.
- Keychain read fails: fall back to `url` mode and surface no products.
- Rapid open/close: ensure only one fetch is dispatched (guard by visible state and effect dependency).

## Requirements *(mandatory)*

### Functional Requirements
- FR-001: When ProductBottomnav is visible and Keychain contains a storeId, the app MUST dispatch `getStoreProductRequest(storeId)` once.
- FR-002: ProductDropdown MUST be presentational and MUST NOT call Keychain or dispatch any Redux actions.
- FR-003: ProductDropdown MUST render products with image, product name, and price as list items.
- FR-004: Selecting a product in ProductDropdown MUST invoke `onProductSelect(product)` and close the dropdown.
- FR-005: UI MUST show loading state and error state based on `loading` and `error` props.

*Marked assumptions*:
- FR-001 assumes ProductBottomnav reads Keychain synchronously on mount/open using existing Keychain API.
- FR-003 assumes product objects follow shape used in the codebase: {_id, productName, productPrice, finalPrice, productImages: [url, ...]}.

### Key Entities
- Product: {_id, productName, productPrice, finalPrice, productImages}

## Review & Acceptance Checklist

- [x] No implementation details beyond necessary Keychain call and Redux dispatch.
- [x] Focus on user value: single fetch, dropdown behavior.
- [x] Mandatory sections completed.
- [x] Requirements are testable.

## Execution Status

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked (assumptions in FR-001/FR-003)
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [ ] Review checklist passed (manual QA required)


---

Prepared for branch: `008-feature-move-product`

Spec file created at: D:\.My Project\frontend\mobile\React native\v0.79\r7\specs\008-feature-move-product\spec.md

Ready for next phase (implementation review / PR).
