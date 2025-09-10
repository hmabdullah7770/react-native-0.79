# Design Document

## Overview

This design addresses the UI inconsistencies in the InlineImageGrid component when layout constraints should limit user actions. The main focus is on the "1" layout which should only allow a single media item, but the design will create a scalable solution for all layout constraints.

## Architecture

### Component Structure
The InlineImageGrid component will be enhanced with:
- **Layout Constraint Engine**: Logic to determine what UI elements should be shown based on current layout and media count
- **Dynamic UI Rendering**: Conditional rendering of buttons and actions based on layout constraints
- **State Management**: Enhanced state tracking for layout-specific behaviors

### Key Components
1. **Layout Configuration**: Enhanced layout options with constraint definitions
2. **UI State Calculator**: Function to determine which UI elements should be visible
3. **Conditional Rendering Logic**: Smart rendering based on layout constraints
4. **User Feedback System**: Clear messaging about layout limitations

## Components and Interfaces

### Enhanced Layout Configuration
```javascript
const layoutOptions = [
  {
    id: '1', 
    label: '1', 
    cols: 1, 
    minItems: 1, 
    maxItems: 1,  // Strict maximum for single layout
    description: 'Single item only'
  },
  {
    id: '2', 
    label: '2', 
    cols: 2, 
    minItems: 1, 
    maxItems: null,  // No maximum
    description: 'Two column layout'
  },
  // ... other layouts
];
```

### UI State Calculator Interface
```javascript
const calculateUIState = (selectedLayout, mediaCount, layoutOptions) => {
  return {
    showAddMore: boolean,
    showRemoveAll: boolean,
    removeButtonLabel: string,
    isMaxReached: boolean,
    statusMessage: string,
    canUploadMore: boolean
  };
};
```

### Layout Constraint Checker
```javascript
const checkLayoutConstraints = (layout, currentMediaCount) => {
  return {
    isValid: boolean,
    canAddMore: boolean,
    isAtMaximum: boolean,
    validationMessage: string
  };
};
```

## Data Models

### Layout Option Model
```javascript
interface LayoutOption {
  id: string;
  label: string;
  cols: number | 'carousel';
  minItems: number;
  maxItems: number | null;
  description: string;
  special?: boolean;
}
```

### UI State Model
```javascript
interface UIState {
  showAddMore: boolean;
  showRemoveAll: boolean;
  removeButtonLabel: 'Remove' | 'Remove All';
  isMaxReached: boolean;
  statusMessage: string;
  canUploadMore: boolean;
  mediaCountDisplay: string;
}
```

## Error Handling

### Layout Constraint Violations
- **Scenario**: User switches to layout "1" with multiple items uploaded
- **Handling**: Show validation error, suggest removing excess items or choosing different layout
- **UI Response**: Highlight constraint violation with clear messaging

### Maximum Items Reached
- **Scenario**: User tries to upload more items when layout maximum is reached
- **Handling**: Prevent upload action, show informative message
- **UI Response**: Hide upload options, show "Maximum reached" status

### State Inconsistencies
- **Scenario**: Layout state becomes inconsistent with media count
- **Handling**: Auto-correct to valid state, log warning for debugging
- **UI Response**: Smooth transition to corrected state

## Testing Strategy

### Unit Tests
1. **Layout Constraint Logic**
   - Test `calculateUIState` with various layout/media combinations
   - Verify correct UI state for each layout type
   - Test edge cases (0 items, maximum items, invalid states)

2. **UI Rendering Logic**
   - Test conditional rendering of buttons
   - Verify correct button labels and states
   - Test layout switching behavior

3. **State Management**
   - Test state updates when media is added/removed
   - Test layout switching with existing media
   - Test constraint validation

### Integration Tests
1. **User Workflows**
   - Test complete upload flow for layout "1"
   - Test switching between layouts with different constraints
   - Test remove functionality with single vs multiple items

2. **Error Scenarios**
   - Test constraint violations
   - Test maximum item scenarios
   - Test invalid state recovery

### Visual Tests
1. **UI Consistency**
   - Verify button visibility for each layout
   - Test status message accuracy
   - Verify layout option descriptions

## Implementation Approach

### Phase 1: Layout Constraint Engine
1. Enhance layout options with constraint definitions
2. Create `calculateUIState` utility function
3. Create `checkLayoutConstraints` utility function

### Phase 2: Conditional UI Rendering
1. Update `renderSingleColumn` to respect constraints
2. Modify header rendering logic for dynamic button display
3. Update media count display logic

### Phase 3: User Feedback Enhancement
1. Add constraint-aware status messages
2. Enhance layout option descriptions
3. Add validation error displays

### Phase 4: State Management Updates
1. Update media upload handler to check constraints
2. Enhance layout switching logic
3. Add constraint validation to state changes

## Key Design Decisions

### Single Source of Truth for Constraints
- All layout constraints defined in `layoutOptions` configuration
- UI state calculated from this single source
- Prevents inconsistencies between different parts of the component

### Progressive Enhancement
- Existing functionality remains intact
- New constraint logic adds on top of existing behavior
- Backward compatibility maintained

### Clear User Communication
- Status messages clearly explain current state
- Button labels accurately reflect available actions
- Layout descriptions help users understand constraints

### Performance Considerations
- UI state calculations are lightweight
- Constraint checks happen only when needed
- No unnecessary re-renders from state changes