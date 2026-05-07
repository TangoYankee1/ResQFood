const express = require('express');
const router = express.Router();
const db = require('../services/db');
const { authenticateToken } = require('../middleware/auth');
const { catchAsync } = require('../controllers/crudController');

// Update user profile - using PATCH to allow partial updates
router.patch('/me', authenticateToken, catchAsync(async (req, res) => {
  const userId = req.user.id;
  const profileData = req.body;

  // Sanitize incoming data: an empty string is not a valid integer for the DB
  if (profileData.people_served === '') {
    profileData.people_served = null;
  }

  // Check if a profile already exists
  const [existingProfile] = await db.query('SELECT * FROM user_profiles WHERE user_id = ?', [userId]);

  let result;
  if (existingProfile) {
    // Update existing profile
    // Filter out any fields that are not allowed to be updated or are empty
    const allowedUpdates = ['organization_name', 'address', 'phone_number', 'availability', 'vehicle_access', 'food_types', 'people_served', 'delivery_notes'];
    const updates = {};
    for (const key of allowedUpdates) {
      if (profileData[key] !== undefined) {
        updates[key] = profileData[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update.' });
    }

    // Always mark as onboarded when they update their profile
    updates.is_onboarded = true;

    result = await db.query('UPDATE user_profiles SET ? WHERE user_id = ?', [updates, userId]);

  } else {
    // Create new profile
    profileData.user_id = userId;
    // Always mark as onboarded on creation
    profileData.is_onboarded = true;
    result = await db.query('INSERT INTO user_profiles SET ?', profileData);
  }

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: 'User profile not found or no new data to update.' });
  }

  res.json({ message: 'Profile updated successfully!' });
}));

module.exports = router;