import { db, listReports, getReport, markSynced } from './db'
import { uploadReport, fetchServerReports } from './api'

// Upload every report that is still stored on the device only.
// Used manually and automatically when the connection comes back.
export async function syncPendingReports() {
  const pending = (await listReports()).filter((r) => !r.synced)
  let uploaded = 0
  for (const report of pending) {
    await uploadReport(report)
    await markSynced(report.id)
    uploaded++
  }
  return uploaded
}

// Pull records stored on the demo server and merge any that this device
// does not have yet. Local records are never overwritten.
export async function mergeServerReports() {
  try {
    const serverRecords = await fetchServerReports()
    for (const record of serverRecords) {
      if (!record?.id) continue
      const existing = await getReport(record.id)
      if (!existing) {
        await db.reports.add({ ...record, synced: true })
      }
    }
  } catch {
    // Offline or server unreachable: keep local data as-is.
  }
}
