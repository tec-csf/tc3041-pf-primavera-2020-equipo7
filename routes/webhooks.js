const { Router } = require('express');

const webhookController = require('../controllers/webhooks');

const router = Router();

router.post('/checkout', webhookController.postCheckoutSession);

module.exports = router;
