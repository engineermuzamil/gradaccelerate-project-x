import { CloudOff, LoaderCircle, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'

interface WeatherData {
  city: string
  temperatureC: number
  condition: string
  iconUrl: string | null
}

export default function WeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const loadWeather = async () => {
      try {
        // Get location from browser
        console.log('Trying browser geolocation...')
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
          })
        })

        const { latitude, longitude } = position.coords
        console.log('Got browser location:', latitude, longitude)

        // Fetch weather from our API
        const response = await fetch(
          `/api/weather/current?lat=${latitude}&lon=${longitude}`,
          { credentials: 'same-origin' }
        )

        if (!response.ok) throw new Error('Failed to fetch weather')

        const data = await response.json()
        console.log('Weather data:', data)
        
        if (!cancelled) {
          setWeather(data)
          setLoading(false)
        }
      } catch (err) {
        console.log('Error:', err)
        if (!cancelled) {
          setError('Weather data is unavailable right now.')
          setLoading(false)
        }
      }
    }

    loadWeather()
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
