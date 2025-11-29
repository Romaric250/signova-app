# SignNova Mobile App

A revolutionary React Native mobile application for learning sign language through AI-powered 3D avatars. SignNova helps hearing individuals learn visual communication the way Deaf communities naturally do.

## 🚀 Project Overview

SignNova is a next-generation sign language translation platform that uses AI-powered 3D avatars to translate speech and text into sign language in real-time. The app focuses on training users to understand emotional expression and visual communication naturally.

## 🎨 Brand Identity

**Primary Color**: `#38E078` (Vibrant Green)  
**Secondary Color**: `#FFFFFF` (Pure White)

## 🛠 Technology Stack

- **Framework**: React Native with Expo (latest stable)
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Navigation**: React Navigation v6
- **State Management**: Zustand
- **HTTP Client**: Axios with interceptors
- **Form Handling**: React Hook Form
- **Animations**: React Native Reanimated 3
- **Icons**: Expo Vector Icons
- **Storage**: Expo SecureStore (tokens), AsyncStorage (preferences)
- **Camera/Audio**: Expo Camera, Expo AV

## 📁 Project Structure

```
signova-app/
├── src/
│   ├── components/          # Atomic Design Pattern
│   │   ├── atoms/           # Basic building blocks
│   │   ├── molecules/       # Component combinations
│   │   ├── organisms/       # Complex UI sections
│   │   └── templates/       # Page layouts
│   ├── screens/             # Screen components
│   │   ├── auth/            # Authentication screens
│   │   ├── main/            # Main app screens
│   │   ├── dictionary/      # Dictionary screens
│   │   ├── learning/        # Learning screens
│   │   └── settings/        # Settings screens
│   ├── navigation/          # Navigation configuration
│   ├── hooks/               # Custom React hooks
│   ├── contexts/            # React contexts
│   ├── services/            # API and storage services
│   ├── utils/               # Utility functions
│   ├── types/               # TypeScript type definitions
│   ├── config/              # Configuration files
│   └── store/               # Zustand stores
├── assets/                  # Static assets
├── App.tsx                  # Root component
└── package.json
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac) or Android Emulator

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd signova-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Web browser
```

## 📱 Features

### Authentication Flow
- ✅ Onboarding screens
- ✅ Login with email/password
- ✅ Signup with validation
- ✅ Forgot password flow

### Main Navigation (Bottom Tabs)
- ✅ Home Dashboard
- ✅ Dictionary (searchable)
- ✅ Learning Hub
- ✅ Real-time Translation
- ✅ Profile & Settings

### Dictionary Features
- Search with autocomplete
- Filter by language and category
- Favorite signs
- Sign detail views
- Video playback (placeholder)

### Learning Hub
- Lesson categories
- Progress tracking
- Interactive tutorials
- Practice mode

### Real-Time Translation
- Text input
- Speech recording (UI ready)
- 3D avatar placeholder
- Translation history

## 🏗 Architecture

### Component-Driven Development
The project follows **Atomic Design Pattern**:
- **Atoms**: Basic UI elements (Button, Input, Text, Icon, etc.)
- **Molecules**: Combinations of atoms (FormInput, SearchBar, Card, etc.)
- **Organisms**: Complex sections (Header, BottomNav, SignGrid, etc.)
- **Templates**: Page layouts
- **Screens**: Full page components

### State Management
- **Zustand** for global state (auth, user preferences)
- **React Hook Form** for form state
- **React Context** for theme/language (optional)

### API Integration
- Axios client with interceptors
- Automatic token management
- Error handling
- Mock data for development

## 🔧 Configuration

### Environment Variables

Create `.env.development` and `.env.production` files:

```env
API_BASE_URL=http://localhost:5000/api
APP_ENV=development
```

### TypeScript
Strict mode enabled with path aliases (`@/*` for `src/*`)

### NativeWind (Tailwind CSS)
Configured with custom colors matching brand identity.

## 📝 Development Guidelines

### Code Style
- Use TypeScript strict mode
- Follow atomic design pattern
- Use functional components with hooks
- Implement proper error handling
- Add loading states everywhere
- Ensure accessibility (min 44x44 touch targets)

### Component Structure
Every component should have:
- Component file (`Component.tsx`)
- Types file (`Component.types.ts`)
- Index file (`index.ts`)

### Naming Conventions
- Components: PascalCase
- Files: PascalCase for components, camelCase for utilities
- Functions: camelCase with "handle" prefix for events
- Constants: UPPER_SNAKE_CASE

## 🧪 Testing

```bash
npm run type-check  # TypeScript type checking
npm run lint        # ESLint
```

## 📦 Build & Deploy

### Development Build
```bash
expo build:ios --type simulator
expo build:android --type apk
```

### Production Build
```bash
expo build:ios --type archive
expo build:android --type app-bundle
```

## 🎯 Next Steps

### Phase 6: Design Implementation
After receiving Figma design screenshots:
1. Analyze design specifications
2. Map designs to existing components
3. Update/create components to match designs
4. Implement pixel-perfect UI
5. Add animations and transitions

### Phase 7-9: Feature Implementation
- Connect to backend API
- Implement real-time translation
- Add 3D avatar rendering
- Offline mode
- Push notifications
- Performance optimization

## 📄 License

ISC

## 👥 Team

Built with ❤️ for the Deaf community

---

**Note**: This is a setup-first approach. The project structure is complete and ready for design implementation once Figma screenshots are provided.
