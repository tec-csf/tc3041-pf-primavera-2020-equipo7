const express = require('express');
const router = express.Router();
const image_controller = require('../controllers/imageController');

// POST request for uploading an image
router.post('/images/upload', image_controller.image_upload);

module.exports = router;