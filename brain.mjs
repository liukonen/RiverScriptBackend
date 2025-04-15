import RiveScript from 'rivescript'

// Initialize bot
const bot = new RiveScript()

try {
  await bot.loadFile('rs-standard.rive')
  bot.sortReplies()
  console.log('Bot has finished loading!')
} catch (error) {
  console.error('Error loading RiveScript files:', error)
}

// Reply handler
export async function botreply(user, input) {
  return bot.reply(user, input)
}

// Detect if input looks like an information query
export function isInformationQuery(query) {
  const normalized = query.toLowerCase()
  return /^(who( is|'s)|what is|tell me about)/.test(normalized)
}

// Clean up and extract the actual subject of the question
export function extractQuery(query) {
  return query
    .toLowerCase()
    .replace(/^(who( is|'s)|what is|tell me about)/, '')
    .trim()
}
