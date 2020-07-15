const bcrypt = require('bcryptjs'); // импорт модуля для создания хешей
const jwt = require('jsonwebtoken'); // импорт модуля для создания токенов
const User = require('../models/user');

// поиск всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

// поиск пользователя по id
module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user == null) {
        res.status(404).send({ message: 'Нет такого пользователя' });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({ message: 'id пользователя передан в неверном формате' });
      } else {
        res.status(500).send({ message: err.name });
      }
    });
};

// создание пользователя
module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 5)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(400).send({ message: err.message }));
};

// обновление данных пользователя
module.exports.patchUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    })
    .then((user) => {
      if (user == null) {
        res.status(404).send({ message: 'Пользователь с таким id не найден' });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({ message: 'Данные пользователя переданы в неверном формате' });
      } else {
        res.status(500).send({ message: err.name });
      }
    });
};

// обновление аватара пользователя
module.exports.patchUserAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    })
    .then((user) => {
      if (user == null) {
        res.status(404).send({ message: 'Нет такого пользователя' });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({ message: 'Ссылка на аватар пользователя передана в неверном формате' });
      } else {
        res.status(500).send({ message: err.name });
      }
    });
};

// авторизация пользователя
module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret-key'); // создали токен
      res.send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};
