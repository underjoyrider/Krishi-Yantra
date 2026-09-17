const express = require('express');
const router = express.Router();
const supportController = require('../controllers/support.controller');

router.get('/faqs', supportController.getFaqs);
router.get('/tickets', supportController.getTickets);
router.post('/tickets', supportController.createTicket);

module.exports = router;
