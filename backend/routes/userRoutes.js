const express = require('express');
const { registerUser, loginUser, syncUser } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/sync', syncUser);

module.exports = router;
