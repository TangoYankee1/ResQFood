const express = require('express');
const router = express.Router();
const { createCrudController } = require('../controllers/crudController');

const donationsController = createCrudController('donations', 'donation_id', ['donor_id', 'food_type', 'quantity', 'pickup_address', 'pickup_time_start', 'pickup_time_end', 'status']);

// Define the routes and map them to the controller methods
router.get('/', donationsController.getAll);
router.get('/:id', donationsController.getById);
router.post('/', donationsController.create);
router.put('/:id', donationsController.update);
router.delete('/:id', donationsController.delete);

module.exports = router;