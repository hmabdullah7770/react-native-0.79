# Design Document

## Overview

The MediaBottomnav component is a bottom modal that allows users to link their social media accounts when creating posts. It follows the same design patterns as other bottom navigation components in the app (RecorderBottomnav, StoreBottomnav, ProductBottomnav) for consistency.

## Architecture

### Component Structure
- **MediaBottomnav.jsx** - Main modal component with social media linking interface
- **Integration with CreatepostScreen.js** - Modal trigger and state management

### Design Patterns
- Bottom sheet modal with slide-up animation
- Toggle-based interface for enabling/disabling platforms
- Conditional input field rendering
- Consistent styling with existing bottom navigation components

## Components and Interfaces

### MediaBottomnav Component

**Props Interface:**
```javascript
{
  visible: boolean,           // Controls modal visibility
  onClose: function,          // Callback when modal is closed
  onApply: function,          // Callback when changes are saved
  initialData?: object        // Pre-populated social media data
}
```

**State Management:**
```javascript
{
  socialMediaData: {
    facebook: { enabled: boolean, link: string },
    instagram: { enabled: boolean, link: string },
    whatsapp: { enabled: boolean, number: string },
    storeLink: { enabled: boolean, url: string }
  }
}
```

### Platform Configuration
Each social media platform includes:
- Icon (using react-native-vector-icons)
- Platform name and description
- Toggle switch for enable/disable
- Conditional text input field
- Input validation and placeholder text

## Data Models

### Social Media Data Structure
```javascript
const socialMediaData = {
  facebook: {
    enabled: false,
    link: '',
    icon: 'facebook',
    iconColor: '#1877F2',
    placeholder: 'Enter Facebook link',
    title: 'Facebook',
    description: 'Link your Facebook page'
  },
  instagram: {
    enabled: false,
    link: '',
    icon: 'instagram',
    iconColor: '#E4405F',
    placeholder: 'Enter Instagram link',
    title: 'Instagram',
    description: 'Link your Instagram profile'
  },
  whatsapp: {
    enabled: false,
    number: '',
    icon: 'whatsapp',
    iconColor: '#25D366',
    placeholder: 'Enter WhatsApp number',
    title: 'WhatsApp',
    description: 'Connect your WhatsApp'
  },
  storeLink: {
    enabled: false,
    url: '',
    icon: 'store',
    iconColor: '#666',
    placeholder: 'Enter store link',
    title: 'Store Link',
    description: 'Add your online store URL'
  }
}
```

## Error Handling

### Input Validation
- URL validation for Facebook, Instagram, and Store Link fields
- Phone number format validation for WhatsApp
- Real-time validation feedback with error states
- Prevent saving with invalid data

### Error States
- Invalid URL format indicators
- Network connectivity error handling
- Graceful fallback for missing icons or resources

## Testing Strategy

### Unit Tests
- Component rendering with different prop combinations
- Toggle functionality for each platform
- Input validation logic
- Save/cancel functionality

### Integration Tests
- Modal open/close behavior
- Data persistence between modal sessions
- Integration with CreatepostScreen parent component

### User Experience Tests
- Smooth animations and transitions
- Responsive touch interactions
- Accessibility compliance (screen readers, keyboard navigation)
- Cross-platform consistency (iOS/Android)

## Implementation Notes

### Styling Consistency
- Follow existing bottom navigation modal patterns
- Use consistent colors, spacing, and typography
- Maintain visual hierarchy with icons, titles, and descriptions
- Responsive design for different screen sizes

### Performance Considerations
- Lazy loading of social media icons
- Efficient re-rendering with React.memo if needed
- Minimal state updates during typing
- Optimized animation performance

### Accessibility
- Proper ARIA labels for screen readers
- Keyboard navigation support
- High contrast color combinations
- Touch target size compliance (minimum 44px)