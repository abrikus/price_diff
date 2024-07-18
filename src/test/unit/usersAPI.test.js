const request = require('supertest');
const express = require('express');
const userRoutes = require('../../users/routes');
const pool = require('../../db');
// const queries = require('../../users/queries');

// Создаем экземпляр приложения Express
const app = express();
app.use(express.json());
app.use('/users', userRoutes);

// Mock для базы данных
jest.mock('../../db');
jest.mock('../../users/queries', () => ({
  getUsers: 'SELECT * FROM users',
  checkEmailExists: 'SELECT * FROM users WHERE email = $1',
  addUser: 'INSERT INTO users (name, email) VALUES ($1, $2)',
  removeUserByEmail: 'DELETE FROM users WHERE email = $1'
}));
jest.mock('../../utils');

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore(); // Восстановление оригинальной функции
});

describe('GET /users/getUsers', () => {
  beforeEach(() => {
    pool.query.mockReset();
  });

  it('should return users and status 200', async () => {
    const users = [{ id: 1, name: 'John Doe', email: 'john@example.com' }];
    pool.query.mockResolvedValue({ rows: users });

    const response = await request(app).get('/users/getUsers');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(users);
  });

  it('should return 500 if there is a server error', async () => {
    pool.query.mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/users/getUsers');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal Server Error' });
  });
});

describe('POST /users/addUser', () => {
  beforeEach(() => {
    pool.query.mockReset();
  });

  it('should add user and return 201 if data is valid', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] }); // No email conflict
    // pool.query.mockResolvedValueOnce({}); // User added

    const newUser = { name: 'Jane Doe', email: 'jane@example.com' };
    const response = await request(app).post('/users/addUser').send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'User added successfully' });
  });

  it('should return 400 if data is invalid', async () => {
    const invalidUser = { name: '', email: 'not-an-email' };
    const response = await request(app).post('/users/addUser').send(invalidUser);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Invalid name or email' });
  });

  it('should return 409 if email already exists', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ email: 'jane@example.com' }] });

    const newUser = { name: 'Jane Doe', email: 'jane@example.com' };
    const response = await request(app).post('/users/addUser').send(newUser);

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ message: 'Email already exists' });
  });

  it('should return 500 if there is a server error', async () => {
    pool.query.mockRejectedValue(new Error('Database error'));

    const newUser = { name: 'Jane Doe', email: 'jane@example.com' };
    const response = await request(app).post('/users/addUser').send(newUser);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal Server Error' });
  });
});

describe('DELETE /users/:email', () => {
  beforeEach(() => {
    pool.query.mockReset();
  });

  it('should delete user and return 200 if email is valid and user exists', async () => {
    pool.query.mockResolvedValue({ rowCount: 1 });

    const response = await request(app).delete('/users/test@example.com');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'User removed successfully' });
  });

  it('should return 400 if email is invalid', async () => {
    const response = await request(app).delete('/users/invalid-email');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Invalid email' });
  });

  it('should return 404 if user does not exist', async () => {
    pool.query.mockResolvedValue({ rowCount: 0 });

    const response = await request(app).delete('/users/notfound@example.com');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'User not found' });
  });

  it('should return 500 if there is a server error', async () => {
    // pool.query.mockRejectedValue(new Error('Database error'));

    const response = await request(app).delete('/users/error@example.com');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal Server Error' });
  });
});