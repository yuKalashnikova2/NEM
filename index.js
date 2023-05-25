import express from 'express'
import mongoose from 'mongoose'
import { validationResult } from 'express-validator'
import { registerValidator } from './validatios/auth.js'
import UserModel from './models/User.js'

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

app.post('/auth/register', registerValidator, (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array())
  }

  const doc = new UserModel({
    email: req.body.email,
    fullName: req.body.email,
    avatarUrl: req.body.avatarUrl,
    passwordHash: req.body.passwordHash,
  })

  res.json({
    success: true,
  })
})

app.listen(65534, (err) => {
  if (err) {
    console.log('Server err')
  }
  console.log('Server ok')
})
