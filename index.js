import express from 'express'
import pc from 'picocolors'
import getMetaTagsFromUrls from './logic/getMetaTags.js'
import trimUrls from './logic/trimUrls.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

const PORT = process.env.PORT ?? 3333

app.disable('x-powered-by')

/**
 * Prints in console the incoming requests
 * @param {express.Request} req Request
 * @param {express.Response} _ Response
 * @param {express.NextFunction } next Next function
 */
const logRequest = (req, _, next) => {
  console.log(pc.magenta(`[REQUEST] ${req.method} ${pc.white(req.url)}`))
  next()
}

app.use(logRequest)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'))
  // res.send('Add website URLs to the path, separated by commas. e.g: /url1.com,url2.net,url3.ve')
})

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, '/favicon.ico'))
})

app.get('/:urlList', async (req, res) => {
  const urls = trimUrls(req.params.urlList)

  const results = await Promise.all(
    urls.map(url => getMetaTagsFromUrls(url))
  )

  res.json(results)
})

app.listen(PORT)

console.log(
  pc.cyan(`[SERVER] Running on port ${pc.underline(pc.yellow(PORT))}`)
)
