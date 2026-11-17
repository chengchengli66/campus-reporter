let records = []

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(records)
  }

  if (req.method === 'POST') {
    records.push(req.body)
    return res.status(201).json(req.body)
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
