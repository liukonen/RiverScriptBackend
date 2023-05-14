const NodeCache = require("node-cache")
const axios = require("axios").default

const myCache = new NodeCache()
const WEATHER_CACHE_KEY = "weather"
const WEATHER_API_URL = "https://api.weather.gov/gridpoints/MKX/80,70/forecast"
const domain = process.env.DOMAIN
const email = process.env.EMAIL_ADDRESS


exports.GetWeather = async function() {
    const cachedValue = myCache.get(WEATHER_CACHE_KEY)
    if (cachedValue) {
        console.log("Serving weather from cache")
        return cachedValue
    }

    const { data } = await axios.get(WEATHER_API_URL, {
        headers: {
            "User-Agent": `(${domain}, ${email}`
        },
        responseType: "json"
    })

    const forecast = data.properties.periods[0].detailedForecast
    const weather = `header:{${domain}-${email}}  I'm not sure where you live, but in Milwaukee, we are looking at ${forecast}`
    console.log(weather)

    myCache.set(WEATHER_CACHE_KEY, weather, 3600)
    return weather
}