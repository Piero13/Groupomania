const express = require('express');
const router = express.Router();

const commentsCtrl = require('../controllers/comments');
const auth = require('../middleware/auth');

// Routes commentaires
router.post('/:publicationId/comments', auth, commentsCtrl.createComment);
router.put('/:publicationId/comments/:id', auth, commentsCtrl.updateComment);
router.delete('/:publicationId/comments/:id', auth, commentsCtrl.deleteComment);
router.get('/:publicationId/comments', auth, commentsCtrl.getAllComments);
router.get('/:publicationId/comments/:id', auth, commentsCtrl.getComment);

module.exports = router;