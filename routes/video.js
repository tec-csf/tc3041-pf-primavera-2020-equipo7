const videoController = require('../controllers/video');
const { Router } = require('express');

const router = Router();

// POST request for creating an user
router.post('/', videoController.postVideo);
router.post('/analysis', videoController.postVideoAnalysis);


module.exports = router;
