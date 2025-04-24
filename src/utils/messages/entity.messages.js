const getMessages = (entity) => {
  return {
    notFound: `${entity} is not found`,
    alreadyExist: `${entity} is already exist`,
    updatedSuccessfully: `${entity} is updated successfully`,
    archivedSuccessfully: `${entity} is archived successfully`,
    deletedSuccessfully: `${entity} is deleted successfully`,
    removedSuccessfully: `${entity} is removed successfully`,
    createdSuccessfully: `${entity} is created successfully`,
    archivedSuccessfully: `${entity} is archived successfully`,
  };
};

export const entityMessages = {
  user: getMessages("User"),
  jobPost: getMessages("Job post"),
  jobApplication: getMessages("Job application"),
  friend: getMessages("Friend"),
  follower: getMessages("Follower"),
  comment: getMessages("Comment"),
  post: getMessages("Post"),
  friendRequest: {
    ...getMessages("Friend request"),
    approvedSuccessfully: "Friend request approved successfully",
  },
  follow: {
    removedSuccessfully: "Follow is removed successfully",
    createdSuccessfully: "You are now following this user",
  },
};
