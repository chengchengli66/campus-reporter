# Part B — 5-Minute Video Demonstration Script

Target length: about 5 minutes (±10%). Record your own voice throughout. Show both the running app and the relevant source code.

## 0:00–0:30 Introduction
- Greet and introduce yourself: name, Banner ID, module COMP10013.
- State the project: "Campus Reporter, a React PWA for reporting issues around a large outdoor site."
- Explain the purpose: users can create a report with a photo, GPS location, category and description; records are stored on the device and can be uploaded to a demo server.
- Show the deployed URL (or local preview) and that the app loads on a mobile viewport.

## 0:30–1:15 App walkthrough and UI/UX
- Open the report list. Explain the navigation: Reports list and New report.
- Show the empty state, then move to the New report form.
- Describe the interface choices: clear labels, category dropdown, responsive layout, status pills, photo preview.
- Point to the relevant CSS/components (`src/pages/ReportForm.jsx`, `src/index.css`) and explain how the layout adapts to small screens.

## 1:15–2:30 Create a report (Create + Camera + Geolocation + Read)
- Click "Take photo" and capture or attach an image. Show the photo preview.
- Click "Get GPS location" and wait for the coordinates to appear.
- Fill in title, category and description.
- Save the report. Return to the list and show the new record appears (Read).
- Switch to the source code:
  - Camera: `<input type="file" accept="image/*" capture="environment">` and `FileReader.readAsDataURL`.
  - Geolocation: `navigator.geolocation.getCurrentPosition`, latitude/longitude, error handling.
- Explain why each API is relevant to the reporting scenario.

## 2:30–3:15 Update and Delete
- Open the report, click Edit, change the title or description, save and show the updated record.
- Show the status toggle (open / resolved).
- Delete a test record, confirm, and show it disappears from the list.
- Open `src/db.js` and explain Dexie/IndexedDB schema and the CRUD functions (`createReport`, `getReport`, `updateReport`, `deleteReport`).

## 3:15–3:45 Persistence check
- Close and reopen the app (or refresh the page).
- Show that the remaining reports and photos are still present.
- Explain that IndexedDB data persists locally between sessions.

## 3:45–4:30 Server storage and sync
- Open a report and click "Upload to server"; show the status changes to "Synced to server".
- Show the demo server endpoint (`/api/records.js`) and the `api.js` upload helper.
- On the list, use "Sync pending" to upload remaining records.
- Explain the simple server: it accepts and stores JSON records and returns them on GET; local records are marked synced after a successful upload.

## 4:30–5:00 Code quality and extras
- Walk through the component structure: `App.jsx` routes, `Layout`, `ReportList`, `ReportForm`, `ReportDetail`.
- Mention reusable components, hooks/state management, and the PWA manifest/service worker.
- Summarise what works and one possible future improvement.
- End by showing the GitHub repository link.

## Recording checklist
- [ ] App runs in its intended environment (PWA URL / Expo Go / APK / local preview).
- [ ] Both required APIs are demonstrated working: Geolocation and Camera.
- [ ] All four CRUD operations are demonstrated: Create, Read, Update, Delete.
- [ ] Persistence after restart/reload is shown.
- [ ] Source code is navigated to and explained for each API and storage layer.
- [ ] Upload/sync to the demo server is shown.
- [ ] Clear video and audio; no background noise; speech is audible.
- [ ] File renamed: `DWT-CW01-First-Attempt-B123456-Your-Name.mp4`.
