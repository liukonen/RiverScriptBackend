const NodeCache = require("node-cache");
const axios = require("axios").default;
const myCache = new NodeCache();

exports.GetWeather = async function() {
    console.log("hit weather");
    let value = myCache.get("weather");
    if (value == undefined) {
        let js = await axios({
            method: "get",
            headers: { 'User-Agent': '(bot.liukonen.dev, liukonen@gmail.com)' },
            url: "https://api.weather.gov/gridpoints/MKX/80,70/forecast",
            responseType: "json"
        });

        let textvalue = js.data.properties.periods[0].detailedForecast;
        console.log(textvalue);


        value =
            "I'm not sure where you live, but in Milwaukee, we are looking at " +
            textvalue;
        console.log(value);
        myCache.set("weather", value, 3600);
    }
    console.log(value);
    return value;
};