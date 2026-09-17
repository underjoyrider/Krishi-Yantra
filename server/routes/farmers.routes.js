const express = require('express');
const router = express.Router();
const farmersController = require('../controllers/farmers.controller');
const bookingsController = require('../controllers/bookings.controller');
const { validateFarmerCreation } = require('../middleware/validate.middleware');

// Create new farmer profile
router.post('/', validateFarmerCreation, farmersController.createFarmer);

// Get farmer bookings
router.get('/:id/bookings', bookingsController.getFarmerBookings);

// Get farmer information by ID or phone
router.get('/:id', farmersController.getFarmerById);

// Update farmer profile
router.patch('/:id', farmersController.updateFarmer);
router.delete('/:id', farmersController.deleteFarmer);

module.exports = router;
