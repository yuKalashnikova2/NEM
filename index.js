import express from 'express'

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.post('/login', (req, res) => {
  console.log(req.body)
  res.json({
    response: 'success',
  })
})

app.listen(65534, (err) => {
  if (err) {
    console.log('Server err')
  }
  console.log('Server ok')
})
