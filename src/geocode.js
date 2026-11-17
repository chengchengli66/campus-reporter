const NOMINATIM = 'https://nominatim.openstreetmap.org'

// Reverse geocoding: coordinates -> human-readable address
export async function reverseGeocode(latitude, longitude) {
  const url = `${NOMINATIM}/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error('Reverse geocoding failed')
  const data = await res.json()
  return data?.display_name || null
}

// Forward geocoding: address text -> coordinates + display name
export async function geocodeAddress(query) {
  const q = encodeURIComponent(query)
  const url = `${NOMINATIM}/search?q=${q}&format=json&limit=1&accept-language=en`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error('Address lookup failed')
  const data = await res.json()
  if (!data?.length) return null
  const first = data[0]
  return {
    latitude: Number(first.lat),
    longitude: Number(first.lon),
    address: first.display_name
  }
}
