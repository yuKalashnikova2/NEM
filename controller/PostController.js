import PostModel from '../models/Post.js'

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec()

    res.json(posts)
  } catch (error) {
    console.log(err)
    res.status(500).json({
      message: 'Не удалось получить статьи',
    })
  }
}

export const getOne = (req, res) => {
  const postId = req.params.id
  PostModel.findOneAndUpdate(
    {
      _id: postId,
    },
    {
      $inc: { viewsCount: 1 },
    }
  )
    .then((doc) => {
      if (!doc) {
        return res.status(404).json({
          message: 'Статья не найдена',
        })
      }
      return res.json(doc)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({
        message: 'Не удалось загрузить статью',
      })
    })
}

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.body.userId,
    })

    const post = await doc.save()
    res.json(post)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Не удалось зарегистрироваться',
    })
  }
}

export const remove = (req, res) => {
  const postId = req.params.id
  PostModel.findOneAndDelete({
    _id: postId,
  })
    .then((doc) => {
      if (!doc) {
        return res.status(404).json({
          message: 'Статья не найдена',
        })
      }
      return res.json({
        message: true,
      })
    })
    .catch((error) => {
      console.log(error)
      return res.status(500).json({
        message: 'Не удалось удалить статью',
      })
    })
}
