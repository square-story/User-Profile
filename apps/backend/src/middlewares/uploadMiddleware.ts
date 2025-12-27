import multer from "multer";
import { AppError } from "../utils/errorUtils";
import { StatusCode } from "../types";

const storage = multer.memoryStorage();

export const uploadMiddleware = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new AppError("Only images are allowed", StatusCode.BadRequest, false));
        }
    },
});
