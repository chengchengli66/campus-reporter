import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteReport, getReport, markSynced, updateReport } from '../db'
import { uploadReport } from '../api'

export default function ReportDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState(undefined)
  const [syncing, setSyncing] = useState(false)
  const [message, setMessage] = useState('')
  const [messageKind, setMessageKind] = useState('')
  const [online, setOnline] = useState(navigator.onLine)

  const refresh = () => getReport(id).then(setReport)

  useEffect(() => {
    getReport(id).then(setReport)
    const update = () => setOnline(navigator.onLine)
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    return () => window.removeEventListener('online', update)
  }, [id])

  if (report === undefined) return <p>Loading…</p>
  if (report === null) return <p>Report not found.</p>

  const handleDelete = async () => {
    if (!window.confirm('Delete this report?')) return
    await deleteReport(id)
    navigate('/')
  }

  const handleUpload = async () => {
    if (!navigator.onLine) {
      setMessage('Queued for upload; it will sync automatically when back online.')
      setMessageKind('ok')
      return
    }
    setSyncing(true)
    setMessage('')
    try {
      await uploadReport(report)
      await markSynced(id)
      await refresh()
      setMessage('Uploaded to server.')
      setMessageKind('ok')
    } catch {
      setMessage('Upload failed. Check connection and try again.')
      setMessageKind('err')
    } finally {
      setSyncing(false)
    }
  }

  const toggleStatus = async () => {
    const next = report.status === 'open' ? 'resolved' : 'open'
    await updateReport(id, { status: next })
    await refresh()
  }

  return (
    <section className="detail">
      <Link to="/" className="back">← Back to reports</Link>
      <div className="section-head">
        <h1>{report.title}</h1>
        <span className={`pill ${report.status}`}>{report.status}</span>
      </div>

      <p className="meta">{report.category} · {new Date(report.timestamp).toLocaleString()}</p>

      {report.photo && <img src={report.photo} alt="Report" className="detail-photo" />}

      <p className="description">{report.description || 'No description provided.'}</p>

      <p className="meta">
        {report.address
          ? report.address
          : report.latitude != null && report.longitude != null
            ? `GPS: ${report.latitude.toFixed(6)}, ${report.longitude.toFixed(6)}`
            : 'No location recorded.'}
      </p>

      <p className={`sync ${report.synced ? 'yes' : 'no'}`}>
        {report.synced ? 'Synced to server' : 'Stored on device only'}
      </p>

      {message && <p className={messageKind === 'ok' ? 'success' : 'error'}>{message}</p>}

      <div className="row actions">
        <Link to={`/edit/${id}`} className="btn primary">Edit</Link>
        <button className="btn" onClick={handleUpload} disabled={syncing || report.synced}>
          {syncing ? 'Uploading…' : report.synced ? 'Uploaded' : online ? 'Upload to server' : 'Queue for sync'}
        </button>
        <button className="btn" onClick={toggleStatus}>
          Mark {report.status === 'open' ? 'resolved' : 'open'}
        </button>
        <button className="btn danger" onClick={handleDelete}>Delete</button>
      </div>
    </section>
  )
}
