# Feature Specification: Keyboard avoidance for Store & Product bottom sheets

**Feature Branch**: `003-title-keyboard-avoidance`  
**Created**: 2025-09-15  
**Status**: Draft  
**Input**: User description: "Ensure Store and Product bottom sheets move above the keyboard, fix copy/paste and typing glitches in URL input, implement keyboard-controller if needed."

## Execution Flow (main)
```
1. Parse user description from Input
   → If empty: ERROR "No feature description provided"
2. Extract key concepts from description
   → Identify: actors (mobile user), actions (open bottom sheet, type/paste URL, press Apply), data (url string, pending/applied button-size), constraints (keyboard covers sheet, paste not working reliably)
3. For each unclear aspect:
   → Mark with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
   → If no clear user flow: ERROR "Cannot determine user scenarios"
5. Generate Functional Requirements
   → Each requirement must be testable
6. Identify Key Entities (if data involved)
7. Run Review Checklist
   → If any [NEEDS CLARIFICATION]: WARN "Spec has uncertainties"
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for product and QA teams

## User Scenarios & Testing

### Primary User Story
As a mobile user creating a post, I can open the Store or Product bottom sheet, type or paste a URL into the URL input reliably, and see the input (sheet shifts above the keyboard) so I can finish entering data and apply settings without the keyboard covering the inputs.

### Acceptance Scenarios
1. Given the bottom sheet (Store/Product) is open, when I tap the URL mode and the keyboard opens, then the bottom sheet must shift up so the URL input remains visible and editable.
2. Given I copy a URL from another app, when I long-press the URL input and paste, then the paste should insert the text into the input reliably.
3. Given the keyboard is open and I type, the caret and typed text must remain visible (no clipping or jumpy behavior).
4. Given I press Apply after changing button sizes or URL, the sheet closes after the Apply action and the applied state should be saved.

### Edge Cases
- When keyboard type is different (numeric vs url vs default), sheet must still move to keep input visible.
- When hardware/software clipboard content is large, paste should not crash the input and should still insert text (possibly trimmed by validation later).
- When device orientation changes while keyboard is open, sheet position should update appropriately.

## Requirements

### Functional Requirements
- **FR-001**: The app MUST ensure the Store and Product bottom sheets move above the keyboard when an input inside the sheet receives focus.
- **FR-002**: The URL TextInput inside both sheets MUST accept pasted text reliably from the clipboard.
- **FR-003**: The URL TextInput MUST validate URL format before Apply and show a helpful error message if invalid.
- **FR-004**: Keyboard open/close transitions MUST animate the sheet so movement is smooth and non-jarring.
- **FR-005**: The existing button-size pending selection behavior (free selection until Apply) MUST remain unchanged; only the applied lock concept changes state on Apply.

### Non-functional Requirements
- **NFR-001**: UI animations for sheet movement MUST be smooth (approx 200–350ms) to not feel janky.
- **NFR-002**: Changes MUST work on both iOS and Android devices supported by RN 0.79.

### Implementation Notes (for developers)
- Uses mobile keyboard events to measure keyboard height and animate the sheet translateY.
- Optionally use `react-native-keyboard-controller` (already installed) to get reliable keyboard height/visibility callbacks across platforms; fallback to React Native's Keyboard API if not available.

## Key Entities
- **BottomSheet**: transient UI element with inputs (URL) and controls (Apply/Remove, button-size toggles).
- **URL Input**: text field inside BottomSheet, validated as URL when Apply is pressed.

## Review & Acceptance Checklist

### Content Quality
- [x] No implementation details beyond optional library mention
- [x] Focused on user value and business needs
- [x] All mandatory sections completed

### Requirement Completeness
- [ ] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable

## Execution Status

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked (none critical)
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist passed

---

Prepared for development. Branch: `003-title-keyboard-avoidance`.
