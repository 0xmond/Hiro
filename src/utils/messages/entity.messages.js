const getMessages = (entity) => {
  return {
    notFound: `${entity} is not found`,
    alreadyExist: `${entity} is already exist`,
    updatedSuccessfully: `${entity} is updated successfully`,
    deletedSuccessfully: `${entity} is deleted successfully`,
    createdSuccessfully: `${entity} is created successfully`,
    archivedSuccessfully: `${entity} is archived successfully`,
  };
};

export const entityMessages = {
  user: getMessages("User"),
  jobPost: getMessages("Job post"),
  jobApplication: getMessages("Job application"),
};
