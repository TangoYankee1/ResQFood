const express = require('express');
const router = express.Router();
const db = require('../services/db');

// Create a new assignment
router.post('/', async (req, res) => {
  const { donation_id, volunteer_id } = req.body;

  if (!donation_id || !volunteer_id) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  try {
    // 1. Create the assignment
    const result = await db.query(
      'INSERT INTO assignments (donation_id, volunteer_id) VALUES (?, ?)',
      [donation_id, volunteer_id]
    );

    // 2. Update the donation status to 'assigned'
    await db.query(
      "UPDATE donations SET status = 'assigned' WHERE donation_id = ?",
      [donation_id]
    );

    res.status(201).json({ message: 'Assignment created successfully!', assignmentId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Get all assignments
router.get('/', async (req, res) => {
  try {
    const assignments = await db.query('SELECT * FROM assignments');
    res.json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Get a single assignment by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const assignments = await db.query('SELECT * FROM assignments WHERE assignment_id = ?', [id]);
    if (assignments.length === 0) {
      return res.status(404).json({ message: 'Assignment not found.' });
    }
    res.json(assignments[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Update an assignment
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { pickup_timestamp, delivery_timestamp } = req.body;

  try {
    const result = await db.query(
      'UPDATE assignments SET pickup_timestamp = ?, delivery_timestamp = ? WHERE assignment_id = ?',
      [pickup_timestamp, delivery_timestamp, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Assignment not found.' });
    }

    res.json({ message: 'Assignment updated successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Delete an assignment
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Get the donation_id before deleting the assignment
    const assignments = await db.query('SELECT donation_id FROM assignments WHERE assignment_id = ?', [id]);
    if (assignments.length === 0) {
      return res.status(404).json({ message: 'Assignment not found.' });
    }
    const { donation_id } = assignments[0];

    // 2. Delete the assignment
    await db.query('DELETE FROM assignments WHERE assignment_id = ?', [id]);

    // 3. Update the donation status back to 'pending'
    await db.query(
      "UPDATE donations SET status = 'pending' WHERE donation_id = ?",
      [donation_id]
    );

    res.json({ message: 'Assignment deleted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;