# Submission Guide — What to Do on Your Own Computer

## 1. Install tools (one time)
- Install Node.js 18 or newer from https://nodejs.org (LTS).
- Install Git from https://git-scm.com.
- Verify in a terminal:
  ```bash
  node -v
  npm -v
  git --version
  ```

## 2. Get the project onto your computer
- Create an empty private or public repository on GitHub.
- Copy the project folder (`campus-reporter`) to your computer, then inside it:
  ```bash
  git remote add origin <your-github-repository-url>
  git add -A
  git commit -m "Campus Reporter CW01"
  git push -u origin main
  ```
- Keep committing before the deadline; commits after the deadline are not assessed.

## 3. Run it locally
```bash
npm install
npm run dev
```
Open the printed URL (usually `http://localhost:5173`).

Production check:
```bash
npm run build
npm run preview
```

## 4. Deploy a public URL (recommended)
- Push the repository to GitHub.
- Import it in Vercel; keep the Vite preset. The `api/records.js` function deploys automatically.
- Open the Vercel public URL and confirm the app works there.
- A local server or non-public URL is acceptable during the demo, but the code must be available in the Git repository 24/7.

## 5. Prepare Part A — PowerPoint (40%)
- Open the generated `DWT-CW01-First-Attempt-B123456-Your-Name.pptx`.
- Replace `B123456` with your Banner ID and `Your-Name` with your full name.
- Add your own screenshots of the running app and relevant code snapshots.
- Insert the Student Declaration as the first page (downloaded from Aula).
- Include your GitHub repository link in the report and in the README.
- Length: 10–15 slides (±10% allowed).

## 6. Prepare Part B — Video (60%)
- Follow `PART_B_VIDEO_SCRIPT.md`.
- Record an MP4, about 5 minutes, with your own voice narration.
- Demonstrate: UI walkthrough, camera, geolocation, all CRUD operations, persistence after restart, server upload/sync, and relevant source code.
- Rename the file:
  ```
  DWT-CW01-First-Attempt-B123456-Your-Name.mp4
  ```

## 7. Submit on Aula
- Part A: upload the `.pptx` to the "Part A: Written Component" assignment box.
- Part B: upload the `.mp4` to the Part B submission box.
- Check the file names match the required format before the deadline: 06/12/2026.

## Notes
- Referencing style: Cite Them Right (CTR) Harvard.
- Generative AI is restricted to transcription, spell check and grammar check only; do not paste AI-generated content without declaring it.
- Do not put your name or Banner ID on assessed pages unless the declaration/cover sheet requires it.
