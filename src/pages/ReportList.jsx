import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { listReports, markSynced } from '../db'
import { uploadReport } from '../api'

function formatTime(iso) {
  return new Date(iso).toLocaleString()
}

export default function ReportList() {
  const reports = useLiveQuery(listReports, [], [])
  const [syncing, setSyncing] = useState(false)
  const [message, setMessage] = useState('')

  const pending = reports?.filter((r) => !r.synced) ?? []

  const syncPending = async () => {
    setSyncing(true)
    setMessage('')
    try {
      for (const report of pending) {
        await uploadReport(report)
        await markSynced(report.id)
      }
      setMessage('All pending reports uploaded.')
    } catch {
      setMessage('Upload failed. Check connection and try again.')
    } finally {
      setSyncing(false)
    }
  }

  if (!reports) return <p>Loading…</p>

  return (
    <section>
      <div className="section-head">
        <h1>Reports</h1>
        <div className="row">
          {pending.length > 0 && (
            <button className="btn" onClick={syncPending} disabled={syncing}>
              {syncing ? 'Syncing…' : `Sync ${pending.length} pending`}
            </button>
          )}
          <Link to="/new" className="btn primary">+ New report</Link>
        </div>
      </div>

      {message && <p className="error">{message}</p>}

      {reports.length === 0 ? (
        <div className="empty">
          <p>No reports yet. Create your first one.</p>
          <Link to="/new" className="btn primary">Add report</Link>
        </div>
      ) : (
        <ul className="card-list">
          {reports.map((r) => (
            <li key={r.id}>
              <Link to={`/report/${r.id}`} className="report-card">
                {r.photo && <img src={r.photo} alt="Report" className="thumb" />}
                <div className="card-body">
                  <div className="card-title-row">
                    <h3>{r.title}</h3>
                    <span className={`pill ${r.status}`}>{r.status}</span>
                  </div>
                  <p className="meta">{r.category} · {formatTime(r.timestamp)}</p>
                  <p className="excerpt">{r.description}</p>
                  <p className={`sync ${r.synced ? 'yes' : 'no'}`}>
                    {r.synced ? 'Synced to server' : 'Stored on device'}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
