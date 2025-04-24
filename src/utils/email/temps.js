export const acceptanceMail = (email) => {
  return {
    to: email,
    html: `We are pleased to inform you that your application has been approved! 🎉`,
    subject: "Congratulations! Your Application Has Been Approved",
  };
};

export const rejectionMail = (email) => {
  return {
    to: email,
    html: `Thank you for your application to our job post. After careful review, we regret to inform you that we won’t be moving forward at this time.`,
    subject: "Update on Your Application",
  };
};
