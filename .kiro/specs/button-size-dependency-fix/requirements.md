# Requirements Document

## Introduction

The Button Size Dependency feature ensures proper mutual exclusivity between Store and Product button sizes in the CreatePost screen. When one component (Store or Product) is applied with a "large" size, the other component must be restricted to "small" size only, and vice versa. The UI state must accurately reflect these constraints and handle removal scenarios correctly.

## Requirements

### Requirement 1

**User Story:** As a user creating a post, I want the Store and Product button sizes to be mutually exclusive, so that only one can be large at a time while maintaining a consistent layout.

#### Acceptance Criteria

1. WHEN a user applies Store with "large" size THEN the Product button size options SHALL be restricted to "small" only
2. WHEN a user applies Product with "large" size THEN the Store button size options SHALL be restricted to "small" only
3. WHEN a user applies Store with "small" size THEN the Product button SHALL default to "large" size
4. WHEN a user applies Product with "small" size THEN the Store button SHALL default to "large" size
5. WHEN no Store or Product is applied THEN both SHALL use their default sizes (Store: large, Product: small)

### Requirement 2

**User Story:** As a user, I want the button size UI to accurately reflect the current state and constraints, so that I understand which options are available.

#### Acceptance Criteria

1. WHEN a button size is disabled due to the other component's selection THEN the disabled button SHALL be visually dimmed and non-interactive
2. WHEN a button size is selected THEN it SHALL be visually highlighted with active styling
3. WHEN a button size is available but not selected THEN it SHALL be visually normal and interactive
4. WHEN the user attempts to select a disabled button size THEN the system SHALL show an informative alert explaining why it's disabled
5. WHEN the constraint changes THEN the UI SHALL update immediately to reflect the new available options

### Requirement 3

**User Story:** As a user, I want the button size state to reset correctly when I remove Store or Product attachments, so that I can make new selections without being stuck with previous constraints.

#### Acceptance Criteria

1. WHEN a user removes an applied Store THEN the Store's size constraint SHALL be cleared from the context
2. WHEN a user removes an applied Product THEN the Product's size constraint SHALL be cleared from the context
3. WHEN a size constraint is cleared THEN the other component's button size options SHALL become available again
4. WHEN both Store and Product are removed THEN both SHALL return to their default size states
5. WHEN a constraint is cleared THEN the UI SHALL immediately update to show all available size options

### Requirement 4

**User Story:** As a user, I want the button size selection to persist correctly during the apply process, so that my choices are maintained until I explicitly change them.

#### Acceptance Criteria

1. WHEN a user selects a button size and clicks Apply THEN the selected size SHALL be committed to the context
2. WHEN a user changes the button size selection before clicking Apply THEN the pending selection SHALL be updated without affecting the applied state
3. WHEN a user cancels the bottom sheet without clicking Apply THEN the pending selection SHALL revert to the current applied state
4. WHEN the Apply operation succeeds THEN the pending selection SHALL become the new applied state
5. IF the Apply operation fails THEN the applied state SHALL remain unchanged and the user SHALL be notified

### Requirement 5

**User Story:** As a user, I want the button size dependency to work consistently across different interaction patterns, so that the behavior is predictable regardless of how I use the feature.

#### Acceptance Criteria

1. WHEN a user opens Store bottom sheet after Product is already applied THEN the Store size options SHALL reflect the Product's constraint
2. WHEN a user opens Product bottom sheet after Store is already applied THEN the Product size options SHALL reflect the Store's constraint
3. WHEN a user switches between Store and Product bottom sheets without applying THEN the constraints SHALL remain based on the last applied state
4. WHEN a user removes one component and immediately adds the other THEN the size options SHALL be unrestricted
5. WHEN the app is restarted or the screen is navigated away and back THEN the applied constraints SHALL be maintained correctly