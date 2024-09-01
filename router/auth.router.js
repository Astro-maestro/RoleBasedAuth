const express = require('express');
const authController = require('../app/controller/auth.controller');
const  authCheck  = require('../app/middleware/auth');

const router = express.Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout', authCheck, authController.logoutUser);
router.get('/dashboard', authCheck, authController.dashboard);

module.exports = router;