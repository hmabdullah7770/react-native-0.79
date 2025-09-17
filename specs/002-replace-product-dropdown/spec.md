# Feature Specification: Replace product dropdown with Product bottom nav

**Feature Branch**: `002-replace-product-dropdown`  
**Created**: 2025-09-15  
**Status**: Draft  
**Input**: User description: "after the store there is a add product on which we click we have Product bottom nav (previosuely we are doing wrong in createpost we have select product drop down which we need to remove insead when the user click on add product he have two options  product and url by default select  product ueder add product there is  select the drop down for add product on which user click and the list of the product comes if there is not product show there is no item fond in drop down  also if there is no storeIid present in keychain then by defualt select url which is  and enavble the place hoder for that and keep in mind remove the select product which  is present in create postscreen beacuse we show it in productbottom nav"

## Execution Flow (main)
```
1. Parse user description from Input
   → If empty: ERROR "No feature description provided"
2. Extract key concepts: product flow, product bottom sheet, url fallback, keychain storeId, remove existing dropdown
3. Implement UI: ProductBottomnav modal/sheet that offers "Product" and "URL" modes; default mode depends on presence of storeId in keychain.
4. When Product mode selected: show a selectable product list fetched using the storeId from Keychain. If empty: show "No items found".
5. When URL mode selected: enable a text input placeholder for the URL and validate it on Apply.
6. Remove the inline `Select Product` dropdown from `CreatepostScreen` and replace activation with the Add Product action that opens the ProductBottomnav.
7. Add acceptance tests and edge-case tests.
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines
- Focus on WHAT the user needs: a better Add Product UX using a bottom-sheet that centralizes product selection and URL fallback.
- Avoid prescribing low-level implementation details (use existing components where appropriate).

## User Scenarios & Testing *(mandatory)*

### Primary User Story
As a user creating a post, when I tap "Add Product" I want a bottom sheet that lets me either choose an existing product from my store or provide a URL. If I have a store configured in the app, the sheet should default to "Product" mode and show my products; otherwise it should default to "URL" mode and present the URL input.

### Acceptance Scenarios
1. Given user has a storeId saved in Keychain, When user taps "Add Product", Then ProductBottomnav opens with "Product" pre-selected and the product list visible.

2. Given user has no storeId in Keychain, When user taps "Add Product", Then ProductBottomnav opens with "URL" pre-selected and the URL input enabled/placeholder visible.

3. Given Product mode and store products exist, When user taps a product item, Then the bottom sheet closes and the selected product is applied to the Create Post flow (CreatepostScreen receives product object/id).

4. Given Product mode and no products exist, When the product list is displayed, Then show a clear message: "No items found" and keep product selection disabled.

5. Given URL mode, When user enters an invalid URL and taps Apply, Then show a validation error and do not close the sheet.

6. Given URL mode, When user enters a valid URL and taps Apply, Then close the sheet and apply the URL to the Create Post flow.

### Edge Cases
- Keychain access fails or times out → fall back to URL mode and surface a non-blocking warning in logs.  
- Product fetch returns error → show an inline error and allow retry.  
- Long product lists → bottom sheet must support scrolling within a constrained height and maintain visibility of Apply/Remove controls.  
- Keyboard overlaps input on small devices → ensure keyboard avoiding behavior so Apply remains visible.

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: The app MUST open `ProductBottomnav` when the user taps "Add Product" in `CreatepostScreen`.
- **FR-002**: `ProductBottomnav` MUST display two modes: "Product" and "URL", with clear toggle controls.
- **FR-003**: If a `storeId` exists in Keychain, the default mode MUST be "Product"; otherwise the default mode MUST be "URL".
- **FR-004**: In Product mode, the component MUST read `storeId` from Keychain and fetch products for that store.
- **FR-005**: If fetched products array is empty, the UI MUST show "No items found" and not allow applying a product.
- **FR-006**: In URL mode, the URL input MUST be editable and validated (use basic URL validation). On validation failure, show a user-visible error.
- **FR-007**: On successful selection (product or valid URL), the component MUST call a provided callback (e.g., `onApply({type: 'product'|'url', value})`) and close.
- **FR-008**: The existing `Select Product` dropdown in `CreatepostScreen` MUST be removed to avoid duplicate UX paths.
- **FR-009**: The bottom sheet MUST support keyboard avoidance and internal scrolling for long product lists.

*Ambiguities / Needs clarification*:
- **FR-010**: [NEEDS CLARIFICATION: Should product selection support multiple selection or only single selection?]  
- **FR-011**: [NEEDS CLARIFICATION: Which product attributes are required to display in the list (name, price, thumbnail) — assume name, price, thumbnail are sufficient].

### Key Entities
- **Product**: id, productName, finalPrice/productPrice, productImages (array) — presented read-only in the picker.

---

## Review & Acceptance Checklist

### Content Quality
- [x] No implementation details beyond component responsibilities
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness
- [ ] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous where specified
- [x] Success criteria are measurable
- [x] Scope is clearly bounded (UI component + wiring to CreatepostScreen)
- [x] Dependencies and assumptions identified

---

## Execution Status
- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [ ] Review checklist passed (needs clarifications addressed)

---

## Next steps (implementation plan suggestions)
1. Implement `ProductBottomnav.jsx` component under `screens/tabNavigation/CreatePost/components/`.
   - Accept props: `visible`, `onClose`, `onApply`, `onRemove`.
   - Toggle between Product and URL modes; read `storeId` from Keychain and fetch products via existing Redux action `getStoreProductRequest` or via a new prop callback.
   - Show "No items found" when no products.
2. Update `CreatepostScreen`:
   - Remove the inline `Select Product` dropdown UI.
   - Add a state-managed `appliedProduct` or `appliedStore` and pass `onApply` to the new bottom nav.
3. Add unit / integration tests for acceptance scenarios and edge cases.
