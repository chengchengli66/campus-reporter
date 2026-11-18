import { listReports, markSynced } from './db'
import { uploadReport } from './api'

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
