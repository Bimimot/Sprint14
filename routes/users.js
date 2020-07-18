const router = require('express').Router();
const auth = require('../middlewares/auth'); // подключаем мидлвэру авторизации

const {
  getUsers, getUserById, patchUser, patchUserAvatar,
} = require('../controllers/users'); // импорт методов из контроллера

router.use(auth); // вызываем авторизацию для всех методов идущих ниже

router.get('/', getUsers); // вызываем метод получения всех пользователей
router.get('/:id', getUserById); // вызываем метод получения пользователя по id
router.patch('/me', patchUser); // вызываем метод обновления имени пользователя
router.patch('/me/avatar', patchUserAvatar); // вызываем метод обновления ссылки на аватар пользователя

module.exports = router;
