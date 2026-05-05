const express = require('express');
const router = express.Router();
const db = require('../services/db');

// Create a new donation
router.post('/', async (req, res) => {
  const {
    donor_id,
    food_type,
    quantity,
    pickup_address,
    pickup_time_start,
    pickup_time_end
  } = req.body;

  if (!donor_id || !food_type || !quantity || !pickup_address || !pickup_time_start || !pickup_time_end) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  try {
    const result = await db.query(
      'INSERT INTO donations (donor_id, food_type, quantity, pickup_address, pickup_time_start, pickup_time_end) VALUES (?, ?, ?, ?, ?, ?)',
      [donor_id, food_type, quantity, pickup_address, pickup_time_start, pickup_time_end]
    );

    res.status(201).json({ message: 'Donation created successfully!', donationId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Get all donations
router.get('/', async (req, res) => {
  try {
    const donations = await db.query('SELECT * FROM donations');
    res.json(donations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Get a single donation by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const donations = await db.query('SELECT * FROM donations WHERE donation_id = ?', [id]);
    if (donations.length === 0) {
      return res.status(404).json({ message: 'Donation not found.' });
    }
    res.json(donations[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Update a donation
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    food_type,
    quantity,
    pickup_address,
    pickup_time_start,
    pickup_time_end,
    status
  } = req.body;

  if (!food_type || !quantity || !pickup_address || !pickup_time_start || !pickup_time_end || !status) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  try {
    const result = await db.query(
      'UPDATE donations SET food_type = ?, quantity = ?, pickup_address = ?, pickup_time_start = ?, pickup_time_end = ?, status = ? WHERE donation_id = ?',
      [food_type, quantity, pickup_address, pickup_time_start, pickup_time_end, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Donation not found.' });
    }

    res.json({ message: 'Donation updated successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Delete a donation
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM donations WHERE donation_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Donation not found.' });
    }

    res.json({ message: 'Donation deleted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;