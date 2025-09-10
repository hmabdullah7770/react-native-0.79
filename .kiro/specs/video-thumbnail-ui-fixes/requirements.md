# Video Thumbnail UI Fixes - Requirements Document

## Introduction

This specification addresses critical UI/UX issues in the video thumbnail upload functionality within the InlineImageGrid component. The current implementation has several problems: the bottom navigation modal overflows and covers other UI elements, thumbnail upload options appear incorrectly positioned, and uploaded thumbnails are not properly displayed over their corresponding videos in the media grid.

## Requirements

### Requirement 1: Bottom Navigation Modal Z-Index and Positioning

**User Story:** As a user, I want the video settings bottom navigation to appear properly above all other UI elements without being covered or covering critical interface components.

#### Acceptance Criteria

1. WHEN the video settings modal is opened THEN the modal SHALL appear with proper z-index layering above all other components
2. WHEN the modal is displayed THEN it SHALL NOT overflow or be covered by other UI elements
3. WHEN the modal is open THEN the backdrop SHALL properly cover the entire screen behind the modal
4. WHEN the modal slides up THEN the animation SHALL be smooth and not cause visual glitches

### Requirement 2: Thumbnail Upload Button Positioning

**User Story:** As a user, I want the thumbnail upload button to be properly positioned within the video settings modal and not interfere with other options.

#### Acceptance Criteria

1. WHEN the video settings modal opens THEN the "Upload Thumbnail" button SHALL be positioned at the top of the options list
2. WHEN other options are present THEN they SHALL appear below the thumbnail upload option with proper spacing
3. WHEN the thumbnail upload button is pressed THEN it SHALL not cause layout shifts in other options
4. WHEN the modal content exceeds the available height THEN it SHALL scroll properly without affecting button positioning

### Requirement 3: Thumbnail Display Over Videos

**User Story:** As a user, I want to see my uploaded custom thumbnail displayed over the video in the media grid instead of the default video overlay.

#### Acceptance Criteria

1. WHEN a user uploads a custom thumbnail for a video THEN the thumbnail image SHALL be displayed over the video in the media grid
2. WHEN a custom thumbnail is set THEN the default video play icon overlay SHALL be replaced with the custom thumbnail
3. WHEN a user taps on a video with a custom thumbnail THEN the video settings modal SHALL still be accessible
4. WHEN a custom thumbnail is removed THEN the video SHALL revert to showing the default video overlay with play icon
5. WHEN multiple videos have custom thumbnails THEN each video SHALL display its respective custom thumbnail correctly

### Requirement 4: Video Settings Modal State Management

**User Story:** As a user, I want the video settings to persist correctly and reflect the current state of each video's configuration.

#### Acceptance Criteria

1. WHEN a user opens video settings for a specific video THEN the modal SHALL show the current settings for that video
2. WHEN a user uploads a thumbnail THEN the thumbnail SHALL be associated with the correct video
3. WHEN multiple videos are present THEN each video SHALL maintain its own independent thumbnail and settings
4. WHEN a video is removed from the grid THEN its associated thumbnail and settings SHALL be cleaned up
5. WHEN the modal is closed and reopened THEN the previously set thumbnail SHALL still be displayed in the settings

### Requirement 5: Visual Feedback and User Experience

**User Story:** As a user, I want clear visual feedback when interacting with video thumbnails and settings.

#### Acceptance Criteria

1. WHEN a thumbnail is successfully uploaded THEN the user SHALL receive visual confirmation
2. WHEN a thumbnail upload fails THEN the user SHALL see an appropriate error message
3. WHEN a custom thumbnail is active THEN there SHALL be a visual indicator in the video settings modal
4. WHEN hovering or pressing video elements THEN there SHALL be appropriate visual feedback
5. WHEN the thumbnail upload is in progress THEN there SHALL be a loading indicator