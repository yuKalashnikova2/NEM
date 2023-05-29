import express from 'express'
import mongoose from 'mongoose'
import { loginValidator, registerValidator, postCreateValidator } from './validatios/validation.js'
import checkAuth from './utils/checkAuth.js'
import * as UserController from './controller/UserController.js'

mongoose
  .connect('mongodb+srv://yulia:12345www@cluster0.lqi18gx.mongodb.net/blog')
  .then(() => console.log('DB ok'))
  .catch((err) => console.log(err, 'DB err'))

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Домашняя страница')
})

app.post('/auth/login', loginValidator, UserController.login)
app.post('/auth/register', registerValidator, UserController.register)

app.get('/auth/me', checkAuth, UserController.getMe)

app.listen(65534, (err) => {
  if (err) {
    console.log('Server err')
  }
  console.log('Server ok')
})
