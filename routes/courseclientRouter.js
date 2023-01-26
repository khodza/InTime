const router = require('express').Router();
const bookclientController = require('../controllers/bookclientController');

router
  .route('/')
  .get(bookclientController.getAllBookclients)
  .post(bookclientController.addBookclient);

router
  .route('/:id')
  .get(bookclientController.getBookclient)
  .delete(bookclientController.deleteBookclient);

module.exports = router;
