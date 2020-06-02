const videoController = require('../controllers/video');
const { authToken } = require('../util/auth');
const { Router } = require('express');

const router = Router();

// POST request for creating an user
router.post('/', authToken, videoController.postVideo);
router.post('/:video_id', authToken, videoController.postVideoAnalysis);
router.get('/', authToken, videoController.getVideos);
router.get('/:video_id', authToken, videoController.getVideo);
router.get('/status', authToken, videoController.getVideoStatus);
router.delete('/:video_id', authToken, videoController.deleteVideo);
module.exports = router;
