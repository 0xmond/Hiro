import multer, { diskStorage } from "multer";

export const fileFormats = {
  imageMimeTypes: ["image/jpeg", "image/png"],

  videoMimeTypes: [
    "video/mp4",
    "video/webm",
    "video/quicktime", // MOV
  ],

  documentMimeTypes: [
    "application/pdf",
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  ],
};

export const uploadFile = (acceptedFormat) => {
  try {
    const storage = diskStorage({}); // stores files in temp folder in operating system

    const fileFilter = (req, file, cb) => {
      if (!acceptedFormat.includes(file.mimetype))
        return cb(new Error("Format not allowed", { cause: 400 }), false);

      return cb(null, true);
    };
    return multer({ storage, fileFilter });
  } catch (error) {
    return next(new Error(error.message, { cause: 500 }));
  }
};
