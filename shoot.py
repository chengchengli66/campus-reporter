import os
from playwright.sync_api import sync_playwright

os.makedirs("docs/screenshots", exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path="/usr/local/bin/chromium", args=["--no-sandbox"])
    page = browser.new_page(viewport={"width": 390, "height": 844})
    page.goto("http://localhost:5199/")
    page.wait_for_selector(".brand")

    page.evaluate("""
      () => {
        const now = new Date().toISOString();
        return window.__db.reports.add({
          id: 'demo-report-1',
          title: 'Broken bench near library',
          category: 'Facility fault',
          description: 'Wooden bench leg is cracked and unsafe to sit on.',
          photo: null,
          latitude: 55.8610,
          longitude: -4.2430,
          timestamp: now,
          status: 'open',
          synced: false,
          createdAt: now,
          updatedAt: now
        });
      }
    """)

    page.goto("http://localhost:5199/")
    page.wait_for_selector(".report-card")
    page.screenshot(path="docs/screenshots/list.png")

    page.goto("http://localhost:5199/#/new")
    page.wait_for_selector("form")
    page.screenshot(path="docs/screenshots/form.png")

    page.goto("http://localhost:5199/")
    page.wait_for_selector(".report-card")
    page.click(".report-card")
    page.wait_for_selector(".detail-photo, .description")
    page.screenshot(path="docs/screenshots/detail.png")

    browser.close()

print("screenshots saved")
