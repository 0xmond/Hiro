export const notFound = (req, res, next) => {
  return res.status(404).json({ success: false, message: "Page is not found" });
};
