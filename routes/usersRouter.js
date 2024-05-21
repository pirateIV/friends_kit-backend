const path = require("path");
const multer = require("multer");
const router = require("express").Router();

const userController = require("../controllers/users");
const authMiddleware = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const upload = multer({ storage: storage }).single("avatar");

router
  .route("/")
  .get(userController.getAllUsers)
  .post(upload, userController.createNewUser)
  .put(authMiddleware, userController.updateUser);

router.route("/search").get(userController.getUserBySearchQuery);

router
  .route("/:id")
  .get(userController.getUserById)
  .delete(userController.deleteUser);

module.exports = router;
