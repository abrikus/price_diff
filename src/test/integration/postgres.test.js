const { app, server } = require('../../index.js');
const { pool } = require('../../users/controller.js');
const request = require('supertest');

let client;
let testUserEmail;

const generateUniqueEmail = () => {
  const timestamp = new Date().getTime();
  const randomNum = Math.floor(Math.random() * 100000);
  return `testuser_${timestamp}_${randomNum}@example.com`;
}

beforeAll(async () => {
  client = await pool.connect();
  await client.query('BEGIN');
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email varchar(255) UNIQUE not null,
      name varchar(30) not null,
      password VARCHAR(255) not null
    );
  `);
  await client.query('COMMIT');
});

afterAll(async () => {
  client.release();
  await pool.end();
  server.close();
});

beforeEach(async () => {
  testUserEmail = generateUniqueEmail();
});

afterEach(async () => {
  await client.query(`DELETE FROM users WHERE email = $1`, [testUserEmail]);
});

describe('User API Integration Tests', () => {
  describe('GET /users/getUsers', () => {
    it('should include the newly added user in the response', async () => {
      await client.query('BEGIN');
      await client.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`, ['Test User', testUserEmail, 'new123456']);
      await client.query('COMMIT');

      const response = await request(app)
        .get('/users/getUsers')
        .expect('Content-Type', /json/)
        .expect(200);

      const testUser = response.body.find(user => user.email === testUserEmail);
      expect(testUser).toBeDefined();
      expect(testUser).toHaveProperty('email', testUserEmail);
      expect(testUser).toHaveProperty('name', 'Test User');

    });

    it('should return an array of users regardless of its content', async () => {
      const response = await request(app)
        .get('/users/getUsers')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /addUsers', () => {
    it('should add a user and return a success message', async () => {
      const newUserName = 'New Test User';
      const newUserPassword = 'new123456'

      const response = await request(app)
        .post('/users/addUser')
        .send({ name: newUserName, email: testUserEmail, password: newUserPassword })
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toEqual({ message: 'User added successfully' });

      const usersResponse = await request(app)
        .get('/users/getUsers')
        .expect('Content-Type', /json/)
        .expect(200);

      const newUser = usersResponse.body.find(user => user.email === testUserEmail);
      expect(newUser).toBeDefined();
      expect(newUser).toHaveProperty('email', testUserEmail);
      expect(newUser).toHaveProperty('name', newUserName);

      // await client.query('DELETE FROM users WHERE email = $1', [newUserEmail]);
    });
  });
})
