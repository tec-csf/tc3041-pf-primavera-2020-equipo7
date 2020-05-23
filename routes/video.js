const videoController = require('../controllers/video');
const { Router } = require('express');

const router = Router();

// POST request for creating an user
router.post('/', videoController.postVideo);
router.post('/:video_id', videoController.postVideoAnalysis);
router.get('/:user_id', videoController.getVideos);
router.get('/:user_id/:video_id', videoController.getVideo);
//TODO delete
module.exports = router;
