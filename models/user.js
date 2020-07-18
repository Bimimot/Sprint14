const mongoose = require('mongoose');
const validatorNpm = require('validator');
const bcrypt = require('bcryptjs'); // импорт модуля для создания хешей

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    validate: {
      validator(text) {
        return (validatorNpm.isURL(text));
      },
      message: (props) => `${props.value} Это неправильная ссылка на фото для профиля`,
    },
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validator(text) {
      return (validatorNpm.isEmail(text));
    },
    message: (props) => `${props.value} Неверно указана электронная почта`,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function checkUser(email, password) {
  return this.findOne({ email }).select('+password') // при вызове метода указываем, что в объект необходимо добавить  пароль для обработки и получения токена
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password) // сравнение хэшей
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user; // возвращаем объект user для использования в контроллерах
        });
    });
};

module.exports = mongoose.model('user', userSchema);
