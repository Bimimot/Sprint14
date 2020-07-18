/* eslint-disable consistent-return */
// отключен запрет линтера на отсутствие return в стрелочной функции

const jwt = require('jsonwebtoken'); // подключаем модуль создания jwt токенов
const { cryptoKey } = require('../key'); // импорт ключа для зашифровки токена

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) { // если в заголовке нет авторизации или она начинается не с Bearer - выводим ошибку
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', ''); // убираем тип токена из заголовка, чтобы остался чистый токен
  let payload;

  try {
    payload = jwt.verify(token, cryptoKey); // расшиифровываем токен ключа, получаем пейлоад
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса (пейлоуд здесь - это id пользоваателя)

  next(); // пропускаем запрос дальше
};
