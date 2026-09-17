const express = require('express');
const router = express.Router();
const centersController = require('../controllers/centers.controller');

// Smart recommendation endpoint
router.get('/recommendation', centersController.getRecommendation);

// Get all centers with sorting, filtering, and search
router.get('/', centersController.getCenters);

// Get specific center details by ID or code
router.get('/:id', centersController.getCenterById);

// Update center status (OPEN, BUSY, HIGH_DEMAND, CLOSED)
router.patch('/:id/status', centersController.updateStatus);

module.exports = router;
