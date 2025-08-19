# Technology Stack

## Framework & Platform
- **React Native 0.79.2** - Cross-platform mobile development
- **React 19.0.0** - UI library
- **TypeScript 5.0.4** - Type safety (mixed with JavaScript)
- **Node.js >=18** - Runtime requirement

## State Management
- **Redux Toolkit** - Primary state management
- **Redux Saga** - Side effects and async operations
- **TanStack React Query** - Server state management and caching
- **Legend State** - Additional state management for specific use cases

## Navigation & UI
- **React Navigation 7.x** - Navigation (Stack, Bottom Tabs)
- **React Native Paper** - Material Design components
- **React Native Vector Icons** - Icon library
- **React Native Linear Gradient** - Gradient components
- **React Native Gesture Handler** - Touch interactions

## Storage & Security
- **React Native Keychain** - Secure token storage
- **React Native MMKV** - Fast key-value storage
- **AsyncStorage** - General app storage

## Development Tools
- **Metro** - JavaScript bundler
- **Babel** - JavaScript compiler
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **Reactotron** - Development debugging

## Common Commands

### Development
```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS (requires CocoaPods setup)
bundle install
bundle exec pod install
npm run ios

# Linting
npm run lint

# Testing
npm test
```

### iOS Setup
```bash
# First time setup
bundle install
bundle exec pod install

# After native dependency updates
bundle exec pod install
```

## Environment Configuration
- Uses `.env` files with `react-native-dotenv`
- Environment variables: `BASE_URL`, `PRODUCTION_URL`
- Supports different environments via `APP_ENV`