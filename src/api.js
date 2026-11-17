const ENDPOINT = '/api/records'

export async function uploadReport(report) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(report)
  })
  if (!response.ok) throw new Error('Upload failed')
  return response.json()
}

export async function fetchServerReports() {
  const response = await fetch(ENDPOINT)
  if (!response.ok) throw new Error('Server unreachable')
  return response.json()
}

export async function isServerOnline() {
  try {
    await fetch(ENDPOINT)
    return true
  } catch {
    return false
  }
}
