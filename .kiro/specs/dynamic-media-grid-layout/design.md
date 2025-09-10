# Dynamic Media Grid Layout Design

## Overview

This design addresses the core issue where the InlineImageGrid component fails to properly render uploaded media according to selected layout options. The solution involves refactoring the layout rendering logic to dynamically arrange actual uploaded images instead of showing placeholder blue boxes.

## Architecture

### Component Structure
```
InlineImageGrid
├── Layout Selection Logic
├── Dynamic Grid Renderer
├── Layout-Specific Renderers
│   ├── SingleColumnRenderer
│   ├── TwoColumnRenderer  
│   ├── GridRenderer (2x2)
│   ├── AsymmetricRenderer (1x2, 1x3)
│   └── CarouselRenderer
└── Layout Validation Engine
```

### Key Design Principles
1. **Immediate Visual Feedback**: Layout changes reflect instantly in the media grid
2. **Actual Image Rendering**: Always show real uploaded images, never placeholder boxes
3. **Layout Fidelity**: Preview exactly matches final output
4. **Graceful Degradation**: Handle edge cases (insufficient/excess images)

## Components and Interfaces

### 1. Enhanced Layout Renderer

**Purpose**: Dynamically render uploaded media according to selected layout

**Key Methods**:
```javascript
renderMediaGrid() {
  // Main orchestrator that delegates to specific layout renderers
  switch (selectedLayout) {
    case '1': return renderSingleColumn();
    case '2': return renderTwoColumn();
    case '2x2': return renderGrid();
    case '1x2': return renderAsymmetric('1x2');
    case '1x3': return renderAsymmetric('1x3');
    case 'carousel': return renderCarousel();
  }
}
```

### 2. Layout-Specific Renderers

#### Single Column Renderer
- Renders images at 100% width
- Stacks vertically with consistent spacing
- Maintains aspect ratios

#### Two Column Renderer  
- Renders images at 48% width each
- Alternates left/right positioning
- Handles odd numbers of images gracefully

#### Grid Renderer (2x2)
- Renders exactly 4 images in 2x2 formation
- Each image takes 48% width and fixed height
- Shows placeholders for missing images

#### Asymmetric Renderer (1x2, 1x3)
- First image: 62% width, full height
- Remaining images: 35% width, divided height
- Special container structure for proper alignment

#### Carousel Renderer
- Horizontal scrolling container
- Fixed width images (200px)
- Infinite scroll capability

### 3. Layout Validation Engine

**Purpose**: Ensure uploaded media count matches layout requirements

**Validation Rules**:
```javascript
const layoutValidation = {
  '1': { minItems: 1, maxItems: null },
  '2': { minItems: 1, maxItems: null },
  '2x2': { minItems: 4, maxItems: 4 },
  '1x2': { minItems: 3, maxItems: 3 },
  '1x3': { minItems: 4, maxItems: 4 },
  'carousel': { minItems: 2, maxItems: null }
};
```

## Data Models

### Media Item Model
```javascript
{
  uri: string,           // Image/video URI
  type: string,          // MIME type
  fileName: string,      // Original filename
  fileSize: number,      // File size in bytes
  isVideo: boolean,      // Video flag
  dimensions?: {         // Optional dimensions
    width: number,
    height: number
  }
}
```

### Layout Configuration Model
```javascript
{
  id: string,           // Layout identifier
  label: string,        // Display name
  cols: number|string,  // Column count or 'carousel'
  minItems: number,     // Minimum required images
  maxItems: number|null,// Maximum allowed images
  renderer: string      // Renderer function name
}
```

## Error Handling

### Layout Validation Errors
- **Insufficient Images**: Show placeholder areas with upload prompts
- **Excess Images**: Hide overflow images or show warning
- **Invalid Layout**: Fall back to single column layout

### Image Loading Errors
- **Failed Load**: Show error placeholder with retry option
- **Slow Loading**: Show loading spinner
- **Invalid Format**: Show format error message

### Layout Rendering Errors
- **Calculation Errors**: Fall back to default sizing
- **Container Overflow**: Apply automatic scaling
- **Memory Issues**: Implement image optimization

## Testing Strategy

### Unit Tests
- Layout calculation functions
- Image sizing algorithms  
- Validation logic
- Error handling scenarios

### Integration Tests
- Layout switching with real images
- Upload flow with different layouts
- Responsive behavior testing
- Performance with multiple images

### Visual Regression Tests
- Screenshot comparison for each layout
- Cross-device layout consistency
- Animation and transition testing

## Performance Considerations

### Image Optimization
- Lazy loading for carousel layouts
- Image compression for large files
- Thumbnail generation for previews
- Memory management for multiple images

### Rendering Optimization
- Memoization of layout calculations
- Efficient re-rendering on layout changes
- Debounced layout updates
- Virtual scrolling for large carousels

### Memory Management
- Image cleanup on component unmount
- Efficient state updates
- Garbage collection of unused images
- Progressive loading strategies

## Implementation Notes

### Critical Fixes Required

1. **Remove Blue Box Placeholders**: The current implementation shows blue boxes from LayoutOptionStyles when it should show actual uploaded images

2. **Fix Layout Switching**: When users change layouts, the grid should immediately rearrange existing images, not show layout preview boxes

3. **Implement Proper Sizing**: Each layout needs specific width/height calculations that work with real images

4. **Add Missing Image Handling**: When layouts require more images than uploaded, show proper upload prompts instead of blue boxes

### Key Changes Needed

1. **renderMediaGrid() Function**: Complete refactor to handle actual image rendering per layout
2. **Layout-Specific Logic**: Separate rendering logic for each layout type
3. **Dynamic Sizing**: Real-time calculation of image dimensions based on layout
4. **State Management**: Proper handling of layout changes with existing media

This design ensures that users see their actual uploaded images arranged according to their selected layout, providing an accurate preview of the final result.