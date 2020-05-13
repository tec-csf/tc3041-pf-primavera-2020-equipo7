const user_controller = require('../controllers/userController');


//////////////////// USERS ROUTES ///////////////////////

// POST request for creating an user
router.post('/users/', user_controller.user_create);

// DELETE request to delete user.
router.delete('/users/:id/', user_controller.user_delete);

// POST request to update user.
router.post('/users/:id/', user_controller.user_update);

// GET request for one user.
router.get('/user/:id/', user_controller.user_detail);

// GET request for list of all user items.
router.get('/users/:page_no/', user_controller.user_list);

//Search for an user with its email address
router.post('/user/:string/', user_controller.user_search);

//count all users using get
router.get('/user/', user_controller.user_total);