# Bairro Promo App

**Version: 0.0.1**

Bairro Promo is a mobile app built with [React Native](https://reactnative.dev/) and [Expo](https://expo.dev/) on [TypeScript](https://www.typescriptlang.org/). It serves two audiences:

- **Customers** — subscribe to local businesses and access exclusive discounts and promotions on products and services.
- **Business owners** — manage their store information, locations, and offers through a dedicated owner interface.

Both user types go through a guided onboarding flow on first launch. The app supports a master admin role for full administrative control.

## Setup

Follow the steps below to set up the app locally after cloning this repo:

1. Set up [Android and iOS environment](https://docs.expo.dev/get-started/set-up-your-environment)
2. Set the enviroment varialbes at `.env` (follows .env.example)
3. Install dependencies:

   ```bash
   $ bun install
   ```

4. Build the app at device or simulator/emulator:

   ```bash
   # Android
   $ bun android

   # Android device
   $ bun android --device

   # iOS
   $ bun ios

   # iOS device
   $ bun ios --device
   ```

   **Notice:**
   - This last step must be repeated on every native change
   - The `Run` next following step will execute right after.

## Run

```bash
$ bun start
```

_Follow the instructions on terminal:_

- press `i` to run on ios
- press `a` to run on android
- press `j` to open Devtools for debug
- press `r` to reload the app
- press `shift + m` for more tools

## Linting

ESLint and Prettier are set up to inspect eventual syntax issue. These checks runs before each `git commit`. Run it manually anytime with the following commands:

```bash
# Lint check
$ bun lint

# Prettier checl
$ bun format

# TypeScript check
$ bun tsc
```

## Build or Update

The app is set to be updated and built with [Expo Application Service - EAS](https://expo.dev/eas) on staging, preview, and production environments. Use the `update` commands when there is no native components changes and `build` commands otherwise.

```bash
# List
$ bun build:list --channel staging | development | preview | production

# Run
$ bun build:run --id build-id

# Run last build
$ bun build:run --latest

# Update development
$ bun update:dev

# Update staging
$ bun update:staging

# Update preview
$ bun update:preview

# Update production
$ bun update:prod

# Build development
$ bun build:dev

# Build staging
$ bun build:staging

# Build preview
$ bun build:preview

# Build production
$ bun build:prod
```

## Test

```bash
$ bun test
```

## Other commands

```bash
# Prebuild - must run before any changes to the app config
$ bun prebuild

# Config - check build configuration
$ bun run config
```

## Libraries

### [React Native Paper](https://reactnativepaper.com/)

High-quality Material Design 3 UI component library by Callstack.

### [Expo Router](https://docs.expo.dev/router/introduction/)

File-based routing for React Native and web, built on top of React Navigation.

### [React Navigation – Bottom Tabs](https://reactnavigation.org/docs/bottom-tab-navigator/)

Bottom tab navigator used for the main app tabs (Offer, Place, Profile).

### [@pchmn/expo-material3-theme](https://github.com/pchmn/expo-material3-theme)

Generates dynamic Material3 color schemes from the device's system accent color, adapting automatically to light/dark mode.

### [@tanstack/react-query](https://tanstack.com/query/latest)

Server-state management: data fetching, caching, and synchronization with a configured `staleTime` of 1 minute.

### [React Hook Form](https://react-hook-form.com/)

Performant, flexible form state management used across all forms in the app.

### [react-native-mask-input](https://github.com/CaioQuirinoMedeiros/react-native-mask-input)

Input masking for phone numbers and date fields.

### [Moti](https://moti.fyi/)

Animation library built on Reanimated, used for loading skeletons and transitions.

### [expo-image](https://docs.expo.dev/versions/latest/sdk/image/)

Optimized image component with caching and progressive loading support.

### [expo-image-picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)

Native image and video picker used for place photo uploads.

### [react-native-keyboard-controller](https://kirillzyusko.github.io/react-native-keyboard-controller/)

Smooth keyboard avoidance and height tracking for form screens.

### [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/)

Persistent key-value storage, used to track first-launch state and gate the onboarding flow.

### [burnt](https://github.com/nandorojo/burnt)

Native toast and alert notifications via a simple cross-platform API.

### [dayjs](https://day.js.org/)

Lightweight date parsing and formatting library.

### [react-native-qrcode-svg](https://github.com/awesomejerry/react-native-qrcode-svg)

QR code generation for offer redemption codes.

### [@expo/vector-icons](https://docs.expo.dev/guides/icons/)

Icon set library bundling Material Design icons (and others) for use throughout the UI.

### [expo-haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)

Haptic feedback for interactive UI elements.
