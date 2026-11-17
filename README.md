# Campus Reporter

A Progressive Web App (PWA) built with React and Vite for reporting issues and observations around a large outdoor site (campus, park, or industrial site). Reports are stored on the device with IndexedDB, can be edited and deleted, and can be uploaded to a simple demo server.

## Features

- Create, read, update and delete (CRUD) reports stored on the device.
- Persistent local storage with Dexie (IndexedDB); data survives app restart.
- Geolocation API: capture GPS coordinates for each report.
- Camera API: take or attach a photo for each report.
- Category menu, description, timestamp, and open/resolved status.
- Upload reports to a demo server (`/api/records`) and sync all pending reports.
- Responsive mobile-first UI and installable PWA.

## Tech stack

- React 19 + Vite 8
- React Router 7 (HashRouter)
- Dexie / IndexedDB for local persistence
- vite-plugin-pwa for manifest and service worker
- Demo server: Vercel serverless function in `api/records.js` (in-memory demo storage)

## Prerequisites

- Node.js 18 or newer
- npm 9 or newer

## Clone and install

```bash
git clone <your-repository-url>
cd campus-reporter
npm install
```

## Run locally

```bash
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

The demo server endpoint is provided by a Vite dev middleware during local development, so upload and sync work without a separate backend.

## Production build

```bash
npm run build
npm run preview
```

## Deploy to Vercel

1. Push this repository to GitHub.
2. Import the repository in Vercel.
3. Keep the default Vite framework preset; the `api/records.js` function is deployed automatically.
4. Deploy and open the public URL.

## Project structure

```
api/
  records.js            Demo serverless storage (GET / POST)
src/
  api.js               Server upload and fetch helpers
  db.js                Dexie schema and CRUD functions
  App.jsx              Routes and layout wiring
  components/
    Layout.jsx         Header, navigation, connection status
  pages/
    ReportList.jsx     Report list and bulk sync
    ReportForm.jsx     New / edit form, camera and geolocation
    ReportDetail.jsx   Detail view, edit, delete, upload, status
public/
  icons/               PWA icons
docs/
  screenshots/        List, form and detail screenshots used in Part A
```

## Data model

Each report contains:

| Field | Description |
|---|---|
| `id` | Unique UUID |
| `title` | Short report title |
| `category` | Litter, Facility fault, Wildlife, Graffiti, Lighting, Other |
| `description` | User text |
| `photo` | Data URL captured from the camera |
| `latitude`, `longitude` | GPS coordinates |
| `timestamp` | Creation time (ISO string) |
| `status` | `open` or `resolved` |
| `synced` | Whether the report has been uploaded to the server |
