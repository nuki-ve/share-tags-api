import express from 'express'
import getMetaTagsFromUrls from './logic/getMetaTags.js'
const app = express()

const PORT = process.env.PORT ?? 3333

app.disable('x-powered-by')

app.get('/', (req, res) => {
  console.log('GET', req.url)
  res.send('Add website URLs to the path, separated by commas. e.g: /url1.com,url2.net,url3.ve')
})

app.get('/:urlList', async (req, res) => {
  console.log('GET', req.url)
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
