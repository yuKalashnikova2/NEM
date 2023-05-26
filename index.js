import express from 'express'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'
import { registerValidator } from './validatios/auth.js'
import UserModel from './models/User.js'

mongoose
  .connect(
    'mongodb+srv://yulia:12345www@cluster0.lqi18gx.mongodb.net/blog'
  )
  .then(() => console.log('DB ok'))
  .catch((err) => console.log(err, 'DB err'))

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.post('/auth/register', registerValidator, async (req, res) => {
  try {
    const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array())
  }

  const password = req.body.password
  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(password, salt)

  const doc = new UserModel({
    email: req.body.email,
    fullName: req.body.email,
    avatarUrl: req.body.avatarUrl,
    passwordHash,
  })

  const user = await doc.save()

  res.json(user)
  } catch(error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось зарегистрировать пользователя'
    })
  }
})

app.listen(65534, (err) => {
  if (err) {
    console.log('Server err')
  }
  console.log('Server ok')
})
