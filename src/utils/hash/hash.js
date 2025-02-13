import bcrypt from "bcrypt";

export const hash = ({ data, saltRound = 10 }) => {
  return bcrypt.hashSync(data, saltRound);
};
