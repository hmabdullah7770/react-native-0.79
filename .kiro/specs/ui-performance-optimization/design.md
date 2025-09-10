# Design Document

## Overview

This design document outlines the implementation approach for replacing ScrollView components with FlashList in the InlineImageGrid component to improve performance when rendering media items and layout options. The optimization focuses on efficient list rendering while maintaining all existing functionality and visual appearance.

## Architecture

### Current Architecture
- **ScrollView for Media Grid**: Currently uses ScrollView with flexWrap for displaying media items in various layouts (1, 2, 2x2, 1x2, 1x3, carousel)
- **ScrollView for Layout Options**: Uses horizontal ScrollView for layout selection buttons
- **Dynamic Layout Rendering**: Complex layout logic with conditional rendering based on selected layout type

### Proposed Architecture
- **FlashList for Media Grid**: Replace ScrollView with FlashList for efficient rendering of media items
- **FlashList for Layout Options**: Replace horizontal ScrollView with horizontal FlashList for layout buttons
- **Optimized Item Rendering**: Implement proper item sizing and layout calculations for FlashList
- **Maintained Layout Logic**: Preserve all existing layout types and their visual appearance

## Components and Interfaces

### FlashList Integration

#### Media Grid FlashList
```typescript
interface MediaGridFlashListProps {
  data: MediaItem[]
  selectedLayout: string
  onRemoveMedia: (index: number) => void
  onVideoClick: () => void
  onAddMore: () => void
}

interface MediaItem {
  uri: string
  type: string
  fileName: string
  fileSize: number
  isVideo: boolean
}
```

#### Layout Options FlashList
```typescript
interface LayoutOptionsFlashListProps {
  data: LayoutOption[]
  selectedLayout: string
  onLayoutSelect: (layoutId: string) => void
  selectedMediaCount: number
}

interface LayoutOption {
  id: string
  label: string
  cols: number | 'carousel'
  minItems: number
  maxItems: number | null
}
```

### Layout Calculations

#### Dynamic Item Sizing
- **Single Column (Layout '1')**: Full width items
- **Two Column (Layout '2', '2x2')**: 48% width with 4% margin
- **Special Layouts (1x2, 1x3)**: Custom sizing with main image (62%) and side images (35%)
- **Carousel Layout**: Fixed width items (200px) with horizontal scrolling

#### FlashList Configuration
```typescript
const getItemLayout = (layoutType: string, index: number) => {
  switch (layoutType) {
    case '1':
      return { length: 120, offset: 128 * index, index }
    case '2':
    case '2x2':
      return { length: 120, offset: 128 * Math.floor(index / 2), index }
    case 'carousel':
      return { length: 200, offset: 208 * index, index }
    default:
      return { length: 120, offset: 128 * index, index }
  }
}
```

## Data Models

### Enhanced Media Item Model
```typescript
interface EnhancedMediaItem extends MediaItem {
  id: string // Add unique identifier for FlashList keyExtractor
  layoutWidth: string | number // Calculated width based on layout
  layoutHeight: number // Calculated height based on layout
  marginRight: number // Calculated margin for layout
}
```

### Layout Configuration Model
```typescript
interface LayoutConfiguration {
  id: string
  label: string
  cols: number | 'carousel'
  minItems: number
  maxItems: number | null
  itemWidth: (index: number, totalItems: number) => string | number
  itemHeight: (index: number, totalItems: number) => number
  numColumns?: number // For FlashList numColumns prop
}
```

## Error Handling

### FlashList Error Scenarios
1. **Empty Data Handling**: Gracefully handle empty arrays with proper fallback UI
2. **Item Size Calculation Errors**: Provide default dimensions when calculations fail
3. **Layout Transition Errors**: Smooth transitions between different layout types
4. **Memory Management**: Proper cleanup of FlashList instances on component unmount

### Fallback Strategy
- Implement error boundaries around FlashList components
- Fallback to ScrollView if FlashList fails to render
- Log performance metrics and errors for monitoring

## Testing Strategy

### Performance Testing
1. **Render Performance**: Measure render times with varying numbers of media items (10, 50, 100+)
2. **Memory Usage**: Monitor memory consumption during scrolling and layout changes
3. **Frame Rate**: Ensure consistent 60fps during scrolling operations
4. **Device Testing**: Test on various device specifications (low-end to high-end)

### Functional Testing
1. **Layout Preservation**: Verify all layout types render correctly with FlashList
2. **Interaction Testing**: Ensure all touch interactions (remove, add, select) work properly
3. **State Management**: Verify state updates trigger proper re-renders
4. **Edge Cases**: Test with single items, maximum items, and layout transitions

### Integration Testing
1. **Component Integration**: Test FlashList integration with existing BottomNav and other components
2. **Props Compatibility**: Ensure all existing props continue to work
3. **Callback Functions**: Verify all callback functions (onMediaChange, onClose) work correctly
4. **Style Consistency**: Ensure visual appearance matches current implementation

## Implementation Phases

### Phase 1: Media Grid FlashList
- Replace main media grid ScrollView with FlashList
- Implement proper item sizing for standard layouts (1, 2, 2x2)
- Maintain existing remove and add functionality

### Phase 2: Special Layout Support
- Implement complex layouts (1x2, 1x3) with FlashList
- Handle carousel layout with horizontal FlashList
- Ensure proper spacing and alignment

### Phase 3: Layout Options FlashList
- Replace layout options ScrollView with horizontal FlashList
- Maintain existing selection and validation logic
- Optimize rendering of layout option buttons

### Phase 4: Performance Optimization
- Fine-tune FlashList configurations for optimal performance
- Implement proper item recycling and memory management
- Add performance monitoring and metrics

## Dependencies

### Required Packages
- `@shopify/flash-list`: Latest stable version for performant list rendering
- Existing dependencies: `react-native-vector-icons`, `react-native-image-picker`

### Compatibility Requirements
- React Native 0.79.2 compatibility
- iOS and Android platform support
- Existing component prop interface compatibility