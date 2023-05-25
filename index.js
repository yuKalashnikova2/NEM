import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

mongoose
  .connect(
    'mongodb+srv://yulia:12345www@cluster0.lqi18gx.mongodb.net/?retryWrites=true&w=majority'
  )
  .then(() => console.log('DB ok'))
  .catch((err) => console.log(err, 'DB err'))

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.post('/login', (req, res) => {
  console.log(req.body)

  const token = jwt.sign(
    {
      email: req.body.email,
      fullName: 'Yuliya Kalashnikova',
    },
    'secret123'
  )
  res.json({
    response: 'success',
    token,
  })
})

app.listen(65534, (err) => {
  if (err) {
    console.log('Server err')
  }
  console.log('Server ok')
})
