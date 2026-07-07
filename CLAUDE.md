# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
expo start               # Start dev server
expo run:ios             # Build & run on iOS
expo run:android         # Build & run on Android

# Code quality
expo lint --fix          # ESLint with auto-fix
prettier . --write       # Format all files

# Testing
bun test                 # Run Jest tests (watch mode)
jest --testPathPattern=<path>  # Run a single test file

# EAS builds
npx eas-cli build --profile development
npx eas-cli build --profile staging
npx eas-cli build --profile preview
npx eas-cli build --profile production

# OTA updates
npx eas-cli update --channel development
npx eas-cli update --channel production
```

Pre-commit hooks run `lint-staged` automatically (Prettier + ESLint on staged `*.{js,jsx,ts,tsx}` files).

## Architecture

**Bairro Promo** is a React Native / Expo app (TypeScript, strict mode) for a subscription-based promotions platform. Customers subscribe to commercial businesses and access exclusive discounts.

### Theming

Root layout wraps everything in `PaperProvider` + `ThemeProvider` using `@pchmn/expo-material3-theme`. Dynamic Material3 colors adapt to the device's light/dark mode. Access theme colors via `useTheme()` from `react-native-paper`.

### Path Aliases

`@/*` maps to `src/*`. Use this alias for all internal imports.

### Key Dependencies

| Purpose                | Library                                        |
| ---------------------- | ---------------------------------------------- |
| UI / Material Design 3 | `react-native-paper`                           |
| Navigation             | `expo-router`, `@react-navigation/bottom-tabs` |
| Server state / caching | `@tanstack/react-query`                        |
| Forms                  | `react-hook-form`                              |
| Input masking          | `react-native-mask-input`                      |
| Images                 | `expo-image`, `expo-image-picker`              |
| Keyboard avoidance     | `react-native-keyboard-controller`             |
| Local storage          | `@react-native-async-storage/async-storage`    |
| Toast notifications    | `burnt`                                        |
| Animations / Skeletons | `moti`                                         |
| Dates                  | `dayjs`                                        |
| QR codes               | `react-native-qrcode-svg`                      |
| Icons                  | `@expo/vector-icons` (Material Design icons)   |
| Haptics                | `expo-haptics`                                 |

### App Entry & Navigation

`src/app/index.tsx` checks `useFirstLaunch()` (AsyncStorage flag) and redirects to `/onboard/onboard-welcome` on first launch, otherwise to the main `(tabs)` layout.

Main tabs: **Offer**, **Place**, **Profile**. The Profile tab contains nested business-owner routes under `profile/place/[id]/` for managing a place's info, locations, and offers.

### Onboarding Flow (`src/app/onboard/`)

Nine-screen sequence shown only on first launch:
`welcome → call → gate → signin → reset → signup → password → apply → success`

### Services (`src/services/`)

Thin business-logic layer consumed by React Query hooks:

- `place.service.ts`, `offer.service.ts`, `location.service.ts` — CRUD for business entities
- `profile.service.ts` — user profile
- `alert.service.ts`, `toast.service.ts` — native UI helpers

### Data Models (`src/models/`)

TypeScript interfaces for all domain objects: `profile`, `place`, `offer`, `place-location`, `category`, `list` (generic paginated response).

### Custom Hooks (`src/hooks/`)

- `use-first-launch` — AsyncStorage flag that gates the onboarding flow
- `use-auth` — authentication state (`{ isSignedIn }`)
- `use-app-theme` — project-scoped wrapper around `useTheme()`
- `use-place-image-upload` — image picker + upload for place photos
- `use-snackbar` — imperative snackbar API

### Form Pattern

All forms use `react-hook-form`. Controlled inputs live in `src/components/form/`: `text-input`, `phone-input`, `select-input`, `switch`. Phone and date fields use `react-native-mask-input` for formatting.

### Build Profiles (EAS)

| Profile     | Distribution | Notes                     |
| ----------- | ------------ | ------------------------- |
| development | Internal APK | Dev client with debugging |
| staging     | Internal APK | QA testing                |
| preview     | Internal     | Client preview            |
| production  | Store        | Auto-increments version   |
