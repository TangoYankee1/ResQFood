const express = require('express');
const router = express.Router();
const db = require('../services/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/db');
const { createCrudController, catchAsync } = require('../controllers/crudController');

const usersController = createCrudController('users', 'user_id', ['username', 'email', 'password_hash', 'role']);

// Custom routes for registration and login
router.post('/register', catchAsync(async (req, res) => {
  const { username, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await db.query(
    'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [username, email, hashedPassword, role]
  );
  res.status(201).json({ message: 'User registered successfully!', userId: result.insertId });
}));

router.post('/login', catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const users = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  if (users.length === 0) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const user = users[0];
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.user_id, role: user.role }, config.jwtSecret, { expiresIn: '1h' });
  res.json({ token });
}));

// Standard CRUD routes
router.get('/', usersController.getAll);
router.get('/:id', usersController.getById);
router.post('/', usersController.create);
router.put('/:id', usersController.update);
router.delete('/:id', usersController.delete);

module.exports = router;