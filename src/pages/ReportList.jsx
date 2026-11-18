import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { listReports, CATEGORIES } from '../db'
import { syncPendingReports } from '../sync'

function formatTime(iso) {
  return new Date(iso).toLocaleString()
}

export default function ReportList() {
  const reports = useLiveQuery(listReports, [], [])
  const [syncing, setSyncing] = useState(false)
  const [message, setMessage] = useState('')
  const [messageKind, setMessageKind] = useState('')
  const [online, setOnline] = useState(navigator.onLine)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState('All')

  const pending = reports?.filter((r) => !r.synced) ?? []

  useEffect(() => {
    const update = () => setOnline(navigator.onLine)
    const autoSync = async () => {
      setOnline(true)
      setMessage('Back online — syncing pending reports…')
      setMessageKind('ok')
      try {
        const n = await syncPendingReports()
        setMessage(n > 0 ? `Synced ${n} pending report(s).` : 'You are all synced.')
        setMessageKind('ok')
      } catch {
        setMessage('Sync failed. Check connection and try again.')
        setMessageKind('err')
      }
    }
    window.addEventListener('online', autoSync)
    window.addEventListener('offline', update)
    if (navigator.onLine) autoSync()
    return () => {
      window.removeEventListener('online', autoSync)
      window.removeEventListener('offline', update)
    }
  }, [])

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
    if (!navigator.onLine) {
      setMessage('Queued; pending reports will sync automatically when back online.')
      setMessageKind('ok')
      return
    }
    setSyncing(true)
    setMessage('')
    try {
      const n = await syncPendingReports()
      setMessage(n > 0 ? `Synced ${n} pending report(s).` : 'You are all synced.')
      setMessageKind('ok')
    } catch {
      setMessage('Sync failed. Check connection and try again.')
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
              {syncing ? 'Syncing…' : online ? `Sync ${pending.length} pending` : 'Queue pending'}
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
