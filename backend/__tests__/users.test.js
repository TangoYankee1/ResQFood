const request = require('supertest');
const express = require('express');
const mysql = require('mysql2/promise');

// Mock the db service
const mockDb = {
  query: jest.fn(),
  end: jest.fn(),
};
jest.mock('../services/db', () => mockDb);

const usersRouter = require('../routes/users');

// Set up an express app for testing
const app = express();
app.use(express.json());
app.use('/api/users', usersRouter);

describe('User API', () => {
  let testDbConnection;

  beforeAll(async () => {
    testDbConnection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'resqfood_test_users',
    });

    mockDb.query.mockImplementation(async (sql, params) => {
      const [results] = await testDbConnection.query(sql, params);
      return results;
    });

    await testDbConnection.query(`
      CREATE TABLE users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('donor', 'volunteer', 'beneficiary') NOT NULL
      );
    `);
  });

  beforeEach(async () => {
    await testDbConnection.query('TRUNCATE TABLE users');
  });

  afterAll(async () => {
    await testDbConnection.query('DROP TABLE users');
    await testDbConnection.end();
  });

  it('should return an empty array of users initially', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  it('should create a new user', async () => {
    const newUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      role: 'donor'
    };
    const res = await request(app)
      .post('/api/users/register')
      .send(newUser);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully!');
    expect(res.body).toHaveProperty('userId');
  });

  it('should return an array with one user after one is created', async () => {
    const newUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      role: 'donor'
    };
    await request(app).post('/api/users/register').send(newUser);

    const res = await request(app).get('/api/users');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty('username', 'testuser');
  });
});