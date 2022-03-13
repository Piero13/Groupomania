const express = require('express');
const router = express.Router();

const publicationsCtrl = require('../controllers/publications')
const commentsCtrl = require('../controllers/comments')
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

// Routes commentaires
router.post('/:publicationId/comments', auth, commentsCtrl.createComment);
router.put('/:publicationId/comments/:id', auth, commentsCtrl.updateComment);
router.delete('/:publicationId/comments/:id', auth, commentsCtrl.deleteComment);
router.get('/:publicationId/comments', auth, commentsCtrl.getAllComments);
router.get('/:publicationId/comments/:id', auth, commentsCtrl.getComment);

module.exports = router;
