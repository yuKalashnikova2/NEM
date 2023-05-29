import express from 'express'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import { registerValidator } from './validatios/auth.js'
import UserModel from './models/User.js'
import checkAuth from './utils/checkAuth.js'

mongoose
  .connect('mongodb+srv://yulia:12345www@cluster0.lqi18gx.mongodb.net/blog')
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
    const hash = await bcrypt.hash(password, salt)

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    })

    const user = await doc.save()

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      }
    )

    const { passwordHash, ...userData } = user._doc

    res.json({ ...userData, token })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Не удалось зарегистрировать пользователя',
    })
  }
})

app.post('/auth/login', async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email })

    if (!user) {
      return res.status(404).json({
        message: 'Пользователен не найден',
      })
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    )

    if (!isValidPass) {
      return res.status(400).json({
        message: 'Неверный логин или пароль',
      })
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      }
    )

    const { passwordHash, ...userData } = user._doc

    res.json({ ...userData, token })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Не удалось авторизоваться',
    })
  }
})

app.get('/auth/me', checkAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId)

    if (!user) {
      return req.status(404).json({
        message: 'Пользователь не найден',
      })
    }
    const { passwordHash, ...userData } = user._doc

    res.json(userData)
  } catch (error) {
    console.log(error)
    res.status.json({
      message: 'Нет доступа',
    })
  }
})

app.listen(65534, (err) => {
  if (err) {
    console.log('Server err')
  }
  console.log('Server ok')
})
