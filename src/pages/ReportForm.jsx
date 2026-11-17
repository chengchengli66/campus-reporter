import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORIES, createReport, updateReport } from '../db'
import { reverseGeocode, geocodeAddress } from '../geocode'

export default function ReportForm({ report }) {
  const navigate = useNavigate()
  const fileRef = useRef(null)

  const [title, setTitle] = useState(report?.title ?? '')
  const [category, setCategory] = useState(report?.category ?? CATEGORIES[0])
  const [description, setDescription] = useState(report?.description ?? '')
  const [photo, setPhoto] = useState(report?.photo ?? null)
  const [latitude, setLatitude] = useState(report?.latitude ?? null)
  const [longitude, setLongitude] = useState(report?.longitude ?? null)
  const [address, setAddress] = useState(report?.address ?? '')
  const [addressQuery, setAddressQuery] = useState('')
  const [locating, setLocating] = useState(false)
  const [geocoding, setGeocoding] = useState(false)
  const [error, setError] = useState('')

  const isEditing = Boolean(report)

  const capturePhoto = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPhoto(reader.result)
    reader.readAsDataURL(file)
  }

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.')
      return
    }
    setLocating(true)
    setError('')
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude
        const lon = pos.coords.longitude
        setLatitude(lat)
        setLongitude(lon)
        try {
          const addr = await reverseGeocode(lat, lon)
          setAddress(addr ?? '')
        } catch {
          // Keep coordinates even if the address lookup fails
        }
        setLocating(false)
      },
      (err) => {
        setError(`Location error: ${err.message}`)
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const useAddress = async () => {
    const query = addressQuery.trim()
    if (!query) {
      setError('Please enter an address first.')
      return
    }
    setGeocoding(true)
    setError('')
    try {
      const result = await geocodeAddress(query)
      if (result) {
        setLatitude(result.latitude)
        setLongitude(result.longitude)
        setAddress(result.address)
      } else {
        setLatitude(null)
        setLongitude(null)
        setAddress(query)
        setError('Address not found on the map; saved as text only.')
      }
    } catch {
      setLatitude(null)
      setLongitude(null)
      setAddress(query)
      setError('Address lookup failed; saved as text only.')
    } finally {
      setGeocoding(false)
    }
  }

  const submit = async (event) => {
    event.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Please enter a title.')
      return
    }

    const payload = { title, category, description, photo, latitude, longitude, address }

    if (isEditing) {
      await updateReport(report.id, payload)
      navigate(`/report/${report.id}`)
    } else {
      const created = await createReport(payload)
      navigate(`/report/${created.id}`)
    }
  }

  return (
    <section className="form-page">
      <h1>{isEditing ? 'Edit report' : 'New report'}</h1>
      <form onSubmit={submit} className="form">
        <label>
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Broken bench near library"
          />
        </label>

        <label>
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>

        <label>
          Description
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue or observation…"
          />
        </label>

        <div className="photo-block">
          <div className="row">
            <button type="button" className="btn" onClick={() => fileRef.current?.click()}>
              {photo ? 'Retake photo' : 'Take photo'}
            </button>
            <button type="button" className="btn" onClick={getLocation} disabled={locating}>
              {locating ? 'Locating…' : 'Get GPS location'}
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={capturePhoto}
            hidden
          />
          {photo && <img src={photo} alt="Captured" className="preview" />}

          <div className="address-block">
            <label>
              Or enter an address manually
              <input
                value={addressQuery}
                onChange={(e) => setAddressQuery(e.target.value)}
                placeholder="e.g. Library Street, Paisley"
              />
            </label>
            <div className="row">
              <button type="button" className="btn" onClick={useAddress} disabled={geocoding}>
                {geocoding ? 'Looking up…' : 'Use this address'}
              </button>
            </div>
          </div>

          <p className="meta">
            {address
              ? address
              : latitude != null && longitude != null
                ? `GPS: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                : 'No location captured yet.'}
          </p>
        </div>

        {error && <p className="error">{error}</p>}

        <div className="row">
          <button type="submit" className="btn primary">
            {isEditing ? 'Save changes' : 'Save report'}
          </button>
          <button type="button" className="btn" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </section>
  )
}
