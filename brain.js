const RiveScript = require("rivescript");
const bot = new RiveScript();

function loading_done() {
  console.log("Bot has finished loading!");
  bot.sortReplies();
}

function loading_error(error, filename, lineno) {
  console.log("Error when loading files: " + error);
}

exports.botreply = async function(user, input) {
  return bot.reply(user, input);
};

bot.loadFile("rs-standard.rive").then(loading_done).catch(loading_error);
