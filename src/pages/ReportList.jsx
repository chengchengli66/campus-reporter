import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { listReports, markSynced, CATEGORIES } from '../db'
import { uploadReport } from '../api'

function formatTime(iso) {
  return new Date(iso).toLocaleString()
}

export default function ReportList() {
  const reports = useLiveQuery(listReports, [], [])
  const [syncing, setSyncing] = useState(false)
  const [message, setMessage] = useState('')
  const [messageKind, setMessageKind] = useState('')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState('All')

  const pending = reports?.filter((r) => !r.synced) ?? []

  const filtered = useMemo(() => {
    if (!reports) return []
    const q = query.trim().toLowerCase()
    return reports.filter((r) => {
      if (category !== 'All' && r.category !== category) return false
      if (status !== 'All' && r.status !== status) return false
      if (q) {
        const hay = [r.title, r.description, r.address].filter(Boolean).join(' ').toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [reports, query, category, status])

  const stats = useMemo(() => {
    const all = reports ?? []
    return {
      total: all.length,
      open: all.filter((r) => r.status === 'open').length,
      resolved: all.filter((r) => r.status === 'resolved').length,
      synced: all.filter((r) => r.synced).length
    }
  }, [reports])

  const syncPending = async () => {
    setSyncing(true)
    setMessage('')
    try {
      for (const report of pending) {
        await uploadReport(report)
        await markSynced(report.id)
      }
      setMessage('All pending reports uploaded.')
      setMessageKind('ok')
    } catch {
      setMessage('Upload failed. Check connection and try again.')
      setMessageKind('err')
    } finally {
      setSyncing(false)
    }
  }

  if (!reports) return <p>Loading…</p>

  return (
    <section>
      <div className="section-head">
        <div>
          <h1>Reports</h1>
          <p className="subtitle">Issues and observations recorded on this device.</p>
        </div>
        <div className="row">
          {pending.length > 0 && (
            <button className="btn" onClick={syncPending} disabled={syncing}>
              {syncing ? 'Syncing…' : `Sync ${pending.length} pending`}
            </button>
          )}
          <Link to="/new" className="btn primary">+ New report</Link>
        </div>
      </div>

      <div className="stats">
        <div className="stat-card">
          <span className="stat-num">{stats.total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{stats.open}</span>
          <span className="stat-label">Open</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{stats.resolved}</span>
          <span className="stat-label">Resolved</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{stats.synced}</span>
          <span className="stat-label">Synced</span>
        </div>
      </div>

      <div className="filters">
        <input
          className="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title, description or address…"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="All">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="All">All statuses</option>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {message && <p className={messageKind === 'ok' ? 'success' : 'error'}>{message}</p>}

      {filtered.length === 0 ? (
        <div className="empty">
          <p>{reports.length === 0 ? 'No reports yet. Create your first one.' : 'No reports match your filters.'}</p>
          {reports.length === 0 && (
            <Link to="/new" className="btn primary">Add report</Link>
          )}
        </div>
      ) : (
        <ul className="card-list">
          {filtered.map((r) => (
            <li key={r.id}>
              <Link to={`/report/${r.id}`} className="report-card">
                {r.photo && <img src={r.photo} alt="Report" className="thumb" />}
                <div className="card-body">
                  <div className="card-title-row">
                    <h3>{r.title}</h3>
                    <span className={`pill ${r.status}`}>{r.status}</span>
                  </div>
                  <p className="meta">
                    <span className="chip">{r.category}</span> · {formatTime(r.timestamp)}
                  </p>
                  {r.address && <p className="meta address">{r.address}</p>}
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
