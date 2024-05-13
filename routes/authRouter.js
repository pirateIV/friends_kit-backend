const express = require('express');
const router = express.Router();

const { getSpecificUser, getSpecificUserPosts } = require('../controllers/users');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getSpecificUser)

module.exports = router;