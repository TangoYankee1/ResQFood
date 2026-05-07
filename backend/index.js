const express = require('express');
const bodyParser = require('body-parser');
const beneficiariesRoutes = require('./routes/beneficiaries');
const donationsRoutes = require('./routes/donations');
const assignmentsRoutes = require('./routes/assignments');
const usersRoutes = require('./routes/users');
const profilesRoutes = require('./routes/profiles');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = 3001;

app.use(bodyParser.json());

app.use('/api/beneficiaries', beneficiariesRoutes);
app.use('/api/donations', donationsRoutes);
app.use('/api/assignments', assignmentsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/profiles', profilesRoutes);

// Use the error handler middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app; // Export the app for testing purposes