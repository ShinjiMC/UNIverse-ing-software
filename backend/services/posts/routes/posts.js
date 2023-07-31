const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
router.use(bodyParser.json());
const publicacionesController = require('../controllers/posts_controller.js');

router.post('/post', publicacionesController.createPost);
router.get('/post', publicacionesController.getPost);
router.delete('/post',publicacionesController.deletePost);  
router.put('/post',publicacionesController.updatePost);


module.exports = router;