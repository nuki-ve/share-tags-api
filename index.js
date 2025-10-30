import express from 'express'
import pc from 'picocolors'
import getMetaTagsFromUrls from './logic/getMetaTags.js'
const app = express()

const PORT = process.env.PORT ?? 3333

app.disable('x-powered-by')

const logRequest = (req, res, next) => {
  console.log(pc.magenta(`[REQUEST] ${req.method} ${pc.white(req.url)}`))
  next()
}

app.use(logRequest)

app.get('/', (req, res) => {
  res.send('Add website URLs to the path, separated by commas. e.g: /url1.com,url2.net,url3.ve')
})

app.get('/:urlList', async (req, res) => {
  const urlString = req.params.urlList
  const urls = urlString.split(',')

  const results = await Promise.all(
    urls.map(url => getMetaTagsFromUrls(url))
  )

  res.json({
    count: results.length,
    data: results
  })
})

app.listen(PORT)

console.log(
  pc.cyan(`[SERVER] Running on ${pc.underline(pc.yellow(`http://localhost:${PORT}`))}`)
)
