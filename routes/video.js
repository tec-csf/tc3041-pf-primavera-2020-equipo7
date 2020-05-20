const videoController = require('../controllers/video');

// POST request for creating an user
router.post('/videos', videoController.video_create);

// DELETE request to delete user.
router.delete('/videos/:id', videoController.video_delete);

// POST request to update user.
router.post('/videos/:id', videoController.video_update);

// GET request for one user.
router.get('/user/:id', videoController.video_detail);

// GET request for list of all user items.
router.get('/videos/:page_no', videoController.video_list);

//Search for an user with its email address
router.post('/video/:string', videoController.video_search);

//count all videos using get
router.get('/video', videoController.video_total);


exports.router;
