# Susi Air - Fullstack Developer Technical Test

This repository contains the solution for the Susi Air Fullstack Developer technical test. It is a mobile web app for pilots to view their duty schedule, flight hours, and document statuses.

## Prerequisites
* **Node.js**: `>= 20.x` (Tested on `v24.18.0` LTS)
* **Package Manager**: `npm` (v10+)

## Project Structure
Monorepo with two main directories:
* `/nest`: Backend REST API built with NestJS.
* `/nuxt`: Mobile web frontend built with Nuxt 3.

---

## Preview & Screenshots

| Home Page | Schedule Calendar |
| :---: | :---: |
| <img src="./Home Screenshot.png" alt="Home Screen" width="360" /> | <img src="./Schedule Screenshot.png" alt="Schedule Screen" width="360" /> |

---

## 1. Backend (NestJS)

### Setup & Run
1. `cd nest`
2. `npm install`
3. `npm run start:dev`

### Testing
* Run unit tests: `npm test`
* Run E2E tests: `npm run test:e2e`
* Run coverage: `npm run test:cov`

### Environment Variables
* `PORT`: Server port (default: `3001`).
* `TODAY`: Operational reference date in `YYYY-MM-DD` (default: `2026-05-15`).

### Key Decisions
* **In-Memory Store**: Loaded JSON datasets once at startup into a singleton `DataService` (`onModuleInit`) to serve endpoints quickly without repeated disk reads.
* **Rolling Sum Calculation**: Used an efficient sliding window algorithm in `FlightHoursService` for `/flight-hours/summary`. Missing dates contribute 0 hours, and future dates return 0 since future flights have not occurred yet.
* **Deterministic Baseline Date**: Hardcoded `2026-05-15` as the baseline operational date (`TODAY`), configurable via environment variable for automated testing and review consistency.
* **Consistent Error Shape**: Configured a global exception filter and validation pipes to ensure all error responses follow a uniform structure (`{ statusCode, error, message, path, timestamp }`).

---

## 2. Frontend (Nuxt 3)

### Setup & Run
1. `cd nuxt`
2. `npm install`
3. `npm run dev`

### Environment Variables
* `NUXT_PUBLIC_API_BASE`: Backend API base URL (default: `http://localhost:3001`).

### Design & Styling
* **Brand & Colors**: Applied the color palette specified in the brief (Primary Navy `#0E2138`, Brand Red `#E63757`, Neutral background `#F5F6F8`) and Susi Air branding.
* **Typography**: Integrated Google Fonts' *Plus Jakarta Sans* with bold weights on numerical flight hour values for clear legibility.
* **Components**: Styled cards with 12px–16px rounded corners, pill-shaped primary action buttons, and line icons (`lucide-vue-next`) for mobile bottom navigation tabs.

### Architecture & Implementation
* **SCSS Architecture**: Pure SCSS with centralized variables (`_variables.scss`) as specified in the brief without relying on utility CSS frameworks.
* **State Management & Auth**: Used Pinia for authentication state and user profile, coupled with a `useApi` composable that attaches the Bearer token to requests made with `$fetch`.
* **Chart Visualization**: Used `chart.js` and `vue-chartjs` to render the flight hours trend chart with horizontal red limit lines and dynamic Y-axis scaling for each range toggle (1w, 1m, 3m, 6m, 1y).
* **Calendar Indexing**: Indexed monthly duty schedules by date in a lookup dictionary to keep calendar rendering fast and responsive during month transitions.

---

## 3. What I Would Change With More Time
* **Database & Persistence**: Replace mock JSON files with PostgreSQL and Prisma or TypeORM migrations.
* **Full JWT Auth**: Upgrade the lightweight token setup to standard signed JWTs (`@nestjs/jwt`) with refresh tokens and role-based guards.
* **Frontend E2E Tests**: Add Playwright test suites for login, schedule navigation, and chart interactions.
* **Offline Support**: Integrate `@vite-pwa/nuxt` so pilots can inspect schedules and document expiry dates when offline.
