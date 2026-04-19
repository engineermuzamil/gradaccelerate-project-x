import type { HttpContext } from '@adonisjs/core/http'
import apiConfig from '#config/api'

/**
 * GiphyController
 * - Searches for GIFs from Giphy API
 * - Returns array of GIF URLs for display
 */
export default class GiphyController {
  async search({ request, response }: HttpContext) {
    const query = request.input('q') as string

    if (!query || query.trim().length === 0) {
      return response.badRequest({ message: 'Search query required' })
    }

    if (!apiConfig.giphyApiKey) {
      return response.status(500).json({ message: 'Giphy API key missing' })
    }

    try {
      const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiConfig.giphyApiKey}&q=${encodeURIComponent(query)}&limit=12&offset=0&rating=g&lang=en`

      const giphyData = await fetch(url).then(r => r.json())

      if (!giphyData.data) {
        return response.ok({ gifs: [] })
      }

      const gifs = giphyData.data.map((gif: any) => ({
        id: gif.id,
        url: gif.images.fixed_height.url,
        title: gif.title,
      }))

      return response.ok({ gifs })
    } catch (error) {
      console.log('Giphy API error:', error)
      return response.status(503).json({ message: 'Giphy service unavailable' })
    }
  }
}
