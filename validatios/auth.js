import { body } from 'express-validator'

export const registerValidator = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 6 символов').isLength({
    min: 6,
  }),
  body('fullName', 'Укажите имя').isLength({ min: 5 }),
  body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(),
]
