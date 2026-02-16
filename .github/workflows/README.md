# CI/CD Workflows

## Flutter Build (`flutter-build.yml`)

Builds the Flutter jewelry store app for **Android**, **iOS**, **Windows**, and **Web**.

### Triggers

- Push to `master` or `main`
- Pull requests to `master` or `main`
- Manual dispatch

### Android Signing (Hardcoded)

- **Keystore**: `flutter/android/app-release.keystore`
- **Passwords**: `jewelrystore123` (store + key)
- **Alias**: `jewelry-store`

Configured in `flutter/android/key.properties`. Artifacts: APK and AAB.

### Jobs

| Job          | Runner        | Outputs                          |
|--------------|---------------|-----------------------------------|
| build-android| ubuntu-latest | APK, App Bundle                   |
| build-ios    | macos-latest  | iOS build (no codesign)           |
| build-windows| windows-latest| Windows executable                |
| build-web    | ubuntu-latest | Web assets (build/web/)           |

### Environment

- `BASE_URL`: API base URL (default `http://localhost:3000`)
- `FLUTTER_VERSION`: 3.24.0

### Security Note

The Android keystore and passwords are committed for CI. For production apps, use GitHub Secrets and remove these from the repository.
