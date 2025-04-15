import Fastify from 'fastify'
import helmet from '@fastify/helmet'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'

import { getInfo } from './search.mjs'
import { botreply, isInformationQuery, extractQuery } from './brain.mjs' 
import { GetWeather } from './weather.mjs'
import { corsOptions, paths,  isOk } from './config.mjs';

const fastify = Fastify({ logger: true })

// Helmet
await fastify.register(helmet)

// Swagger
await fastify.register(swagger, {
  swagger: {
    info: {
      title: 'RiverScript Bot',
      description: `This API is used for the RiverScript Bot at Chat.liukonen.dev. The source code to this bot is open-source and available for anyone to use. I am leaving this open freely for anyone to use if they want to play around. I do ask the following:<br/>
        1. Do not use the bot for any spamming, spoofing or malice<br/>
        2. Do not bombard or DNS attack the bot. It’s running on a Raspberry Pi<br/>
        3. Understand that responses and content may come from third-party sources like DuckDuckGo and NOAA.<br/>
        <b>In general, be kind to the bot.</b>`,
      version: '1.0.0',
      contact: { email: 'liukonen@gmail.com' },
      license: {
        name: 'MIT',
        url: 'https://github.com/liukonen/RiverScriptBackend/blob/Main/LICENSE'
      }
    },
    host: 'bot.liukonen.dev',
    schemes: ['https'],
    consumes: ['application/json'],
    produces: ['application/json']
  }
})

await fastify.register(swaggerUI, {
  routePrefix: paths.swagger,
  uiConfig: { docExpansion: 'list' },
  staticCSP: true
})

// CORS headers (manual, or use @fastify/cors if needed)
fastify.addHook('onSend', async (request, reply, payload) => {
  reply.header('Access-Control-Allow-Origin', corsOptions.allowedOrigin)
  reply.header('Access-Control-Allow-Headers', corsOptions.allowedHeaders)
  return payload
})

// Health check
fastify.get(paths.health, async () => {
  return { everything: isOk }
})

// Main chatbot route
fastify.get(paths.base, async (request, reply) => {
  const user = request.query.user || 'local-user'
  const rawInput = request.query.text

  if (!rawInput) {
    reply.redirect(paths.swagger)
    return
  }

  const query = rawInput.toLowerCase().trim()

  try {
    if (query.includes('weather')) {
      const weather = await GetWeather()
      return { response: weather }
    } else if (isInformationQuery(query)) {
      const info = await getInfo(extractQuery(query))
      return { response: info }
    } else {
      const filteredInput = rawInput.replace(/['"]+/g, '')
      const response = await botreply(user, filteredInput)
      return { response }
    }
  } catch (err) {
    fastify.log.error(err)
    reply.status(500).send({ error: 'Oops. Something went wrong.' })
  }
})

// Start server
const PORT = process.env.PORT || 5000
try {
  await fastify.listen({ port: PORT, host: '0.0.0.0' })
  console.log(`🚀 Fastify running on port ${PORT}`)
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
