const express = require('express');
const router = express.Router();
const { createCrudController } = require('../controllers/crudController');

const beneficiariesController = createCrudController('beneficiaries', 'beneficiary_id', ['name', 'address', 'contact_person', 'contact_phone']);

// Define the routes and map them to the controller methods
router.get('/', beneficiariesController.getAll);
router.get('/:id', beneficiariesController.getById);
router.post('/', beneficiariesController.create);
router.put('/:id', beneficiariesController.update);
router.delete('/:id', beneficiariesController.delete);

module.exports = router;