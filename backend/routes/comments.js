const express = require('express');
const router = express.Router();

const commentsCtrl = require('../controllers/comments')
const auth = require('../middleware/auth');

// Routes commentaires
router.post('/', auth, commentsCtrl.createComment);
router.put('/:id', auth, commentsCtrl.updateComment);
router.delete('/:id', auth, commentsCtrl.deleteComment);
router.get('/', auth, commentsCtrl.getAllComments);
router.get('/:id', auth, commentsCtrl.getComment);

module.exports = router;