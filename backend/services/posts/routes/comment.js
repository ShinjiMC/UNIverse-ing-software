const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
router.use(bodyParser.json());
const comentariosController = require('../controllers/comment_controller.js');

router.post('/post/:id/comment', comentariosController.createComment);
router.get('/post/:id/comment', comentariosController.getCommentsForPost);
router.delete('/post/:id/comment',comentariosController.deleteComment);
router.put('/post/:id/comment',comentariosController.updateComment);


module.exports = router;