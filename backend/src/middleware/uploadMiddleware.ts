import multer from "multer";

const storage = multer.memoryStorage();

export const productImageUpload = multer({
  storage,
  limits: { files: 5 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    cb(null, allowed.includes(file.mimetype));
  },
});
