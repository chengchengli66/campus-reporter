import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { isServerOnline } from '../api'

export default function Layout({ children }) {
  const [online, setOnline] = useState(navigator.onLine)
  const [serverUp, setServerUp] = useState(null)

  useEffect(() => {
    const update = () => setOnline(navigator.onLine)
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    isServerOnline().then(setServerUp)
    return () => window.removeEventListener('online', update)
  }, [])

  return (
    <div className="app">
      <header className="topbar">
        <Link to="/" className="brand">Campus Reporter</Link>
        <nav className="nav">
          <NavLink to="/" end>Reports</NavLink>
          <NavLink to="/new">New report</NavLink>
        </nav>
        <span className={`status ${online ? 'ok' : 'off'}`}>
          {online ? (serverUp ? 'Server online' : 'Local only') : 'Offline'}
        </span>
      </header>
      <main className="content">{children}</main>
    </div>
  )
}
