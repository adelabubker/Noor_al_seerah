# Noor Al-Seerah code explanation

## 1. Project overview
This project is a React + Vite single-page application for presenting Islamic educational content about the Prophet's biography, companions, and battles. It uses React Router for navigation, Tailwind CSS plus custom CSS for styling, and a lightweight local authentication/data layer instead of a live backend.

## 2. Runtime flow
- `index.html` creates the root DOM node used by React.
- `src/main.jsx` mounts the app, router, authentication provider, global styles, and toaster.
- `src/App.jsx` defines the shared layout and the route table.
- The route then renders one page component at a time while shared components like the navbar and footer stay visible.

## 3. Styling system
- `tailwind.config.js` extends Tailwind with custom colors, fonts, spacing, and shadows.
- `postcss.config.js` enables Tailwind and Autoprefixer in the build pipeline.
- `src/index.css` holds the global theme tokens, helper classes, scrollbar styles, animation keyframes, and the extensive styling for the seerah timeline.
- The site supports light and dark themes, and the active theme is stored in `localStorage` by the navbar.

## 4. Data architecture
### `src/data/staticData.js`
This file is the main content database for the static version. It contains:
- an array of companion records,
- an array of seerah timeline events,
- helper functions for filtering companions, finding a companion by slug, and sorting/filtering seerah events.

### `src/data/battlesData.js`
This file is different from `staticData.js` because it persists battle records in `localStorage`. It exposes CRUD-like helpers:
- `getBattles()` reads saved data,
- `saveBattles()` writes the full array,
- `addBattle()` appends a new record,
- `updateBattle()` edits one record,
- `deleteBattle()` removes one record.

## 5. Fake API layer
### `src/api/services.js`
This file simulates backend APIs. It returns promise-based objects shaped like network responses so the UI can keep an API-like structure.
- `sahabaApi.getAll()` and `sahabaApi.getBySlug()` read from static data.
- `seerahApi.getAll()` returns the timeline events.
- `usersApi` returns safe placeholder values for the dashboard.
- write operations for companions/auth deliberately throw errors because there is no real backend in this package.

### `src/api/client.js`
This is only a placeholder. The real app no longer uses a dedicated HTTP client.

## 6. Authentication flow
### `src/context/AuthContext.jsx`
This context provides login state to the whole app.
- It stores the current user in React state.
- It defines one hard-coded admin account: `admin@noor.com / admin123`.
- `login()` validates against that demo account.
- `logout()` clears the user.
- `isAuthenticated` and `isAdmin` are derived flags used by route guards and the navbar.

### `src/components/ProtectedRoute.jsx`
Allows access only when a user is logged in.

### `src/components/AdminRoute.jsx`
Adds a second check so only admins can reach the dashboard.

## 7. Shared UI components
### `src/components/Navbar.jsx`
The navbar is one of the most important shared components. It:
- renders the main navigation links,
- shows login/logout/dashboard actions,
- stores the theme choice in `localStorage`,
- supports desktop and mobile layouts.

### `src/components/Footer.jsx`
Displays branding, quick links, and a Qur'anic verse.

### `src/components/PageLoader.jsx`
Reusable spinner for loading states.

### `src/components/PageTransition.jsx`
Creates a soft fade/slide transition on route changes.

### `src/components/ScrollToTop.jsx`
Automatically scrolls the page to the top after navigation.

### `src/components/ScrollUpButton.jsx`
Shows a floating button after scrolling and visualizes reading progress with an SVG ring.

### `src/components/CompanionForm.jsx`
Admin form used to create or edit a companion record. It normalizes multiline text for achievements and hadiths.

### `src/components/BattleForm.jsx`
Admin form used to create or edit battle records. It supports dynamic key events, numeric normalization, and media fields like YouTube ID and image URL.

## 8. Page-by-page explanation
### `src/pages/HomePage.jsx`
The landing page has four jobs:
1. show the main hero section,
2. present Qur'anic quotes,
3. fetch a featured subset of companions,
4. direct the user to the seerah and companions pages.

### `src/pages/CompanionsPage.jsx`
This page lists companions and supports:
- free-text search,
- category filters,
- debounced refetching through the fake API,
- navigation to a detail page using the companion slug.

### `src/pages/CompanionDetailPage.jsx`
This page reads the `slug` from the URL, loads the matching companion, and displays:
- quick metadata,
- short biography,
- full biography,
- achievements,
- hadiths.

### `src/pages/SeerahPage.jsx`
This is the most visually specialized page. It:
- loads timeline events,
- transforms them into positioned nodes,
- renders a horizontal interactive timeline on large screens,
- renders a vertical timeline on smaller screens,
- opens a large detail panel for the selected event,
- supports previous/next navigation between events.

### `src/pages/BattlesPage.jsx`
This page reads battle records from `localStorage`, filters them by phase/result/search text, and renders battle cards. It also contains:
- `BattleCard` for quick summaries,
- `BattleModal` for full battle details,
- `YouTubeModal` for embedded video playback.

### `src/pages/AuthPage.jsx`
This is the login page. It validates the email and password fields, calls the auth context, and redirects the admin to `/dashboard` after successful login.

### `src/pages/AdminDashboardPage.jsx`
This is the admin control center. It contains tabs for:
- companions,
- battles,
- users.

Important behavior:
- Companion CRUD is wired to the fake API, so write actions currently show the static-version error.
- Battle CRUD works locally because battles are stored in `localStorage`.
- The dashboard refreshes data using a `refreshKey` pattern.

### `src/pages/NotFoundPage.jsx`
Fallback page for unknown routes.

## 9. Important implementation notes
- The app is frontend-heavy and intentionally backend-light.
- Companion content is static and read-only in practice.
- Battle content is editable because it is stored in the browser.
- The dashboard therefore mixes two data strategies: static content for companions and persistent local content for battles.
- Some unused values remain in the code, such as `featured` in `getCompanions()` and `eraAnchors` in `SeerahPage`; these suggest the project was partially expanded and may continue evolving.

## 10. Files that were not commented internally
`package.json` and `package-lock.json` were left structurally intact because standard JSON does not safely support comments without changing behavior or tooling compatibility.
