import type { HttpContext } from '@adonisjs/core/http'
import apiConfig from '#config/api'

export default class WeatherController {
  async current({ request, response }: HttpContext) {
    const lat = Number(request.input('lat'))
    const lon = Number(request.input('lon'))

    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      return response.badRequest({ message: 'Latitude and longitude are required' })
    }

    if (!apiConfig.weatherApiKey) {
      return response.status(500).json({ message: 'Weather API key is missing' })
    }

    try {
      const url = `https://api.weatherapi.com/v1/current.json?key=${apiConfig.weatherApiKey}&q=${lat},${lon}&aqi=no`
      const weatherResponse = await fetch(url)
      const weatherData = await weatherResponse.json()

      if (!weatherResponse.ok) {
        return response.status(503).json({ message: 'Failed to fetch weather data' })
      }

      return response.ok({
        city: weatherData.location.name,
        temperatureC: weatherData.current.temp_c,
        condition: weatherData.current.condition.text,
        iconUrl: weatherData.current.condition.icon
          ? `https:${weatherData.current.condition.icon}`
          : null,
      })
    } catch {
      return response.status(503).json({ message: 'Weather data is unavailable right now' })
    }
  }
}
