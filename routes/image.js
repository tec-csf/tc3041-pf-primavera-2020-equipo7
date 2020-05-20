const express = require('express');
const router = express.Router();
const imagesController = require('../controllers/image');
const path = require('path');

// POST request for uploading an image
router.post('/', imagesController.postImage);

router.get('/:id', imagesController.getImages);

// router.get('/images/uploads/', )
module.exports = router;
