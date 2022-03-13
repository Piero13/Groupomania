const express = require('express');
const router = express.Router();

const publicationsCtrl = require('../controllers/publications')
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Routes publications
router.post('/add', auth, multer, publicationsCtrl.createPublication);
router.put('/:id', auth, multer, publicationsCtrl.updatePublication);
router.delete('/:id', auth, publicationsCtrl.deletePublication);
router.get('/all', auth, publicationsCtrl.getAllPublications);
router.get('/:id', auth, publicationsCtrl.getPublication);
router.post('/:id/like', auth, publicationsCtrl.likes);
router.get('/:id/likes', auth, publicationsCtrl.getLikes);

module.exports = router;
