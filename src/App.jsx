import { useEffect, useState } from 'react'
import { HashRouter, Route, Routes, useParams } from 'react-router-dom'
import Layout from './components/Layout'
import ReportList from './pages/ReportList'
import ReportForm from './pages/ReportForm'
import ReportDetail from './pages/ReportDetail'
import { getReport } from './db'

function EditReport() {
  const { id } = useParams()
  const [report, setReport] = useState(undefined)

  useEffect(() => {
    getReport(id).then(setReport)
  }, [id])

  if (report === undefined) return <p>Loading…</p>
  if (report === null) return <p>Report not found.</p>

  return <ReportForm report={report} />
}

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<ReportList />} />
          <Route path="/new" element={<ReportForm />} />
          <Route path="/edit/:id" element={<EditReport />} />
          <Route path="/report/:id" element={<ReportDetail />} />
        </Routes>
      </Layout>
    </HashRouter>
  )
}
