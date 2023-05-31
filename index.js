import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import {
  loginValidator,
  registerValidator,
  postCreateValidator,
} from './validatios/validation.js'
import checkAuth from './utils/checkAuth.js'
import * as UserController from './controller/UserController.js'
import * as PostController from './controller/PostController.js'
import handleValidationErrors from './utils/handleValidationErrors.js'

mongoose
  .connect('mongodb+srv://yulia:12345www@cluster0.lqi18gx.mongodb.net/blog')
  .then(() => console.log('DB ok'))
  .catch((err) => console.log(err, 'DB err'))

const app = express()

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads')
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage })

app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.get('/', (req, res) => {
  res.send('Домашняя страница')
})

app.post('/auth/login', loginValidator, handleValidationErrors, UserController.login)
app.post('/auth/register',  registerValidator,  handleValidationErrors, UserController.register)

app.post('/upload', upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  })
})
app.get('/auth/me', checkAuth, UserController.getMe)

app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidator, handleValidationErrors, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidator, handleValidationErrors,PostController.update)

app.listen(65534, (err) => {
  if (err) {
    console.log('Server err')
  }
  console.log('Server ok')
})
