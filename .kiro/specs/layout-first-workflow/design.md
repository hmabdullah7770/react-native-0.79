# Layout-First Media Upload Workflow Design

## Overview

This design implements a layout-first workflow for the InlineImageGrid component, where users select their desired layout before uploading media. The design prevents layout-media mismatches by locking layout options once media is uploaded and enforcing layout-specific constraints during the upload process.

## Architecture

### Component State Management

The InlineImageGrid component will manage three key states:
- `selectedLayout`: The currently selected layout option
- `selectedMedia`: Array of uploaded media items
- `layoutLocked`: Boolean indicating if layout options should be disabled

### Workflow States

1. **Initial State**: No media, all layouts available
2. **Layout Selected State**: Layout chosen, no media, upload ready
3. **Media Uploading State**: Media being added according to layout constraints
4. **Layout Locked State**: Media exists, layout options hidden/disabled
5. **Reset State**: User chooses to change layout, confirmation required

## Components and Interfaces

### Enhanced Layout Selection Interface

```jsx
// Layout selection will be conditional based on media state
const renderLayoutOptions = () => {
  // Only show when no media exists OR when explicitly unlocked
  if (selectedMedia.length > 0 && !showLayoutReset) {
    return renderLockedLayoutIndicator();
  }
  
  return renderAvailableLayouts();
};
```

### Layout Constraint Configuration

```jsx
const layoutConstraints = {
  '1': { minItems: 1, maxItems: 1, description: 'Single item only' },
  '2': { minItems: 1, maxItems: 10, description: '2+ items' },
  '2x2': { minItems: 4, maxItems: 4, description: 'Exactly 4 items' },
  '1x2': { minItems: 3, maxItems: 3, description: 'Exactly 3 items' },
  '1x3': { minItems: 4, maxItems: 4, description: 'Exactly 4 items' },
  'carousel': { minItems: 2, maxItems: 10, description: '2+ items' }
};
```

### Upload Constraint Enforcement

```jsx
const handleMediaUpload = () => {
  const currentLayout = layoutConstraints[selectedLayout];
  const currentCount = selectedMedia.length;
  
  // Check if upload is allowed
  if (currentCount >= currentLayout.maxItems) {
    showMaxItemsReachedMessage();
    return;
  }
  
  // Calculate how many more items can be added
  const remainingSlots = currentLayout.maxItems - currentCount;
  
  // Configure image picker with appropriate limits
  const options = {
    selectionLimit: Math.min(remainingSlots, 5), // Don't exceed layout or picker limits
    // ... other options
  };
  
  launchImageLibrary(options, handleUploadResponse);
};
```

## Data Models

### Layout Configuration Model

```jsx
interface LayoutConfig {
  id: string;
  label: string;
  minItems: number;
  maxItems: number | null; // null for unlimited (up to system limit)
  description: string;
  cols: number | 'carousel';
  special?: boolean; // for asymmetric layouts like 1x2, 1x3
}
```

### Component State Model

```jsx
interface InlineImageGridState {
  selectedMedia: MediaItem[];
  selectedLayout: string;
  layoutLocked: boolean;
  showLayoutReset: boolean;
  uploadProgress: {
    current: number;
    required: number;
    isComplete: boolean;
  };
}
```

## Error Handling

### Upload Constraint Violations

- **Maximum Reached**: Show alert with layout-specific message
- **Selection Limit**: Configure image picker to prevent over-selection
- **File Size/Type**: Maintain existing validation with layout-aware messaging

### Layout Change Attempts

- **With Existing Media**: Show confirmation dialog
- **Incomplete Requirements**: Prevent layout change until requirements met
- **System Errors**: Graceful fallback to previous state

## Testing Strategy

### Unit Tests

1. **Layout Constraint Enforcement**
   - Test each layout's min/max item limits
   - Verify upload blocking when limits reached
   - Test constraint validation logic

2. **State Management**
   - Test layout locking/unlocking behavior
   - Verify state transitions between workflow phases
   - Test reset functionality

3. **Upload Flow**
   - Test upload with different layout constraints
   - Verify progress tracking for fixed-item layouts
   - Test error handling for constraint violations

### Integration Tests

1. **Complete Workflow**
   - Test full layout-first workflow from selection to completion
   - Verify layout reset and restart functionality
   - Test switching between different layout types

2. **UI Consistency**
   - Test layout option visibility in different states
   - Verify progress indicators and messaging
   - Test responsive behavior across screen sizes

### User Experience Tests

1. **Layout Selection**
   - Test clarity of layout descriptions and requirements
   - Verify visual feedback for selected layouts
   - Test layout preview accuracy

2. **Upload Guidance**
   - Test progress indicators for multi-item layouts
   - Verify helpful messaging for incomplete layouts
   - Test completion feedback

## Implementation Phases

### Phase 1: Core Workflow Logic
- Implement layout locking mechanism
- Add layout constraint configuration
- Create upload constraint enforcement

### Phase 2: UI/UX Enhancements
- Update layout selection interface
- Add progress indicators and messaging
- Implement reset/change layout functionality

### Phase 3: Validation and Polish
- Add comprehensive error handling
- Implement user guidance features
- Optimize performance and accessibility

## Key Design Decisions

### Layout Locking Strategy
**Decision**: Hide layout options when media exists, show "Change Layout" button
**Rationale**: Prevents accidental layout changes while providing clear path to reset

### Constraint Enforcement Point
**Decision**: Enforce constraints at upload initiation, not during selection
**Rationale**: Allows image picker to be configured with correct limits, preventing over-selection

### Progress Communication
**Decision**: Show slot-based progress for fixed layouts, count-based for flexible layouts
**Rationale**: Matches user mental model - fixed layouts have "slots to fill", flexible layouts have "items added"

### Reset Confirmation
**Decision**: Require explicit confirmation before removing media to change layout
**Rationale**: Prevents accidental data loss while allowing workflow flexibility

## Performance Considerations

- Layout constraint checks are O(1) operations using lookup objects
- Media state updates use React's built-in optimization
- Image picker configuration is computed once per upload session
- Layout rendering uses existing optimized grid components

## Accessibility

- Layout options include proper ARIA labels with constraint information
- Progress indicators are announced to screen readers
- Confirmation dialogs follow accessibility best practices
- Keyboard navigation maintained throughout workflow