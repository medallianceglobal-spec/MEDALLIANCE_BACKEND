import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../../config/s3.js";

const MAX_FILES = 10;

export const uploadCompanyImages = multer({
  storage: multerS3({
    s3,
    bucket: "medalliance-user-assets",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const userId = req.user.userId;
      const ext = file.originalname.split(".").pop();

      const fileName = `companies/${userId}/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${ext}`;

      cb(null, fileName);
    },
  }),

  limits: {
    files: MAX_FILES,
    fileSize: 5 * 1024 * 1024, // 5MB per image
  },

  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files allowed"), false);
    }
    cb(null, true);
  },
});
