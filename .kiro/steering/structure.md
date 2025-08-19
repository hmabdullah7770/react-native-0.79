# Project Structure

## Root Files
- `App.tsx` - Main app component with navigation and providers
- `index.js` - App entry point
- `package.json` - Dependencies and scripts
- `.env` - Environment variables
- `babel.config.js` - Babel configuration
- `.eslintrc.js` - ESLint rules

## Core Directories

### `/components`
Reusable UI components following consistent patterns:
- Use `.jsx` extension for components
- Include prop validation and TypeScript interfaces where needed
- Follow naming convention: PascalCase (e.g., `BackButton.jsx`)
- Common components: Button, TextField, Loader, CustomHeader

### `/screens`
Screen components organized by feature:
- Main screens: HomeScreen, LoginScreen, WelcomeScreen
- Feature folders: `/signIn`, `/signUp`, `/storeScreens`, `/tabNavigation`
- Use descriptive names ending with "Screen"

### `/Stack`
Navigation stack definitions:
- `AppScreens.js` - Authenticated user navigation
- `AuthScreens.js` - Authentication flow navigation

### `/Redux`
State management with clear separation:
- `/action` - Action creators
- `/reducer` - Reducers
- `/saga` - Side effects and async operations
- `/store` - Store configuration

### `/API`
API service modules organized by domain:
- `auth.js` - Authentication endpoints
- `profile.js` - User profile operations
- `categoury.js` - Category management
- Each file exports named functions for specific endpoints

### `/services`
Core services:
- `apiservice.js` - Axios configuration and interceptors
- `refreshtokenservice.js` - Token refresh logic

### `/utils`
Utility functions and configurations:
- `apiconfig.js` - API configuration and headers
- `azureConfig.js` - Azure authentication setup
- `store.js` - Store utilities
- `rootNavigation.js` - Navigation helpers

### `/context`
React Context providers:
- `Authprovider.js` - Authentication context
- `Snackbar.js` - Global notification context

### `/ReactQuery`
TanStack Query hooks and configurations:
- `/TanStackQueryHooks` - Custom query hooks

### `/assets`
Static assets:
- Images: `.png` files
- Audio: `.mp3` files for notifications
- Certificates: `.cer` files

## File Naming Conventions
- Components: PascalCase with `.jsx` extension
- Screens: PascalCase ending with "Screen"
- API modules: lowercase with `.js` extension
- Utils: lowercase with `.js` extension
- Context: PascalCase with descriptive names

## Architecture Patterns
- **Provider Pattern**: Multiple providers wrap the app (Redux, Query, SafeArea, Snackbar)
- **Container/Component**: Screens handle logic, components handle presentation
- **Service Layer**: API calls abstracted into service modules
- **Context for Global State**: Snackbar and auth state use React Context
- **Secure Storage**: Sensitive data stored using React Native Keychain