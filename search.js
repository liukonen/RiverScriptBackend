const dit = require("node-duckduckgo")

module.exports.getInfo = async function(request) {
    const result = await dit.duckIt(request, { noHtml: true, parentalFilter: 'Moderate' })
    console.log("Request processed")

    if (result.data.AbstractText) {
        return `I found on Duck Duck Go, that ${result.data.AbstractText}`
    }

    if (result.data.AbstractURL) {
        return `I found something from Duck Duck Go on ${result.data.AbstractSource} ${result.data.Heading} ${result.data.AbstractURL}`
    }

    return result.data.AbstractSource.trim()
}