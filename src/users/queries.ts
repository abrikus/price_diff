const getUsers = 'SELECT * FROM users';
const getUserById = 'SELECT * FROM users WHERE id = $1';
const checkEmailExists = 'SELECT s FROM users s WHERE s.email = $1';
const addUser = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)';
const removeUserByEmail = 'DELETE FROM users WHERE email = $1';

// type Queries = {
//   getUsers: string;
//   getUserById: string;
//   checkEmailExists: string;
//   addUser: string;
//   removeUserByEmail: string;
// }

// interface Queries {
//   getUsers: 'SELECT * FROM users';
//   getUserById: 'SELECT * FROM users WHERE id = $1';
//   checkEmailExists: 'SELECT s FROM users s WHERE s.email = $1';
//   addUser: 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)';
//   removeUserByEmail: 'DELETE FROM users WHERE email = $1';
// }

// const queries: Queries = {
//   getUsers: 'SELECT * FROM users',
//   getUserById: 'SELECT * FROM users WHERE id = $1',
//   checkEmailExists: 'SELECT s FROM users s WHERE s.email = $1',
//   addUser: 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
//   removeUserByEmail: 'DELETE FROM users WHERE email = $1',
// }

export default {
  getUsers,
  getUserById,
  checkEmailExists,
  addUser,
  removeUserByEmail,
};
// export default queries;
