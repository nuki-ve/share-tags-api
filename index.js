import pc from 'picocolors'
import express from 'express'
import getMetaTagsFromWebsite from './logic/getMetaTags.js'
import path from 'path'
import { fileURLToPath } from 'url'
import logRequest from './logic/logRequest.js'
import trimWebsites from './logic/trimWebsites.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

const PORT = process.env.PORT ?? 3333

app.disable('x-powered-by')

app.use(logRequest)

// HOMEPAGE route
app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, '/index.html'))
})

// FAVICON route
app.get('/favicon.ico', (_, res) => {
  res.sendFile(path.join(__dirname, '/favicon.ico'))
})

app.get('/areyoualive', (_, res) => {
  res.contentType('text/plain')
  res.send("yes, I'm alive :) 👍")
})

// API route
// websites: comma separated list of urls
app.get('/:websites', async (req, res) => {
  // Limit to 10 URLs per request
  const urls = trimWebsites(req.params.websites).slice(0, 10)

  const results = await Promise.all(
    urls.map(url => getMetaTagsFromWebsite(url))
  )

  res.json(results)
})

app.listen(PORT)

console.log(
  pc.cyan(`[SERVER] Running on port ${pc.underline(pc.yellow(PORT))}`)
)
