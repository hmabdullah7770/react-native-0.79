# Requirements Document

## Introduction

This feature adds a social media linking bottom navigation modal to the CreatePost screen that allows users to connect their social media accounts and store links. The modal provides toggles for each platform and input fields for entering profile links or contact information.

## Requirements

### Requirement 1

**User Story:** As a user creating a post, I want to link my social media accounts so that viewers can connect with me on different platforms.

#### Acceptance Criteria

1. WHEN the user taps "Link Social Media" button THEN the system SHALL display a bottom modal with social media options
2. WHEN the modal opens THEN the system SHALL show Facebook, Instagram, WhatsApp, and Store Link options
3. WHEN the user toggles a social media platform THEN the system SHALL show/hide the corresponding input field
4. WHEN the user enters valid social media links THEN the system SHALL store the information for the post
5. WHEN the user taps "Save Changes" THEN the system SHALL apply the social media links and close the modal

### Requirement 2

**User Story:** As a user, I want to toggle individual social media platforms on/off so that I can control which platforms are linked to my post.

#### Acceptance Criteria

1. WHEN the user sees the social media modal THEN the system SHALL display toggle switches for each platform
2. WHEN a toggle is OFF THEN the system SHALL hide the input field for that platform
3. WHEN a toggle is ON THEN the system SHALL show the input field for that platform
4. WHEN the user toggles a switch THEN the system SHALL immediately show/hide the corresponding input field
5. WHEN the modal is closed and reopened THEN the system SHALL remember the previous toggle states

### Requirement 3

**User Story:** As a user, I want to enter my social media profile information so that others can find and connect with me.

#### Acceptance Criteria

1. WHEN Facebook toggle is enabled THEN the system SHALL show a text input for Facebook page link
2. WHEN Instagram toggle is enabled THEN the system SHALL show a text input for Instagram profile link
3. WHEN WhatsApp toggle is enabled THEN the system SHALL show a text input for WhatsApp number
4. WHEN Store Link toggle is enabled THEN the system SHALL show a text input for online store URL
5. WHEN the user enters text in any field THEN the system SHALL validate the input format
6. WHEN invalid input is detected THEN the system SHALL show appropriate error feedback

### Requirement 4

**User Story:** As a user, I want the modal to have a clean, intuitive interface so that I can easily manage my social media links.

#### Acceptance Criteria

1. WHEN the modal opens THEN the system SHALL slide up from the bottom with smooth animation
2. WHEN the user taps outside the modal THEN the system SHALL close the modal
3. WHEN the modal displays THEN the system SHALL show platform icons, names, descriptions, and toggles
4. WHEN the user interacts with the modal THEN the system SHALL provide visual feedback for all actions
5. WHEN the modal is displayed THEN the system SHALL use consistent styling with other bottom navigation modals