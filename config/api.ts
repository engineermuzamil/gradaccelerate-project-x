import env from '#start/env'

const apiConfig = {
  weatherApiKey: env.get('WEATHER_API_KEY'),
  giphyApiKey: env.get('GIPHY_API_KEY'),
}

export default apiConfig
