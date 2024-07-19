import bcrypt from 'bcrypt';

const genPassword = async (pass: string): Promise<string> => {
  const hashPass = await bcrypt.hash(pass, 10);
  return hashPass;
}

const checkPassword = async (pass: string, hashPass: string): Promise<boolean> => {
  const isMatch = await bcrypt.compare(pass, hashPass);
  return isMatch;
}

export default {
  genPassword,
  checkPassword,
};
