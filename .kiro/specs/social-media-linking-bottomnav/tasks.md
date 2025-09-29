# Implementation Plan

- [x] 1. Create MediaBottomnav component structure


  - Set up basic component with props interface
  - Implement modal overlay and slide animation
  - Add handle bar and header with close button
  - _Requirements: 1.1, 4.1, 4.2_



- [ ] 2. Implement social media platform configuration
  - Create platform data structure with icons and metadata
  - Build reusable platform row component

  - Add toggle switches for each platform
  - _Requirements: 2.1, 2.2, 4.3_

- [ ] 3. Add conditional input fields
  - Implement show/hide logic based on toggle states
  - Create text input components with proper styling
  - Add platform-specific placeholders and validation
  - _Requirements: 2.3, 2.4, 3.1, 3.2, 3.3, 3.4_

- [ ] 4. Implement input validation and error handling
  - Add URL validation for social media links


  - Implement phone number validation for WhatsApp
  - Show error states and feedback messages
  - _Requirements: 3.5, 3.6_



- [ ] 5. Add save functionality and state management
  - Implement Save Changes button with proper styling
  - Handle data collection and validation before saving
  - Call onApply callback with collected data
  - _Requirements: 1.5_




- [ ] 6. Integrate with CreatepostScreen
  - Add MediaBottomnav import and state management
  - Update "Link Social Media" button to open modal
  - Handle applied social media data display
  - Test modal open/close functionality
  - _Requirements: 1.1, 2.5, 4.4_

- [ ] 7. Style and polish the component
  - Apply consistent styling with other bottom navigation modals
  - Add proper spacing, colors, and typography
  - Ensure responsive design and accessibility
  - Test animations and user interactions
  - _Requirements: 4.5_