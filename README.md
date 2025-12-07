# Bairro Promo App

**Version: 0.0.1**

Bairro Promo is a mobile app that offers to customers of commercial places access to exclusive discounts and promotions on products and services through a paid subscription. The app also includes tools for business owners to manage their store information and offers, along with full administrative control for a master user. It is built with [React Native](https://reactnative.dev/) and [Expo framework](https://expo.dev/) on top of [TypeScript](https://www.typescriptlang.org/).

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

High-quality standard-compliant Material Design UI library developed by the engineers of [Callstack](https://www.callstack.com/)
