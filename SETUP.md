# SignNova Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Run on Device/Simulator**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on your phone

## Project Status

✅ **Completed:**
- Project initialization with Expo + TypeScript
- Complete folder structure (Atomic Design Pattern)
- All dependencies installed and configured
- NativeWind/Tailwind CSS setup
- TypeScript configuration with path aliases
- API client with interceptors
- State management (Zustand)
- Navigation structure (Auth + Main tabs)
- Authentication screens (Onboarding, Login, Signup, ForgotPassword)
- Main app screens (Home, Dictionary, Learning, Translate, Profile)
- Component library (Atoms, Molecules, Organisms)
- Mock data for development
- Theme configuration
- Utility functions

## Component Library

### Atoms (Basic Components)
- ✅ Button (primary, secondary, ghost, danger variants)
- ✅ Input (text, password, search)
- ✅ Text (h1-h4, body, small, caption)
- ✅ Icon (Ionicons, Material Community Icons)
- ✅ Avatar (with initials fallback)
- ✅ Badge (multiple variants)
- ✅ Loader (spinner)
- ✅ Checkbox
- ✅ Switch/Toggle
- ✅ Chip/Tag

### Molecules (Composite Components)
- ✅ FormInput (Input + Label + Error)
- ✅ SearchBar (Input + Icon + Clear)
- ✅ Card (with shadow options)
- ✅ ListItem (with icon, subtitle, actions)
- ✅ StatCard (for dashboard metrics)
- ✅ SignCard (for dictionary)
- ✅ ProgressBar

### Organisms (Complex Sections)
- ✅ Header (with back button, title, actions)
- ✅ BottomNav (tab bar - using React Navigation tabs instead)

## Navigation Structure

```
AppNavigator
├── AuthNavigator (if not authenticated)
│   ├── OnboardingScreen
│   ├── LoginScreen
│   ├── SignupScreen
│   └── ForgotPasswordScreen
└── MainNavigator (if authenticated)
    ├── HomeScreen
    ├── DictionaryScreen
    ├── LearningScreen
    ├── TranslateScreen
    └── ProfileScreen
```

## API Integration

The API client is configured and ready:
- Base URL: Configured via environment variables
- Auth token: Automatically added to requests
- Error handling: 401 redirects to login
- Mock data: Available for development

**API Services:**
- `authApi` - Authentication endpoints
- `signsApi` - Dictionary endpoints
- `userApi` - User profile endpoints
- `progressApi` - Learning progress endpoints
- `translateApi` - Translation endpoints

## State Management

**Zustand Stores:**
- `authStore` - Authentication state (user, token, isAuthenticated)

**Custom Hooks:**
- `useAuth` - Authentication operations (login, signup, logout)
- `useProgress` - Learning progress data

## Environment Variables

Create `.env.development`:
```env
API_BASE_URL=http://localhost:5000/api
APP_ENV=development
```

Environment variables are accessed via `src/config/env.ts`

## Next Steps

### Phase 6: Design Implementation (After Figma Screenshots)
1. Analyze design specifications
2. Update components to match designs
3. Implement pixel-perfect UI
4. Add animations

### Phase 7-9: Feature Implementation
1. Connect to backend API
2. Implement real-time translation
3. Add 3D avatar rendering
4. Offline mode
5. Push notifications

## Troubleshooting

### NativeWind Not Working
- Ensure `global.css` is imported in `App.tsx`
- Check `tailwind.config.js` content paths
- Verify `babel.config.js` has NativeWind preset

### Navigation Issues
- Ensure `GestureHandlerRootView` wraps `AppNavigator`
- Check navigation types in `src/types/navigation.types.ts`

### TypeScript Errors
- Run `npm run type-check` to see all errors
- Ensure path aliases are configured in `tsconfig.json`

## Development Tips

1. **Component Development**: Follow atomic design pattern
2. **Styling**: Use NativeWind classes (Tailwind CSS)
3. **Forms**: Use React Hook Form with `FormInput` component
4. **State**: Use Zustand for global state, local state for component-specific
5. **Navigation**: Use typed navigation from `@react-navigation/native`

## File Structure Reference

```
src/
├── components/     # Reusable UI components
├── screens/        # Screen components
├── navigation/     # Navigation configuration
├── hooks/          # Custom React hooks
├── services/       # API and storage services
├── utils/          # Utility functions
├── types/          # TypeScript types
├── config/         # Configuration files
└── store/          # Zustand stores
```

---

**Ready for Design Implementation!** 🎨

