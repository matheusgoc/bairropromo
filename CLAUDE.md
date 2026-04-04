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
| Animations / Skeletons | `moti`                                         |
| Dates                  | `dayjs`                                        |
| QR codes               | `react-native-qrcode-svg`                      |
| Icons                  | `@expo/vector-icons` (Material Design icons)   |
| Haptics                | `expo-haptics`                                 |

### Build Profiles (EAS)

| Profile     | Distribution | Notes                     |
| ----------- | ------------ | ------------------------- |
| development | Internal APK | Dev client with debugging |
| staging     | Internal APK | QA testing                |
| preview     | Internal     | Client preview            |
| production  | Store        | Auto-increments version   |
