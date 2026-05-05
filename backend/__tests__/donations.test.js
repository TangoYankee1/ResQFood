const request = require('supertest');
const express = require('express');
const mysql = require('mysql2/promise');

// Mock the db service
const mockDb = {
  query: jest.fn(),
  end: jest.fn(),
};
jest.mock('../services/db', () => mockDb);

const donationsRouter = require('../routes/donations');

// Set up an express app for testing
const app = express();
app.use(express.json());
app.use('/api/donations', donationsRouter);

describe('Donation API', () => {
  let testDbConnection;

  beforeAll(async () => {
    testDbConnection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'resqfood_test_donations',
    });

    mockDb.query.mockImplementation(async (sql, params) => {
      const [results] = await testDbConnection.query(sql, params);
      return results;
    });

    await testDbConnection.query(`
      CREATE TABLE donations (
        donation_id INT AUTO_INCREMENT PRIMARY KEY,
        donor_id INT NOT NULL,
        food_type VARCHAR(100) NOT NULL,
        quantity VARCHAR(50) NOT NULL,
        pickup_address VARCHAR(255) NOT NULL,
        pickup_time_start DATETIME NOT NULL,
        pickup_time_end DATETIME NOT NULL,
        status ENUM('pending', 'accepted', 'completed', 'cancelled') NOT NULL DEFAULT 'pending'
      );
    `);
  });

  beforeEach(async () => {
    await testDbConnection.query('TRUNCATE TABLE donations');
  });

  afterAll(async () => {
    await testDbConnection.query('DROP TABLE donations');
    await testDbConnection.end();
  });

  it('should return an empty array of donations initially', async () => {
    const res = await request(app).get('/api/donations');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  it('should create a new donation', async () => {
    const newDonation = {
      donor_id: 1,
      food_type: 'Canned Goods',
      quantity: '10 cans',
      pickup_address: '123 Test St',
      pickup_time_start: '2026-05-06 10:00:00',
      pickup_time_end: '2026-05-06 12:00:00',
      status: 'pending'
    };
    const res = await request(app)
      .post('/api/donations')
      .send(newDonation);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Donation created successfully!');
    expect(res.body).toHaveProperty('donationId');
  });

  it('should return an array with one donation after one is created', async () => {
    const newDonation = {
      donor_id: 1,
      food_type: 'Canned Goods',
      quantity: '10 cans',
      pickup_address: '123 Test St',
      pickup_time_start: '2026-05-06 10:00:00',
      pickup_time_end: '2026-05-06 12:00:00',
      status: 'pending'
    };
    await request(app).post('/api/donations').send(newDonation);

    const res = await request(app).get('/api/donations');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty('food_type', 'Canned Goods');
  });
});