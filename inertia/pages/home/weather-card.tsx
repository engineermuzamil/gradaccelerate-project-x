import { CloudOff, LoaderCircle, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'

interface WeatherData {
  city: string
  temperatureC: number
  condition: string
  iconUrl: string | null
}

/**
 * Gets user's location using browser Geolocation API
 */
async function getLocation(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (error) => reject(error),
      { timeout: 10000 }
    )
  })
}

/**
 * Gets user's location using IP-based geolocation as fallback
 */
async function getLocationFromIP(): Promise<{ latitude: number; longitude: number }> {
  const response = await fetch('https://ipinfo.io/json')
  const data = await response.json()
  const [latitude, longitude] = data.loc.split(',').map(Number)
  
  return { latitude, longitude }
}

/**
 * Gets user's location with fallback: browser first, then IP
 */
async function getLocationWithFallback(): Promise<{ latitude: number; longitude: number }> {
  try {
    return await getLocation()
  } catch {
    return await getLocationFromIP()
  }
}

/**
 * Fetches weather data from our backend API
 * Takes: latitude and longitude coordinates
 * Returns: Weather data object
 * Throws: Error if API request fails
 */
async function fetchWeather(latitude: number, longitude: number): Promise<WeatherData> {
  console.log('Fetching weather...')
  
  const response = await fetch(
    `/api/weather/current?lat=${latitude}&lon=${longitude}`,
    { credentials: 'same-origin' }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch weather')
  }

  const data = await response.json()
  console.log('Weather data:', data)
  
  return data as WeatherData
}

/**
 * Main component - displays weather card with location-based data
 */
export default function WeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const loadWeather = async () => {
      try {
        // Step 1: Get user location (with IP fallback if browser geolocation fails)
        const location = await getLocationWithFallback()

        // Step 2: Fetch weather for that location
        const weatherData = await fetchWeather(location.latitude, location.longitude)

        // Step 3: Update state (check if component is still mounted)
        if (!cancelled) {
          setWeather(weatherData)
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError('Weather data is unavailable right now.')
          setLoading(false)
        }
      }
    }

    loadWeather()
    
    // Cleanup: prevent state updates if component unmounts
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="bg-[#2C2C2E] p-6 rounded-xl border border-[#3A3A3C]">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Weather</h2>
          <p className="text-gray-400">Current weather for your area</p>
        </div>
        <MapPin className="text-[#0A84FF]" size={22} />
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-[#E5E5EA]">
          <LoaderCircle size={18} className="animate-spin" />
          <span>Loading weather...</span>
        </div>
      )}

      {!loading && error && (
        <div className="flex items-center gap-3 rounded-lg border border-[#FF6B6B]/40 bg-[#5A1F25]/70 px-4 py-3 text-[#FFD7DB]">
          <CloudOff size={18} />
          <span>{error}</span>
        </div>
      )}

      {!loading && weather && (
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-4xl font-bold">{Math.round(weather.temperatureC)}°C</p>
            <p className="text-[#E5E5EA] mt-1">{weather.condition}</p>
            <p className="text-[#98989D] text-sm mt-2">{weather.city}</p>
          </div>
          {weather.iconUrl && (
            <img src={weather.iconUrl} alt={weather.condition} className="w-16 h-16" />
          )}
        </div>
      )}
    </div>
  )
}
