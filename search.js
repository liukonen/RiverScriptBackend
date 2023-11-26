const { default: axios } = require("axios")

module.exports.getInfo = async (request) => {
    return axios
        .get('https://api.duckduckgo.com/', { params: { q: request, format: 'json', kp: -2 } })
        .then(response => {
            const result = response.data;
            if (result.AbstractText) return `I found on DuckDuckGo that ${result.AbstractText}`;
            if (result.AbstractURL) return `I found something from DuckDuckGo on ${result.AbstractSource} ${result.Heading} ${result.AbstractURL}`;
            return "Sorry, I couldn't find any relevant information.";
        })
        .catch(error => {
            console.log(error)
            return "sorry, I have a bit of a headache right now."
        })
}