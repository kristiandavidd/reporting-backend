const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();
const db = require('../config/db');

const app = express();

router.post('/register', register);

router.post('/login', login);

module.exports = router;