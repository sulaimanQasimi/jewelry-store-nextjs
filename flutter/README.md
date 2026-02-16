# Jewelry Store Flutter App

Flutter mobile app that connects to the Next.js jewelry store backend via REST API.

## Prerequisites

- Flutter SDK (3.10+)
- Next.js backend running (e.g., `npm run dev` in project root)

## Setup

1. Ensure the Next.js app is running:
   ```bash
   cd ..
   npm run dev
   ```

2. Get Flutter dependencies:
   ```bash
   flutter pub get
   ```

## Running the App

### Android Emulator
```bash
flutter run --dart-define=BASE_URL=http://10.0.2.2:3000
```

### iOS Simulator
```bash
flutter run --dart-define=BASE_URL=http://localhost:3000
```

### Physical Device
Use your machine's local IP (e.g., `http://192.168.1.100:3000`):
```bash
flutter run --dart-define=BASE_URL=http://YOUR_IP:3000
```

### Default (localhost)
If you omit `--dart-define`, the app uses `http://localhost:3000` (works for web/desktop).

## Features

- **Login**: Email/username + password via `POST /api/auth/token`
- **Dashboard**: Stats, 7-day sales chart, sales by type
- **Products**: Paginated list with search
- **Daily Report**: Today's transactions

## Project Structure

```
lib/
├── config/api_config.dart      # Base URL, timeouts
├── services/
│   ├── api_client.dart         # Dio + Bearer interceptor
│   ├── auth_service.dart       # Token storage
│   └── api/                    # API service classes
├── models/                     # DTOs
├── providers/                  # Auth, app state
└── screens/                    # Login, Dashboard, Products, Daily Report
```

## API Authentication

The app uses JWT from `/api/auth/token`. All protected endpoints receive `Authorization: Bearer <token>`. On 401, the app clears the token and navigates to login.
