import bcrypt from "bcrypt";

export const compare = ({ data, hashedData }) => {
  // bcrypt.compare() -> returns promise || bcrypt.compareSync() -> returns boolean
  return bcrypt.compareSync(data, hashedData);
};
