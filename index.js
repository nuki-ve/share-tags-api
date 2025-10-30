import express from 'express'
const app = express()

const PORT = process.env.PORT ?? 3333

app.get('/', (req, res) => {
  res.send('Hello World')
  console.log('GET', req.url)
})

app.listen(PORT)