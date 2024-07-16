const pool = require('../db');
const queries = require('./queries');
const utils = require('../utils');

const getUsers = async (req, res) => {
  try {
    const result = await pool.query(queries.getUsers);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error executing query', error.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const addUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (
      !name ||
      typeof name !== 'string' ||
      name.length > 30 ||
      !email ||
      !/\S+@\S+\.\S+/.test(email) ||
      email.length > 255
    ) {
      return res.status(400).json({ message: 'Invalid name or email' });
    }

    const emailResult = await pool.query(queries.checkEmailExists, [email]);
    if (emailResult.rows.length) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const hashPass = await utils.genPassword(password);

    await pool.query(queries.addUser, [name, email, hashPass]);
    res.status(201).send({ message: 'User added successfully' })
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const removeUser = async (req, res) => {
  const { email } = req.params;
  
  if (!email || !/\S+@\S+\.\S+/.test(email) || email.length > 255) {
    return res.status(400).json({ message: 'Invalid email' });
  }
  
  try {
    const result = await pool.query(queries.removeUserByEmail, [email]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User removed successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  getUsers,
  addUser,
  removeUser,
  pool,
};