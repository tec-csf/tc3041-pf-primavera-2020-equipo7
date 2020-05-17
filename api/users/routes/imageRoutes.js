const image_controller = require('../controllers/imageController');

// POST request for creating an image
router.post('/images/', image_controller.image_create);

// DELETE request to delete image.
router.delete('/images/:id/', image_controller.image_delete);

// POST request to update image.
router.post('/images/:id/', image_controller.image_update);

// display metadata of an image
router.get('/image/:id/', image_controller.image_detail);

// GET request for list of all image items.
router.get('/images/:page_no/', image_controller.image_list);

//Search for an image... necessary?
router.post('/image/:string/', image_controller.image_search);

//count all videos using get
router.get('/image/', image_controller.image_total);