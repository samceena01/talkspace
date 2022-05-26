import bcrypt from "bcryptjs";

export const hashPassword = async (password: string) => {
  // return argon.hash(password);
  try {
    const passwordSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, passwordSalt);
    return hashedPassword;
  } catch (error) {
    console.log(error);
    return password;
  }
};

export const verifyPassword = (hashedPassword: string, password: string) => {
  try {
    const compare = bcrypt.compare(password, hashedPassword);
    return compare;
  } catch (err) {
    console.log(err);
  }
};
