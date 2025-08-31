# Tyre Marketplace Frontend

A React Native Expo application for the Tyre Marketplace platform.

## Prerequisites

### Windows
- Node.js 18.x or higher ([Download](https://nodejs.org/))
- Git ([Download](https://git-scm.com/download/win))
- Android Studio (for Android development)
- Xcode (for iOS development, Mac only)
- Expo Go app on your mobile device (optional)

### Linux (Ubuntu/Debian)
```bash
# Install Node.js using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# Install Git
sudo apt install git

# Install Android Studio dependencies
sudo apt install openjdk-11-jdk
# Download and install Android Studio from https://developer.android.com/studio
```

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Tire-Market-Project
```

### 2. Install Dependencies
```bash
# Install project dependencies
npm install

# Install Expo CLI globally (if not already installed)
npm install -g expo-cli
```

### 3. Configure Environment
Create a `.env` file in the root directory:
```env
API_URL=http://localhost:8000
```

Note: Replace the API_URL with your backend server URL. Make sure the backend server is running before starting the frontend application.

## Running the Application

### Development Mode

1. Start the Metro bundler:
```bash
npx expo start
```

2. Running on different platforms:

#### Android
```bash
# Method 1: Using Expo CLI
npx expo start --android

# Method 2: Using Metro bundler
# Press 'a' in the terminal after starting the development server
# Or scan the QR code with Expo Go app
```

#### iOS (Mac only)
```bash
# Method 1: Using Expo CLI
npx expo start --ios

# Method 2: Using Metro bundler
# Press 'i' in the terminal after starting the development server
# Or scan the QR code with the Camera app
```

#### Web
```bash
# Method 1: Using Expo CLI
npx expo start --web

# Method 2: Using Metro bundler
# Press 'w' in the terminal after starting the development server
```

### Building for Production

#### Android
```bash
# Generate Android build
eas build -p android

# Or for development build
eas build -p android --profile development
```

#### iOS (Mac only)
```bash
# Generate iOS build
eas build -p ios

# Or for development build
eas build -p ios --profile development
```

## Project Structure

```
Tire-Market-Project/
├── app/                 # Main application screens
├── components/         # Reusable React components
├── assets/            # Static assets (images, fonts)
├── constants/         # App constants and configuration
├── style/            # Global styles and themes
└── scripts/          # Utility scripts
```

## Development Guidelines

1. Code Style
   - Follow the project's TypeScript configuration
   - Use functional components with hooks
   - Implement proper error handling
   - Follow React Native best practices

2. State Management
   - Use React Context for global state
   - Implement proper data fetching and caching
   - Handle loading and error states

3. Navigation
   - Use Expo Router for navigation
   - Implement proper deep linking
   - Handle authentication flow

## Common Issues and Solutions

1. Metro Bundler Issues
```bash
# Clear Metro cache
npx expo start --clear

# Reset cache and watchman
watchman watch-del-all
rm -rf node_modules
npm install
```

2. Android Build Issues
```bash
# Clean Android build
cd android
./gradlew clean
```

3. iOS Build Issues (Mac only)
```bash
# Clean iOS build
cd ios
pod install
```

4. Environment Issues
```bash
# Clear Expo cache
expo r -c

# Update Expo CLI
npm install -g expo-cli@latest

# Clear npm cache
npm cache clean --force
```

## Updating Dependencies

```bash
# Update all dependencies
npm update

# Update Expo SDK
npx expo upgrade
```

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch
```

## Troubleshooting

1. If the app crashes on startup:
   - Check if the backend server is running
   - Verify API_URL in .env
   - Clear app cache and restart
   - Check console logs for errors

2. If builds fail:
   - Clear node_modules and reinstall
   - Update Expo SDK
   - Check for conflicting dependencies
   - Verify Android/iOS development environment setup

3. For development environment issues:
   - Ensure correct Node.js version
   - Update npm and expo-cli
   - Clear Metro bundler cache
   - Check platform-specific requirements (Android SDK, Xcode)

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request
