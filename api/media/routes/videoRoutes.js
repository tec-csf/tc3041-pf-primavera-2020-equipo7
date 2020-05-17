const video_controller = require('../controllers/videoController');

// POST request for creating an user
router.post('/videos/', video_controller.video_create);

// DELETE request to delete user.
router.delete('/videos/:id/', video_controller.video_delete);

// POST request to update user.
router.post('/videos/:id/', video_controller.video_update);

// GET request for one user.
router.get('/user/:id/', video_controller.video_detail);

// GET request for list of all user items.
router.get('/videos/:page_no/', video_controller.video_list);

//Search for an user with its email address
router.post('/video/:string/', video_controller.video_search);

//count all videos using get
router.get('/video/', video_controller.video_total);