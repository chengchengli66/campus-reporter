import Dexie from 'dexie'

export const db = new Dexie('campus-reporter')

db.version(1).stores({
  reports: 'id, category, timestamp, synced'
})

export const CATEGORIES = [
  'Litter',
  'Facility fault',
  'Wildlife',
  'Graffiti',
  'Lighting',
  'Other'
]

export async function createReport(data) {
  const now = new Date().toISOString()
  const report = {
    id: crypto.randomUUID(),
    title: data.title.trim(),
    category: data.category,
    description: data.description.trim(),
    photo: data.photo || null,
    latitude: data.latitude ?? null,
    longitude: data.longitude ?? null,
    timestamp: now,
    status: 'open',
    synced: false,
    createdAt: now,
    updatedAt: now
  }
  await db.reports.add(report)
  return report
}

export async function getReport(id) {
  return db.reports.get(id)
}

export async function listReports() {
  return db.reports.orderBy('timestamp').reverse().toArray()
}

export async function updateReport(id, changes) {
  await db.reports.update(id, { ...changes, updatedAt: new Date().toISOString() })
  return db.reports.get(id)
}

export async function deleteReport(id) {
  await db.reports.delete(id)
}

export async function markSynced(id) {
  await db.reports.update(id, { synced: true })
}

if (typeof window !== 'undefined') {
  window.__db = db
}
