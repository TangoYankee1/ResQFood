const express = require('express');
const router = express.Router();
const db = require('../services/db');

// Create a new beneficiary
router.post('/', async (req, res) => {
  const { name, address, contact_person, contact_phone } = req.body;

  if (!name || !address) {
    return res.status(400).json({ message: 'Please provide a name and address.' });
  }

  try {
    const result = await db.query(
      'INSERT INTO beneficiaries (name, address, contact_person, contact_phone) VALUES (?, ?, ?, ?)',
      [name, address, contact_person, contact_phone]
    );

    res.status(201).json({ message: 'Beneficiary created successfully!', beneficiaryId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Get all beneficiaries
router.get('/', async (req, res) => {
  try {
    const beneficiaries = await db.query('SELECT * FROM beneficiaries');
    res.json(beneficiaries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Get a single beneficiary by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const beneficiaries = await db.query('SELECT * FROM beneficiaries WHERE beneficiary_id = ?', [id]);
    if (beneficiaries.length === 0) {
      return res.status(404).json({ message: 'Beneficiary not found.' });
    }
    res.json(beneficiaries[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Update a beneficiary
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, address, contact_person, contact_phone } = req.body;

  if (!name || !address) {
    return res.status(400).json({ message: 'Please provide a name and address.' });
  }

  try {
    const result = await db.query(
      'UPDATE beneficiaries SET name = ?, address = ?, contact_person = ?, contact_phone = ? WHERE beneficiary_id = ?',
      [name, address, contact_person, contact_phone, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Beneficiary not found.' });
    }

    res.json({ message: 'Beneficiary updated successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Delete a beneficiary
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM beneficiaries WHERE beneficiary_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Beneficiary not found.' });
    }

    res.json({ message: 'Beneficiary deleted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;