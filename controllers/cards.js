const Card = require('../models/card');

// поиск всех карточек
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

// создание карточки
module.exports.postCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user; // берем id, полученный из милдверы авторизации
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({ message: 'Данные карточки переданы в неверном формате' });
      } else {
        res.status(500).send({ message: err.name });
      }
    });
};
// удаление карточки по id
module.exports.delCard = (req, res) => {
  const { cardId } = req.params;
  const userId = `${req.user._id}`;
  Card.findById(cardId)
    .then((card) => {
      if (card == null) {
        res.status(404).send({ message: 'Карточка с таким id не найдена' });
      } else {
        const cardOwner = `${card.owner}`; // приводим к одному типу для соблюдения стандарта линтера при использовании оператров сравнения
        if (userId === cardOwner) {
          Card.findByIdAndRemove(cardId)
            .then((mycard) => res.send({ message: 'Карточка удалена', data: mycard }))
            .catch((err) => res.status(500).send({ message: err.message }));
        } else {
          res.status(403).send({ message: 'Нет прав на удаление этой карточки' });
        }
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({ message: 'id карточки передан в неверном формате' });
      } else {
        res.status(500).send({ message: err.name });
      }
    });
};

// поставить лайк карточки, сохранить id пользователя в массив лайков
module.exports.likeCard = (req, res) => {
  // const { cardId } = req.params.cardId;
  // const { userId } = req.user;
//  res.send({ method: 'method likeCard', card: req.params.cardId, user: req.user._id });
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (card == null) {
        res.status(404).send({ message: 'Карточка с таким id не найдена' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({ message: 'id карточки передан в неверном формате' });
      } else {
        res.status(500).send({ message: err.name });
      }
    });
};

// убрать лайк с карточки, убрать id пользователя из массива лайков
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (card == null) {
        res.status(404).send({ message: 'Карточка с таким id не найдена' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({ message: 'id карточки передан в неверном формате' });
      } else {
        res.status(500).send({ message: err.name });
      }
    });
};
