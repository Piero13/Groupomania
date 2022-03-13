const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/users');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Routes utilisateurs
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.put('/:id', auth, multer, userCtrl.updateUser);
router.delete('/:id', auth, userCtrl.deleteUser);
router.get('/all', auth, userCtrl.getAllUsers);
router.get('/:id', auth, userCtrl.getUser);

module.exports = router