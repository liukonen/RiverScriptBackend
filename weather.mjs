const WEATHER_API_URL = "https://api.weather.gov/gridpoints/MKX/80,70/forecast"
const domain = process.env.DOMAIN || "yourdomain.com"
const email = process.env.EMAIL_ADDRESS || "you@example.com"

// Simple in-memory cache
const cache = new Map()

export async function GetWeather() {
  const cached = cache.get("weather")
  const now = Date.now()

  // If cached value exists and is <1hr old
  if (cached && (now - cached.timestamp < 3600_000)) {
    return cached.value
  }

  try {
    const res = await fetch(WEATHER_API_URL, {
      headers: {
        "User-Agent": `(${domain}, ${email})`,
        "Accept": "application/json"
      }
    })

    if (!res.ok) throw new Error("Weather API request failed")

    const data = await res.json()
    const forecast = data.properties?.periods?.[0]?.detailedForecast

    if (!forecast) throw new Error("Forecast missing")

    const weather = `I'm not sure where you live, but in Milwaukee, we are looking at ${forecast}`

    cache.set("weather", { value: weather, timestamp: now })

    return weather
  } catch (err) {
    console.error("Weather fetch failed:", err)
    return "I'm having trouble getting the weather right now."
  }
}
