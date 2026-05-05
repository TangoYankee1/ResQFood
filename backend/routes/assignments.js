const express = require('express');
const router = express.Router();
const db = require('../services/db');
const { createCrudController } = require('../controllers/crudController');

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const assignmentsController = createCrudController('assignments', 'assignment_id', ['donation_id', 'volunteer_id', 'delivery_status']);

// Define the routes and map them to the controller methods
router.get('/', assignmentsController.getAll);
router.get('/:id', assignmentsController.getById);
router.post('/', catchAsync(async (req, res) => {
  const { donation_id, volunteer_id } = req.body;
  const result = await db.query(
    'INSERT INTO assignments (donation_id, volunteer_id) VALUES (?, ?)',
    [donation_id, volunteer_id]
  );
  res.status(201).json({
    message: 'Assignment created successfully!',
    assignmentId: result.insertId,
  });
}));
router.put('/:id', assignmentsController.update);
router.delete('/:id', assignmentsController.delete);

module.exports = router;