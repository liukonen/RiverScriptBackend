const RiveScript = require("rivescript")
const bot = new RiveScript()

bot.loadFile("rs-standard.rive")
    .then(() => {
        console.log("Bot has finished loading!")
        bot.sortReplies()
    })
    .catch(error => {
        console.log(`Error when loading files: ${error}`)
    })

exports.botreply = async (user, input) => {
    return bot.reply(user, input)
}

exports.isInformationQuery = (query) => {
    return (
        query.includes("who's") ||
        query.includes("who is") ||
        query.includes("tell me about") ||
        query.includes("what is")
    )
}

exports.extractQuery = (query) => {
    return query
        .replace(/who's/g, '')
        .replace(/who is/g, '')
        .replace(/tell me about/g, '')
        .replace(/what is/g, '')
        .trim()
}