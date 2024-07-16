const getUsers = 'SELECT * FROM users';
const getUserById = 'SELECT * FROM users WHERE id = $1';
const checkEmailExists = 'SELECT s FROM users s WHERE s.email = $1';
const addUser = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)';
const removeUserByEmail = 'DELETE FROM users WHERE email = $1';

module.exports = {
  getUsers,
  getUserById,
  checkEmailExists,
  addUser,
  removeUserByEmail,
};
