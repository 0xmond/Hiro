const getMessages = (entity) => {
  return {
    notFound: `${entity} is not found`,
    alreadyExist: `${entity} is already exist`,
    updatedSuccessfully: `${entity} updated successfully`,
    deletedSuccessfully: `${entity} deleted successfully`,
    createdSuccessfully: `${entity} created successfully`,
  };
};

export const entityMessages = {
  user: getMessages("User"),
  jobPost: getMessages("Job post"),
};
