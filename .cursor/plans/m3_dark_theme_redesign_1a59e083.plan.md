---
name: M3 dark theme redesign
overview: "Full UI redesign of the Flutter jewelry store app: switch from the ornate luxury gold theme to a clean Material 3 dark theme, redesign all shared components (theme, data table, form modals, page layouts, navigation), and individually update every screen."
todos:
  - id: theme
    content: Rewrite app_colors.dart with M3 dark palette and rebuild app_theme.dart as Material 3 dark theme
    status: completed
  - id: data-table
    content: "Redesign DataTableWidget with M3 styling: alternating rows, tonal header, improved pagination, shimmer loading"
    status: in_progress
  - id: form-modal
    content: "Redesign FormModal with M3 dialog styling: surface colors, proper header/footer, rounded corners"
    status: pending
  - id: text-field
    content: "Simplify CustomLuxuryTextField: remove glow/gold, use M3 outlined style from theme"
    status: pending
  - id: nav-drawer
    content: "Redesign AppDrawer with M3 NavigationDrawer style: selected highlights, clean group headers"
    status: pending
  - id: bottom-nav
    content: Replace LuxuryBottomNav with M3 NavigationBar, simplify center button
    status: pending
  - id: buttons-statcard
    content: Simplify LuxuryButton to M3 filled style, redesign StatCard with tonal surfaces
    status: pending
  - id: app-shell
    content: Update AppShell and AppBar to use M3 theme defaults
    status: pending
  - id: login-splash
    content: Redesign LoginScreen (clean dark, no sparkles/glassmorphism) and SplashScreen
    status: pending
  - id: dashboard
    content: Redesign DashboardScreen with M3 stat cards and chart styling
    status: pending
  - id: list-screens
    content: "Update all 10 list screens: replace LuxuryColors/AppColors with colorScheme, M3 buttons and filters"
    status: pending
  - id: report-screens
    content: Update DailyReportScreen, ReportScreen, CompanyInfoScreen with M3 styling
    status: pending
  - id: products-screen
    content: Update ProductsScreen cards and chips with M3 styling
    status: pending
  - id: form-dialogs
    content: "Update all 11 form dialogs: remove hardcoded LuxuryColors from dropdowns and checkboxes"
    status: pending
isProject: false
---

# Material 3 Dark Theme -- Full UI Redesign

## Design Direction

Replace the current ornate luxury gold theme with a **clean Material 3 dark theme** using a teal/cyan primary color with gold accent. Dark surfaces (#121212-level), proper M3 elevation (tonal surfaces instead of shadows), clean sans-serif typography via `Vazirmatn`, and consistent component styling across all 19 screens.

---

## Phase 1: Theme and Design System

### 1.1 Replace `app_colors.dart` and `luxury_colors.dart` with unified M3 palette

File: [flutter/lib/theme/app_colors.dart](flutter/lib/theme/app_colors.dart)

- Define M3 dark surface colors: `surface` (#1C1B1F), `surfaceContainer` (#211F26), `surfaceContainerHigh` (#2B2930)
- Primary: teal/cyan (`Color(0xFF80CBC4)`) -- modern, not ornate
- Secondary/accent: gold (`Color(0xFFD4AF37)`) for subtle accents
- Tertiary: soft purple for charts
- Error, success, warning colors
- Text: `onSurface` (#E6E1E5), `onSurfaceVariant` (#CAC4D0)

### 1.2 Rebuild `app_theme.dart` as Material 3 dark theme

File: [flutter/lib/theme/app_theme.dart](flutter/lib/theme/app_theme.dart)

- `ThemeData` with `brightness: Brightness.dark`, `useMaterial3: true`
- `ColorScheme.dark(...)` with the new palette
- Dark `AppBarTheme` with surface color (no solid gold bar)
- `CardTheme` with M3 tonal surfaces: `surfaceContainerHigh`, no heavy shadows, outline variant
- `InputDecorationTheme` with M3 outlined/filled style, subtle borders
- `FilledButtonTheme`, `OutlinedButtonTheme`, `TextButtonTheme`
- `TabBarTheme`, `ChipTheme`, `DialogTheme`, `BottomNavigationBarTheme`
- `Vazirmatn` font via `google_fonts`

### 1.3 Keep `luxury_colors.dart` for backward compat but minimize usage

Most screens reference `LuxuryColors` directly. After the theme change, the M3 theme colors will propagate automatically through `Theme.of(context).colorScheme`. We will update each screen to use `colorScheme` instead of hardcoded `LuxuryColors.*`.

---

## Phase 2: Shared Component Redesign

### 2.1 DataTableWidget -- modern M3 table

File: [flutter/lib/widgets/data_table_widget.dart](flutter/lib/widgets/data_table_widget.dart)

- Replace `Card` with M3 surface container (rounded, outlined, no heavy elevation)
- Alternating row tints using `surfaceContainerHigh` / transparent
- Header row with `primaryContainer` tint, M3 text style
- Pagination bar: add First/Last page buttons, page size selector dropdown, "showing X-Y of Z" text
- Loading state: shimmer skeleton rows instead of single spinner
- Empty state: centered icon + message
- Use `Theme.of(context).colorScheme` for all colors
- `Expanded` wrapper fix: ensure table fills available width

### 2.2 FormModal -- modern M3 dialog

File: [flutter/lib/widgets/form_modal.dart](flutter/lib/widgets/form_modal.dart)

- Switch from `Dialog` with `LuxuryColors.deepBlack` to M3 `Dialog` with `surfaceContainerHigh`
- Increase max width to 560px, max height to 700px
- Rounded corners (28px -- M3 standard for dialogs)
- Header: title with `headlineSmall` style + close icon button
- Footer: `TextButton` for cancel, `FilledButton` for submit (no more `LuxuryButton`)
- Divider between content and footer
- Smooth open/close animation

### 2.3 CustomLuxuryTextField -- simplify to M3 text field

File: [flutter/lib/widgets/luxury/custom_luxury_text_field.dart](flutter/lib/widgets/luxury/custom_luxury_text_field.dart)

- Remove the glow animation and gold accents
- Use M3 `OutlinedBorder` with theme colors
- The `InputDecorationTheme` from the main theme will handle most styling
- Keep as a thin wrapper mainly for the consistent API

### 2.4 AppDrawer -- modern M3 navigation drawer

File: [flutter/lib/widgets/app_drawer.dart](flutter/lib/widgets/app_drawer.dart)

- Use M3 `NavigationDrawer` style: surface color background
- Selected item: filled rounded rectangle with `primaryContainer` color
- Unselected items: transparent with `onSurfaceVariant` text
- Group headers: `labelSmall` text style with `outline` color
- Logo section: cleaner, no gold gradient -- just icon + text
- Dividers between groups
- Collapse/expand with smooth animation

### 2.5 AppShell + AppBar -- clean dark

File: [flutter/lib/widgets/app_shell.dart](flutter/lib/widgets/app_shell.dart)

- AppBar: use theme default (dark surface, no gold), add subtle bottom border
- Remove custom gold accent from AppBar

### 2.6 LuxuryBottomNav -- simplify to M3 NavigationBar

File: [flutter/lib/widgets/luxury/luxury_bottom_nav.dart](flutter/lib/widgets/luxury/luxury_bottom_nav.dart)

- Replace custom implementation with Flutter's `NavigationBar` (M3)
- Use `NavigationDestination` items
- Remove blur effects, gold gradients, custom center button
- Keep the diamond icon as center destination but style it as M3

### 2.7 StatCard -- M3 tonal surface card

File: [flutter/lib/widgets/stat_card.dart](flutter/lib/widgets/stat_card.dart)

- Dark surface container with subtle border
- Icon with `primaryContainer` / `secondaryContainer` tonal fill
- Clean typography, no heavy shadows

### 2.8 LuxuryButton -- replace with theme buttons

File: [flutter/lib/widgets/luxury/luxury_button.dart](flutter/lib/widgets/luxury/luxury_button.dart)

- Simplify to use M3 `FilledButton` styling from theme
- Keep press animation but remove gold gradient

---

## Phase 3: Individual Screen Redesign

### 3.1 All list screens (10 screens) -- unified pattern

Screens: `customers`, `suppliers`, `expenses`, `currency_rates`, `persons`, `traders`, `product_masters`, `loan_reports`, `personal_expenses`, `purchases`

- Remove all hardcoded `LuxuryColors.*` references -- use `Theme.of(context).colorScheme`
- Header: `headlineSmall` title + `bodyMedium` subtitle
- "Add" button: `FilledButton.tonal` instead of `FilledButton` with gold
- Search field: use theme `InputDecoration` (remove hardcoded colors)
- Filters: wrap in M3 outlined card/container
- Table: auto-styled via redesigned `DataTableWidget`
- Edit button: `TextButton` or `IconButton` with `primary` color

### 3.2 Dashboard -- M3 dark

File: [flutter/lib/screens/dashboard_screen.dart](flutter/lib/screens/dashboard_screen.dart)

- Stat cards: use redesigned `StatCard` with M3 surface colors
- Charts: dark background, use `colorScheme.primary`/`secondary`/`tertiary` for data series
- Chart cards: M3 outlined card with `surfaceContainer` background
- Remove `AppColors.*` references, use colorScheme

### 3.3 Login -- clean M3 dark

File: [flutter/lib/screens/login_screen.dart](flutter/lib/screens/login_screen.dart)

- Replace sparkle overlay and gold gradient background with a clean gradient (`surface` to `surfaceContainerLowest`)
- Login card: M3 surface container with outlined border, no glassmorphism
- Text fields: use M3 styled `CustomLuxuryTextField`
- Submit button: M3 `FilledButton`
- Keep the animations (fadeIn, slideY) but remove sparkles

### 3.4 Storage screen -- M3 tabs

File: [flutter/lib/screens/storage_screen.dart](flutter/lib/screens/storage_screen.dart)

- Use M3 `TabBar` styling from theme
- Filters and tables: use theme colors

### 3.5 Daily Report + Sales Report

Files: `daily_report_screen.dart`, `report_screen.dart`

- Summary cards: M3 tonal surfaces
- Expansion tiles: M3 styled
- Stat chips: `secondaryContainer` / `tertiaryContainer` tints
- Remove `AppColors.*` and `LuxuryColors.*`, use colorScheme

### 3.6 Products screen

File: [flutter/lib/screens/products_screen.dart](flutter/lib/screens/products_screen.dart)

- Product cards: M3 outlined card, `surfaceContainerHigh` background
- Chip: M3 styled
- Remove `AppColors.*` references

### 3.7 Company Info

File: [flutter/lib/screens/company_info_screen.dart](flutter/lib/screens/company_info_screen.dart)

- M3 card styling
- Avatar: `primaryContainer` background
- Remove `LuxuryColors.*`

### 3.8 Splash screen

File: [flutter/lib/main.dart](flutter/lib/main.dart) (SplashScreen class)

- Clean gradient background with dark surface colors
- `CircularProgressIndicator` with `primary` color
- Remove ornate gradient

### 3.9 All 8 form dialogs

Files in `flutter/lib/widgets/forms/`:

- `customer_form_dialog.dart`
- `supplier_form_dialog.dart`
- `expense_form_dialog.dart`
- `currency_rate_form_dialog.dart`
- `person_form_dialog.dart`
- `trader_form_dialog.dart`
- `product_master_form_dialog.dart`
- `personal_expense_form_dialog.dart`
- `loan_report_form_dialog.dart`
- `storage_form_dialog.dart`
- `fragment_form_dialog.dart`
- These use `FormModal` + `CustomLuxuryTextField`, so they mostly get the redesign for free
- Update dropdown styling: remove hardcoded `LuxuryColors.champagneFill`, use theme
- Update `CheckboxListTile` colors: remove `LuxuryColors.metallicGold`, use `primary`

---

## Summary of Changes

- **3 theme files**: `app_colors.dart` (new palette), `app_theme.dart` (M3 dark), `luxury_colors.dart` (kept but deprecated)
- **8 shared widgets**: data table, form modal, text field, buttons, drawer, bottom nav, stat card, app shell
- **19 screens**: all updated to use `colorScheme` instead of hardcoded colors
- **11 form dialogs**: dropdown/checkbox color cleanup
- **2 utility files**: no changes needed (animation_extensions, responsive)

