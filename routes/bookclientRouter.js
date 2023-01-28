const router = require('express').Router();
const bookclientController = require('../controllers/bookclientController');

router
  .route('/')
  .post(
    bookclientController.addBookclient,
    bookclientController.sendMessageReg
  );
router
  .route('/tolov')
  .post(
    bookclientController.uploadPhoto.single('image'),
    bookclientController.addPayedclient,
    bookclientController.sendMessagePayment
  );
module.exports = router;
