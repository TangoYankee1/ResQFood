const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;
const usersRouter = require('./routes/users');
const donationsRouter = require('./routes/donations');
const assignmentsRouter = require('./routes/assignments');
const beneficiariesRouter = require('./routes/beneficiaries');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the ResQFood API!');
});

app.use('/api/users', usersRouter);
app.use('/api/donations', donationsRouter);
app.use('/api/assignments', assignmentsRouter);
app.use('/api/beneficiaries', beneficiariesRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});