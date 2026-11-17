from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

BLUE = RGBColor(0x3F, 0x51, 0xB5)
DARK = RGBColor(0x2B, 0x2F, 0x36)
MUTED = RGBColor(0x6B, 0x72, 0x80)
LIGHT = RGBColor(0xF3, 0xF4, 0xF6)
CODE_BG = RGBColor(0x1F, 0x20, 0x28)
CODE_FG = RGBColor(0xE5, 0xE7, 0xEB)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
BLANK = prs.slide_layouts[6]


def add_title(slide, text):
    box = slide.shapes.add_textbox(Inches(0.6), Inches(0.35), Inches(12.1), Inches(0.9))
    tf = box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = text
    p.font.size = Pt(30)
    p.font.bold = True
    p.font.color.rgb = BLUE
    bar = slide.shapes.add_shape(1, Inches(0.6), Inches(1.25), Inches(1.6), Inches(0.08))
    bar.fill.solid()
    bar.fill.fore_color.rgb = BLUE
    bar.line.fill.background()


def add_bullets(slide, items, left=0.7, top=1.6, width=11.9, height=4.8, size=18):
    box = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(height))
    tf = box.text_frame
    tf.word_wrap = True
    for i, item in enumerate(items):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = "• " + item
        p.font.size = Pt(size)
        p.font.color.rgb = DARK
        p.space_after = Pt(10)
    return box


def add_code(slide, code, left=0.7, top=3.6, width=11.9, height=2.6):
    box = slide.shapes.add_shape(1, Inches(left), Inches(top), Inches(width), Inches(height))
    box.fill.solid()
    box.fill.fore_color.rgb = CODE_BG
    box.line.fill.background()
    tf = box.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.2)
    tf.margin_top = Inches(0.15)
    for i, line in enumerate(code.split("\n")):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = line
        p.font.name = "Consolas"
        p.font.size = Pt(12)
        p.font.color.rgb = CODE_FG


def add_image(slide, path, left, top, width):
    from PIL import Image
    with Image.open(path) as img:
        ratio = img.height / img.width
    height = width * ratio
    slide.shapes.add_picture(path, Inches(left), Inches(top), width=Inches(width), height=Inches(height))


def add_screenshot_note(slide, text, left=0.7, top=6.35, width=11.9):
    box = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(0.6))
    tf = box.text_frame
    p = tf.paragraphs[0]
    p.text = text
    p.font.size = Pt(12)
    p.font.italic = True
    p.font.color.rgb = MUTED


# 1 Title
s = prs.slides.add_slide(BLANK)
rect = s.shapes.add_shape(1, 0, 0, prs.slide_width, prs.slide_height)
rect.fill.solid()
rect.fill.fore_color.rgb = BLUE
rect.line.fill.background()
box = s.shapes.add_textbox(Inches(1), Inches(2.4), Inches(11.3), Inches(2.5))
tf = box.text_frame
tf.word_wrap = True
p = tf.paragraphs[0]
p.text = "Campus Reporter"
p.font.size = Pt(48)
p.font.bold = True
p.font.color.rgb = WHITE
p2 = tf.add_paragraph()
p2.text = "A React PWA for reporting issues around a large outdoor site"
p2.font.size = Pt(22)
p2.font.color.rgb = WHITE
p3 = tf.add_paragraph()
p3.text = "COMP10013 Dynamic Web Technologies — Course Work 01"
p3.font.size = Pt(16)
p3.font.color.rgb = WHITE
p4 = tf.add_paragraph()
p4.text = "Your Name · Banner ID: B123456"
p4.font.size = Pt(16)
p4.font.color.rgb = WHITE

# 2 Introduction
s = prs.slides.add_slide(BLANK)
add_title(s, "Introduction and Project Purpose")
add_bullets(s, [
    "Campus Reporter is a Progressive Web App that lets users record issues and observations while moving around a large outdoor site.",
    "Typical use cases: litter, facility faults, wildlife sightings, graffiti, lighting problems and other site observations.",
    "Each report captures a title, category, description, photo, GPS coordinates and a timestamp.",
    "Reports are first stored on the device, so the app remains usable offline, and can later be uploaded to a simple demo server.",
    "The project demonstrates client-side framework use, persistent on-device storage, device APIs and server communication.",
], width=7.6)
add_image(s, "docs/screenshots/list.png", 8.8, 1.5, 2.5)

# 3 Technical features
s = prs.slides.add_slide(BLANK)
add_title(s, "Chosen Technical Features")
add_bullets(s, [
    "React 19 with Vite: component-based UI and fast development build.",
    "React Router: navigation between the list, new-report form, edit form and detail view.",
    "Dexie (IndexedDB): persistent on-device storage that survives app restart.",
    "Geolocation API: capture GPS coordinates for each report.",
    "Camera API: take or attach a photo through the file input with camera capture.",
    "PWA: manifest and service worker make the app installable and cacheable.",
])
add_screenshot_note(s, "[Insert screenshot: main navigation or app home screen]")

# 4 Architecture
s = prs.slides.add_slide(BLANK)
add_title(s, "System Architecture and Data Flow")
add_bullets(s, [
    "Presentation layer: React pages and components (ReportList, ReportForm, ReportDetail, Layout).",
    "Local data layer: Dexie/IndexedDB stores report records on the device and provides CRUD operations.",
    "Network layer: api.js sends stored reports to the demo server and reads them back over HTTP.",
    "Demo server: a Vercel serverless function accepts JSON records and returns the stored list.",
    "Flow: user fills the form -> local record is created -> record can be edited/deleted locally -> upload marks it synced.",
])
add_code(s, "Form / Pages  -->  Dexie (IndexedDB)  -->  HTTP POST /api/records  -->  Demo server (JSON)\n                <--  Read / Edit / Delete on device  <--  GET /api/records  <--", top=4.4)

# 5 Storage & CRUD
s = prs.slides.add_slide(BLANK)
add_title(s, "On-Device Storage and CRUD")
add_bullets(s, [
    "A Dexie database named campus-reporter stores one reports table indexed by id, category, timestamp and synced status.",
    "Create: createReport builds a UUID record and adds it to IndexedDB.",
    "Read: listReports returns records ordered by newest first; getReport loads one record by id.",
    "Update: updateReport changes fields and records a new updatedAt timestamp.",
    "Delete: deleteReport removes the record from IndexedDB.",
])
add_code(s, "db.version(1).stores({ reports: 'id, category, timestamp, synced' })\nawait db.reports.add(report)\nawait db.reports.update(id, { ...changes, updatedAt: now })\nawait db.reports.delete(id)")

# 6 Geolocation
s = prs.slides.add_slide(BLANK)
add_title(s, "Geolocation API")
add_bullets(s, [
    "The form requests the device location with navigator.geolocation.getCurrentPosition.",
    "Latitude and longitude are saved with the report and displayed on the detail view.",
    "High accuracy is enabled, with a 10-second timeout and an error message if permission or positioning fails.",
    "Location is relevant because every outdoor report should be tied to a place on the site.",
])
add_code(s, "navigator.geolocation.getCurrentPosition(\n  (pos) => { setLatitude(pos.coords.latitude); setLongitude(pos.coords.longitude) },\n  (err) => setError(`Location error: ${err.message}`),\n  { enableHighAccuracy: true, timeout: 10000 }\n)")

# 7 Camera
s = prs.slides.add_slide(BLANK)
add_title(s, "Camera API")
add_bullets(s, [
    "A hidden file input accepts images and requests the rear camera with capture=\"environment\".",
    "The selected image is read as a data URL with FileReader and shown as a preview.",
    "The photo data URL is stored inside the report record so it appears after reload.",
    "A visual record of the problem makes the report much clearer than text alone.",
])
add_code(s, '<input ref={fileRef} type="file" accept="image/*" capture="environment"\n        onChange={capturePhoto} hidden />\n\nreader.onload = () => setPhoto(reader.result)\nreader.readAsDataURL(file)')

# 8 Server sync
s = prs.slides.add_slide(BLANK)
add_title(s, "Server Storage and Sync")
add_bullets(s, [
    "Each unsynced report can be uploaded individually from the detail view.",
    "The list view can upload all pending reports in one batch, then marks them synced.",
    "The demo server keeps an in-memory list of JSON records; GET returns the list and POST adds a record.",
    "If the upload fails, the record stays on the device and can be retried when the connection recovers.",
])
add_code(s, "await fetch('/api/records', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify(report)\n})\n// On success: markSynced(id)")

# 9 UI/UX
s = prs.slides.add_slide(BLANK)
add_title(s, "App Design and User Experience")
add_bullets(s, [
    "Mobile-first responsive layout that adapts from narrow phone screens to wider desktop screens.",
    "Clear navigation: Reports list and New report button in the top bar.",
    "Status pills (open / resolved) and sync labels (synced / stored on device) make state visible at a glance.",
    "Photo thumbnails, category labels and timestamps help users scan the list quickly.",
    "Form fields are grouped by purpose: details, photo and location.",
], width=6.4)
add_image(s, "docs/screenshots/form.png", 7.3, 1.5, 2.2)
add_image(s, "docs/screenshots/detail.png", 9.9, 1.5, 2.2)

# 10 Setup guide
s = prs.slides.add_slide(BLANK)
add_title(s, "Project Setup and User Guide")
add_bullets(s, [
    "Clone the GitHub repository and run npm install to install dependencies.",
    "Run npm run dev to start the local development server and open the printed URL.",
    "Run npm run build to produce the production build, then npm run preview to test it.",
    "Create a report: open New report, attach a photo, capture the location, fill in details and save.",
    "Open any report to view it, edit details, change status, upload to the server or delete it.",
    "The README.md contains the full installation, usage and deployment instructions.",
])
add_code(s, "git clone <repository-url>\ncd campus-reporter\nnpm install\nnpm run dev")

# 11 Critical thinking
s = prs.slides.add_slide(BLANK)
add_title(s, "Challenges, Lessons and Critical Reflection")
add_bullets(s, [
    "Challenge: storing photos locally as data URLs keeps CRUD simple, but large images can use IndexedDB space quickly.",
    "Challenge: geolocation permission and availability differ across browsers and devices, so error handling is required.",
    "Lesson: separating the data layer (db.js), network layer (api.js) and UI pages keeps the code easier to test and extend.",
    "Lesson: designing the record schema before building the form avoided changes to the storage structure later.",
    "Critical view: the demo server uses in-memory storage, so records reset on restart; a persistent database would be needed in production.",
])

# 12 Conclusion
s = prs.slides.add_slide(BLANK)
add_title(s, "Conclusion and Future Recommendations")
add_bullets(s, [
    "The completed app meets the core requirements: CRUD, persistent local storage, two device APIs and server sync.",
    "It works as an installable PWA and provides a clear, mobile-friendly reporting workflow.",
    "Future improvement 1: persist server records in a real database such as Firebase or a hosted SQL/JSON store.",
    "Future improvement 2: add the Contacts API to route different categories to different recipients.",
    "Future improvement 3: add offline-first queueing, image compression and map-based location display.",
])

out = "DWT-CW01-First-Attempt-B123456-Your-Name.pptx"
prs.save(out)
print("saved", out, "slides:", len(prs.slides._sldIdLst))
