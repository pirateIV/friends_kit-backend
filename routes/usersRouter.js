const multer = require('multer');
const router = require('express').Router();
const userController = require('../controllers/users');

router.route('/').get(userController.getAllUsers).post(userController.createNewUser);

router.param('id', userController.checkId);

const upload = multer({ dest: 'public/img/users' });

router
  .route('/:id')
  .put(userController.updateUser)
  .delete(userController.deleteUser)
  .get(upload.single('photo'), userController.getSpecificUser);

module.exports = router;
