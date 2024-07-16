const bcrypt = require('bcrypt');

const genPassword = async (pass) => {
  const hashPass = await bcrypt.hash(pass, 10);
  return hashPass;
}

const checkPassword = async (pass, hashPass) => {
  const isMatch = await bcrypt.compare(pass, hashPass);
  return isMatch;
}

module.exports = {
  genPassword,
  checkPassword,
};
