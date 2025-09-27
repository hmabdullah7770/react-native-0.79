# Design Document

## Overview

The Button Size Dependency Fix addresses the mutual exclusivity constraints between Store and Product button sizes in the CreatePost screen. The current implementation has several issues:

1. UI state doesn't properly reflect constraints when items are removed
2. Disabled buttons can sometimes appear selected
3. Context state isn't properly cleared when components are removed
4. Pending vs applied state management is inconsistent

This design provides a robust solution that ensures proper state management, UI consistency, and user experience.

## Architecture

### State Management Flow

```
CreatePostContext (Global State)
├── appliedLargeBy: 'store' | 'product' | null
├── applySize(which, size) - commits size selection
├── clearApplied(which) - removes applied constraint
├── getAppliedSizeFor(which) - gets effective size
└── isLargeDisabled(which) - checks if large is disabled

Component Local State (Pending)
├── pendingSize: 'large' | 'small'
├── setPendingSize() - updates local selection
└── Syncs with context on mount/context changes
```

### Constraint Logic

The mutual exclusivity follows these rules:
- Only one component can have "large" size at a time
- When one is "large", the other must be "small"
- Default sizes: Store = "large", Product = "small"
- Constraints only apply after clicking "Apply"

## Components and Interfaces

### Enhanced CreatePostContext

```typescript
interface CreatePostContextType {
  appliedLargeBy: 'store' | 'product' | null;
  applySize: (which: 'store' | 'product', size: 'large' | 'small') => void;
  clearApplied: (which: 'store' | 'product') => void;
  resetApplied: () => void;
  getAppliedSizeFor: (which: 'store' | 'product') => 'large' | 'small';
  isLargeDisabled: (which: 'store' | 'product') => boolean;
}
```

**Key Improvements:**
- `clearApplied()` properly handles removal scenarios
- `getAppliedSizeFor()` returns consistent default sizes
- `isLargeDisabled()` accurately reflects constraints

### StoreBottomnav Component Updates

```typescript
interface StoreBottomnavState {
  pendingSize: 'large' | 'small';
  setPendingSize: (size: 'large' | 'small') => void;
}
```

**Key Changes:**
1. **Proper State Sync**: `pendingSize` syncs with context on mount and context changes
2. **Remove Handler**: Calls `clearApplied('store')` and resets `pendingSize` to default
3. **Apply Handler**: Only calls `applySize()` after successful parent apply
4. **UI State**: Disabled buttons are properly styled and non-interactive

### ProductBottomnav Component Updates

```typescript
interface ProductBottomnavState {
  pendingSize: 'large' | 'small';
  setPendingSize: (size: 'large' | 'small') => void;
}
```

**Key Changes:**
1. **Proper State Sync**: Same pattern as StoreBottomnav
2. **Remove Handler**: Calls `clearApplied('product')` and resets `pendingSize` to default
3. **Apply Handler**: Coordinates with parent apply before context update
4. **UI State**: Consistent disabled/active button styling

## Data Models

### Context State Model

```typescript
type AppliedLargeBy = 'store' | 'product' | null;

interface ContextState {
  appliedLargeBy: AppliedLargeBy;
}

// Size calculation logic
function getAppliedSizeFor(which: 'store' | 'product', appliedLargeBy: AppliedLargeBy): 'large' | 'small' {
  if (appliedLargeBy) {
    return appliedLargeBy === which ? 'large' : 'small';
  }
  // Default sizes when nothing is applied
  return which === 'store' ? 'large' : 'small';
}

function isLargeDisabled(which: 'store' | 'product', appliedLargeBy: AppliedLargeBy): boolean {
  const other = which === 'store' ? 'product' : 'store';
  return appliedLargeBy === other;
}
```

### Component State Model

```typescript
interface ComponentState {
  pendingSize: 'large' | 'small';
  largeDisabled: boolean;
  appliedSize: 'large' | 'small';
}

// State derivation
function deriveComponentState(
  which: 'store' | 'product',
  appliedLargeBy: AppliedLargeBy
): ComponentState {
  const appliedSize = getAppliedSizeFor(which, appliedLargeBy);
  const largeDisabled = isLargeDisabled(which, appliedLargeBy);
  
  return {
    pendingSize: appliedSize, // Start with applied size
    largeDisabled,
    appliedSize
  };
}
```

## Error Handling

### UI State Consistency

1. **Stale State Prevention**: Use `useEffect` to sync `pendingSize` with context changes
2. **Error Boundaries**: Wrap context operations in try-catch blocks
3. **Fallback Values**: Provide sensible defaults when context is unavailable
4. **User Feedback**: Show alerts when operations fail

### Remove Operation Safety

```typescript
const handleRemove = () => {
  try {
    // Clear context constraint
    clearApplied(which);
    
    // Reset local state to default
    const defaultSize = which === 'store' ? 'large' : 'small';
    setPendingSize(defaultSize);
    
    // Notify parent
    onRemove && onRemove();
    onClose && onClose();
  } catch (error) {
    console.warn('Error during remove operation:', error);
    // Still proceed with removal to avoid stuck state
    onRemove && onRemove();
    onClose && onClose();
  }
};
```

### Apply Operation Safety

```typescript
const handleApply = async () => {
  try {
    // Parent apply first (may throw)
    await parentApplyHandler();
    
    // Only update context if parent succeeded
    applySize(which, pendingSize);
  } catch (error) {
    console.warn('Apply error:', error);
    Alert.alert('Error', 'Failed to apply changes. Please try again.');
    // Don't update context on failure
  }
};
```

## Testing Strategy

### Unit Tests

1. **Context Logic Tests**
   - Test `getAppliedSizeFor()` with all combinations
   - Test `isLargeDisabled()` constraint logic
   - Test `clearApplied()` state transitions

2. **Component State Tests**
   - Test `pendingSize` synchronization
   - Test button disable/enable logic
   - Test remove operation state reset

### Integration Tests

1. **Cross-Component Interaction**
   - Apply Store large → Product should be restricted to small
   - Apply Product large → Store should be restricted to small
   - Remove Store → Product constraints should be cleared

2. **UI State Consistency**
   - Disabled buttons should be non-interactive
   - Active buttons should be properly highlighted
   - State changes should update UI immediately

### Edge Case Tests

1. **Rapid State Changes**
   - Quick apply/remove operations
   - Switching between components rapidly
   - Context updates during pending operations

2. **Error Recovery**
   - Failed apply operations
   - Context unavailable scenarios
   - Invalid state recovery

## Implementation Notes

### Critical Fixes

1. **State Synchronization**: Use `useEffect` to keep `pendingSize` in sync with context
2. **Remove Operation**: Always call `clearApplied()` and reset to defaults
3. **UI Consistency**: Disabled buttons must be visually distinct and non-interactive
4. **Error Handling**: Graceful degradation when operations fail

### Performance Considerations

1. **Minimal Re-renders**: Only update state when necessary
2. **Memoization**: Use `useCallback` for event handlers
3. **Efficient Updates**: Batch state updates where possible

### Accessibility

1. **Screen Reader Support**: Disabled buttons should announce their state
2. **Visual Indicators**: Clear visual distinction between states
3. **User Feedback**: Informative alerts for constraint violations