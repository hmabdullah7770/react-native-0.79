# Requirements Document

## Introduction

This feature addresses UI inconsistencies in the InlineImageGrid component when the "1" layout is selected. Currently, when users select the single-item layout (layout "1"), the interface incorrectly shows "Add More" and "Remove All" buttons, which contradicts the single-item constraint of this layout.

## Requirements

### Requirement 1

**User Story:** As a user selecting the "1" layout option, I want the interface to reflect that only one media item is allowed, so that the UI is consistent with the layout constraints.

#### Acceptance Criteria

1. WHEN layout "1" is selected AND one media item is uploaded THEN the "Add More" button SHALL NOT be displayed
2. WHEN layout "1" is selected AND one media item is uploaded THEN the "Remove All" button SHALL be replaced with a single "Remove" action
3. WHEN layout "1" is selected AND no media is uploaded THEN only the initial upload placeholder SHALL be shown
4. WHEN layout "1" is selected AND the maximum items (1) is reached THEN no additional upload options SHALL be available

### Requirement 2

**User Story:** As a user with layout "1" selected, I want clear visual feedback about the single-item constraint, so that I understand the layout limitations.

#### Acceptance Criteria

1. WHEN layout "1" is selected THEN the layout description SHALL indicate "Single item only"
2. WHEN layout "1" is selected AND one item is uploaded THEN the media count SHALL show "1 item (max reached)" or similar indication
3. WHEN hovering over layout "1" option THEN a tooltip SHALL show "Upload one photo or video"

### Requirement 3

**User Story:** As a user, I want consistent behavior across all layout options, so that each layout properly enforces its constraints.

#### Acceptance Criteria

1. WHEN any layout with maximum item constraints is selected AND maximum is reached THEN no "Add More" options SHALL be displayed
2. WHEN any layout has only one item uploaded THEN "Remove All" SHALL be replaced with "Remove" for single items
3. WHEN switching between layouts THEN the UI SHALL immediately reflect the new layout's constraints
4. IF current media count exceeds new layout's maximum THEN a validation message SHALL be shown

### Requirement 4

**User Story:** As a user, I want the remove functionality to be contextually appropriate, so that the action matches the number of items present.

#### Acceptance Criteria

1. WHEN only one media item exists THEN the remove action SHALL be labeled "Remove" instead of "Remove All"
2. WHEN multiple media items exist THEN the remove action SHALL be labeled "Remove All"
3. WHEN removing the last item in layout "1" THEN the interface SHALL return to the upload placeholder state
4. WHEN removing an item THEN the layout constraints SHALL be re-evaluated and UI updated accordingly