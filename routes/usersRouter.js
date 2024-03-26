const router = require('express').Router();
const userController = require('../controllers/userController');

router.route('/').get(userController.getAllUsers).post(userController.createNewUser);
router
  .route('/:id')
  .get(userController.getSpecificUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
