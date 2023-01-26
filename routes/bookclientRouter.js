const router = require('express').Router();
const bookclientController = require('../controllers/bookclientController');

router.route('/').post(bookclientController.addBookclient);
router
  .route('/tolov')
  .post(
    bookclientController.uploadPhoto.single('image'),
    bookclientController.addPayedclient
  );
module.exports = router;
