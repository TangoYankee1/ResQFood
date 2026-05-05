const request = require('supertest');
const express = require('express');
const mysql = require('mysql2/promise');

// Mock the db service BEFORE it is imported by the router
const mockDb = {
  query: jest.fn(),
  end: jest.fn(), // Mock the end function as well
};
jest.mock('../services/db', () => mockDb);

const beneficiariesRouter = require('../routes/beneficiaries');

// Set up an express app for testing
const app = express();
app.use(express.json());
app.use('/api/beneficiaries', beneficiariesRouter);

describe('Beneficiary API', () => {
  let testDbConnection;

  beforeAll(async () => {
    // Create a real, separate database connection for our tests
    testDbConnection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'resqfood_test_beneficiaries', // Use the dedicated test DB
    });

    // Redirect the mock's query function to our real test database
    mockDb.query.mockImplementation(async (sql, params) => {
      const [results] = await testDbConnection.query(sql, params);
      return results;
    });

    // Create the table schema for the tests
    await testDbConnection.query(`
      CREATE TABLE beneficiaries (
        beneficiary_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        address VARCHAR(255) NOT NULL,
        contact_person VARCHAR(100),
        contact_phone VARCHAR(20)
      );
    `);
  });

  beforeEach(async () => {
    // Truncate the table before each test to ensure isolation
    await testDbConnection.query('TRUNCATE TABLE beneficiaries');
  });

  afterAll(async () => {
    // Clean up: drop the table and close the connection
    await testDbConnection.query('DROP TABLE beneficiaries');
    await testDbConnection.end();
  });

  it('should return an empty array of beneficiaries initially', async () => {
    const res = await request(app).get('/api/beneficiaries');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  it('should create a new beneficiary', async () => {
    const newBeneficiary = {
      name: 'Test Beneficiary',
      address: '123 Test St',
      contact_person: 'John Doe',
      contact_phone: '123-456-7890'
    };
    const res = await request(app)
      .post('/api/beneficiaries')
      .send(newBeneficiary);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Beneficiary created successfully!');
    expect(res.body).toHaveProperty('beneficiaryId');
  });

  it('should return an array with one beneficiary after one is created', async () => {
    // Arrange: Create a beneficiary
    const newBeneficiary = {
      name: 'Test Beneficiary',
      address: '123 Test St',
      contact_person: 'John Doe',
      contact_phone: '123-456-7890'
    };
    await request(app).post('/api/beneficiaries').send(newBeneficiary);

    // Act: Get all beneficiaries
    const res = await request(app).get('/api/beneficiaries');

    // Assert
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty('name', 'Test Beneficiary');
  });
});