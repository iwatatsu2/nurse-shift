export interface WeatherDay {
  date: string
  weatherCode: number
  tempMax: number
  tempMin: number
}

const WEATHER_ICONS: Record<number, string> = {
  0: '☀️',   // Clear
  1: '🌤️',  // Mainly clear
  2: '⛅',   // Partly cloudy
  3: '☁️',   // Overcast
  45: '🌫️', // Fog
  48: '🌫️', // Rime fog
  51: '🌦️', // Light drizzle
  53: '🌦️', // Moderate drizzle
  55: '🌧️', // Dense drizzle
  61: '🌧️', // Slight rain
  63: '🌧️', // Moderate rain
  65: '🌧️', // Heavy rain
  71: '🌨️', // Slight snow
  73: '🌨️', // Moderate snow
  75: '❄️',  // Heavy snow
  80: '🌦️', // Slight showers
  81: '🌧️', // Moderate showers
  82: '🌧️', // Violent showers
  95: '⛈️',  // Thunderstorm
  96: '⛈️',  // Thunderstorm with hail
  99: '⛈️',  // Thunderstorm with heavy hail
}

export function getWeatherIcon(code: number): string {
  return WEATHER_ICONS[code] ?? '🌤️'
}

// Open-Meteo API (free, no key needed)
// Kisarazu area (35.38, 139.92)
export async function fetchWeather(): Promise<WeatherDay[]> {
  const today = new Date()
  const startDate = formatDate(today)
  const endDate = formatDate(new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000))

  const url = `https://api.open-meteo.com/v1/forecast?latitude=35.38&longitude=139.92&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia%2FTokyo&start_date=${startDate}&end_date=${endDate}`

  const res = await fetch(url)
  if (!res.ok) return []

  const data = await res.json()
  const days: WeatherDay[] = data.daily.time.map((date: string, i: number) => ({
    date,
    weatherCode: data.daily.weather_code[i],
    tempMax: Math.round(data.daily.temperature_2m_max[i]),
    tempMin: Math.round(data.daily.temperature_2m_min[i]),
  }))

  return days
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
