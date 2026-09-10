# Activity Points Management System

A React.js front-end application that lets a student log in, view the
activity points earned through co-curricular, extra-curricular, technical,
professional, social and other approved activities, and submit new activities
for review. There is no backend — all data is read from JSON files bundled
with the app, and anything a student adds is kept in the browser's
`localStorage` so it survives a refresh.

## Features

- **Login** — students sign in with a UID and password checked against
  `public/data/students.json`.
- **Dashboard** — name, UID, department, semester, points earned, target
  points, remaining points, a progress indicator, points-by-category
  breakdown and a recent-activity feed.
- **Activity Ledger** — every activity with category, date, points claimed,
  points approved and status, filterable by category and status.
- **Activity Details** — a single activity's full description and review
  status.
- **Add Activity** — a validated form to submit a new activity (title,
  category, date, description, points claimed). New submissions start as
  "Pending".
- **Categories** — the six recognised activity categories with their point
  ceilings and how many points the student has earned in each.
- **Profile** — student information and an overall summary of activity
  points.

## Tech stack

- React 18 (functional components + hooks: `useState`, `useEffect`,
  `useMemo`, `useCallback`)
- React Router v6 (`HashRouter`, nested routes, protected routes,
  `useParams`, `useNavigate`)
- Plain CSS (no UI framework), JSON files as the data source
- `gh-pages` for GitHub Pages deployment

## Project structure

```
public/
  data/
    students.json      sample student accounts (UID, password, profile)
    activities.json     sample activity records per student
    categories.json     activity category reference data
src/
  context/AuthContext.js      login/session state, backed by localStorage
  hooks/useActivities.js      loads + filters activities, adds new ones
  hooks/useCategories.js      loads category reference data
  utils/format.js             date formatting, category lookup, status tone
  components/
    Login.js / Login.css
    Layout.js / Layout.css              sidebar navigation shell
    Dashboard.js / Dashboard.css
    ActivityList.js / ActivityList.css
    ActivityDetails.js / ActivityDetails.css
    AddActivity.js / AddActivity.css
    Categories.js / Categories.css
    Profile.js / Profile.css
    StatusPill.js / StatusPill.css
    ProtectedRoute.js
  App.js
  index.js / index.css
```

## Sample login accounts

| UID     | Password | Student       |
|---------|----------|---------------|
| CS2101  | pass123  | Aditi Menon   |
| EC2033  | pass456  | Rahul Nair    |
| ME2077  | pass789  | Sneha Pillai  |

The login page also shows one-click chips that fill these in for you.

## Running locally

Requires [Node.js](https://nodejs.org/) 16 or later.

```bash
npm install
npm start
```

The app opens at `http://localhost:3000`. Log in with one of the sample
accounts above.

## Building for production

```bash
npm run build
```

This produces a static `build/` folder that can be served by any static
host.

## Deploying to GitHub Pages

1. Create a new GitHub repository (for example
   `activity-points-management-system`) and push this project to it:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-GITHUB-USERNAME/activity-points-management-system.git
   git push -u origin main
   ```

2. Edit `package.json` and replace the `homepage` field with your own
   GitHub Pages URL:

   ```json
   "homepage": "https://YOUR-GITHUB-USERNAME.github.io/activity-points-management-system"
   ```

3. Install dependencies if you haven't already, then deploy:

   ```bash
   npm install
   npm run deploy
   ```

   This builds the app and pushes the `build/` folder to a `gh-pages`
   branch using the `gh-pages` package.

4. In your GitHub repository, go to **Settings → Pages** and confirm the
   source is set to the `gh-pages` branch. Your site will be live at the
   `homepage` URL within a minute or two.

5. Whenever you make changes, just run `npm run deploy` again to publish
   them.

## Notes on the data layer

- `useActivities` reads `public/data/activities.json` on load and merges it
  with any activities the student has added, which are kept in
  `localStorage` under the key `apms.activities.extra`. This keeps the app
  fully front-end-only while still letting "Add Activity" feel real across
  page refreshes.
- Approved point totals (on the Dashboard, Categories and Profile pages)
  only count activities whose `status` is `"Approved"`, matching how a real
  points ledger would treat pending/rejected claims.
- To add more sample students or activities, edit the JSON files in
  `public/data/` — no code changes are required.
