# 🚀 Advanced React Native Boilerplate

A professional, production-ready React Native boilerplate designed for scalability, performance, and maintainability. This starter kit leverages modern architecture patterns and the latest tech stack to accelerate your development process.

---

## 🛠 Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) (v0.85.3) with [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) (RTK)
- **Data Fetching**: [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) (Service-Oriented Approach)
- **Real-time**: [Socket.io Client](https://socket.io/docs/v4/client-api/)
- **Navigation**: [React Navigation v7](https://reactnavigation.org/) (Stack, Drawer, Tabs)
- **Styling**: [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS for Native)
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Yup](https://github.com/jquense/yup) Validation
- **I18n**: [react-i18next](https://react.i18next.com/) with RTL Support (Urdu/English)
- **Storage**: [Redux Persist](https://github.com/rt2zz/redux-persist) with [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- **Push Notifications**: [Firebase Cloud Messaging (FCM)](https://rnfirebase.io/messaging/usage)
- **Maps**: [MapLibre](https://maplibre.org/) (Vector Maps)
- **Location**: [react-native-geolocation-service](https://github.com/Agontuk/react-native-geolocation-service)

---

## 📂 Project Structure

```text
src/
├── assets/             # Static assets (images, icons, fonts, SVGs)
├── components/         # Atomic UI components (Button, Input, Maps, Card, etc.)
├── constants/          # Design tokens (colors, spacing, fonts)
├── hooks/              # Global custom hooks (useSocket, useNotifications, useLanguage)
├── i18n/               # Internationalization: translations (EN/UR) and RTL logic
├── navigation/         # Navigation stacks (Auth, Home, Drawer) and Type definitions
├── screens/            # Feature-based screens (Auth, Chat, Home, Settings)
├── services/           # Business logic and external integrations
│   ├── api/            # RTK Query: baseApi and feature-specific injections
│   ├── notifications/  # Firebase notification service logic
│   ├── socket/         # Socket.io singleton service
│   └── storage/        # AsyncStorage wrapper
├── store/              # Redux setup: store config, root reducer, and slices
├── theme/              # Dark/Light mode configuration and ThemeContext
└── utils/              # Helper functions, responsive scaling, and RTL utilities
```

---

## 🏛 Core Architecture Concepts

### 1. API & Data Fetching (RTK Query)
The API layer follows a **Modular Injection Pattern** to prevent a single monolithic file.
- **`baseApi.ts`**: The core slice handling base URL, caching tags, and automatic JWT header injection.
- **Dynamic Injections**: Feature APIs (like `authApi.ts`) inject their endpoints into the `baseApi` at runtime.
- **Auto-Caching**: Built-in cache invalidation using `tagTypes` for seamless UI updates.

### 2. Real-time Communication (Socket.io)
Managed through a **Singleton Service** pattern.
- **`socketService.ts`**: Centralized logic for connection, disconnection, and event handling.
- **`useSocket` Hook**: Provides a clean React interface. It automatically connects on mount and cleans up listeners on unmount to prevent memory leaks.

### 3. Theme & Styling
- **NativeWind**: Uses Tailwind CSS classes for consistent and fast UI development.
- **ThemeContext**: Supports dynamic switching between **Light** and **Dark** modes, persisting the user's choice across app restarts.
- **Responsive Scaling**: Custom utilities (`scale`, `verticalScale`) ensure the UI looks consistent across all screen sizes.

### 4. Internationalization (i18n) & RTL
- Supports **multi-language** (English and Urdu).
- Built-in **RTL support**: The app automatically flips layout and icons (like chevrons) when an RTL language is selected.

### 5. Maps & Location
- **MapLibre**: Integrated for rendering vector maps with high performance.
- **`AppMap.tsx`**: A reusable component for displaying maps, handling markers, and user location.
- **Geolocation**: Pre-configured with `react-native-geolocation-service` for real-time tracking.

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 22.11.0
- React Native Development Environment (Android Studio / Xcode)

### Installation
1. Clone the repository.
2. Run `npm install`.
3. Create a `.env` file based on the environment requirements (API URLs, etc.).

### Running the App
- **Android**: `npm run android`
- **iOS**: `npm run ios`
- **Linting**: `npm run lint`

---

## 📜 Coding Standards
- **Surgical Updates**: Always use functional components and hooks.
- **Type Safety**: Avoid `any`. Use the predefined types in `@types/` or within slices.
- **Import Ordering**: Follow the ESLint `import/order` rules (Built-in -> External -> Internal Aliases).
