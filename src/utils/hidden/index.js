export const jobPostHiddenData = {
  archived: 0,
  updatedAt: 0,
};

export function hideUserSensitiveData(user) {
  const {
    _id,
    createdAt,
    updatedAt,
    isConfirmed,
    role,
    isEmployed,
    password,
    ...filteredUser
  } = user;
  return filteredUser;
}

export const userHiddenData = {
  _id: 0,
  createdAt: 0,
  updatedAt: 0,
  isConfirmed: 0,
  isEmployed: 0,
  password: 0,
};
