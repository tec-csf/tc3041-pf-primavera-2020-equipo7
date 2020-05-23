const videoController = require('../controllers/video');
const { Router } = require('express');

const router = Router();

// POST request for creating an user
router.post('/', videoController.postVideo);
router.post('/analysis', videoController.postVideoAnalysis);
router.get('/:user', videoController.getVideos);
router.get('/details/:id/', videoController.getVideo);

module.exports = router;
