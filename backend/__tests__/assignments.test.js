const request = require('supertest');
const express = require('express');
const mysql = require('mysql2/promise');

// Mock the db service
const mockDb = {
  query: jest.fn(),
  end: jest.fn(),
};
jest.mock('../services/db', () => mockDb);

const assignmentsRouter = require('../routes/assignments');

// Set up an express app for testing
const app = express();
app.use(express.json());
app.use('/api/assignments', assignmentsRouter);

describe('Assignment API', () => {
  let testDbConnection;

  beforeAll(async () => {
    testDbConnection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'resqfood_test_assignments',
    });

    mockDb.query.mockImplementation(async (sql, params) => {
      const [results] = await testDbConnection.query(sql, params);
      return results;
    });

    await testDbConnection.query(`
      CREATE TABLE assignments (
        assignment_id INT AUTO_INCREMENT PRIMARY KEY,
        donation_id INT NOT NULL,
        volunteer_id INT,
        delivery_status ENUM('pending', 'in_progress', 'completed', 'failed') NOT NULL DEFAULT 'pending'
      );
    `);
  });

  beforeEach(async () => {
    await testDbConnection.query('TRUNCATE TABLE assignments');
  });

  afterAll(async () => {
    await testDbConnection.query('DROP TABLE assignments');
    await testDbConnection.end();
  });

  it('should return an empty array of assignments initially', async () => {
    const res = await request(app).get('/api/assignments');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  it('should create a new assignment', async () => {
    const newAssignment = {
      donation_id: 1,
      volunteer_id: 1
    };
    const res = await request(app)
      .post('/api/assignments')
      .send(newAssignment);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Assignment created successfully!');
    expect(res.body).toHaveProperty('assignmentId');
  });

  it('should return an array with one assignment after one is created', async () => {
    const newAssignment = {
      donation_id: 1,
      volunteer_id: 1
    };
    await request(app).post('/api/assignments').send(newAssignment);

    const res = await request(app).get('/api/assignments');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty('volunteer_id', 1);
  });
});