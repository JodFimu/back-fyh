import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

export const cloudinaryUploadMiddleware = (folder = "default") => {
    return async (req, res, next) => {
        try {
            if (!req.file && !req.body.img) {
                req.img = "https://res.cloudinary.com/dibe6yrzf/image/upload/v1747668225/perfil-de-usuario_cxmmxq.png";
                return next();
            }

            const uploadStream = cloudinary.uploader.upload_stream(
                { folder },
                (error, result) => {
                    if (error) {
                        return next(error);
                    }
                    req.img = result.secure_url;
                    next();
                }
            );

            if (req.file) {
                streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
            } else if (req.body.img) {
                streamifier.createReadStream(Buffer.from(req.body.img, "base64")).pipe(uploadStream);
            }
        } catch (error) {
            return next(error);
        }
    };
};

export const cloudinaryUploadMultiple = (folder = "default") => {
    return async (req, res, next) => {
        try {
            if (!req.files || req.files.length === 0) {
                req.imgs = [];
                return next();
            }

            const uploadPromises = req.files.map((file) => {
                return new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { folder },
                        (error, result) => {
                            if (error) {
                                return reject(error);
                            }
                            resolve(result.secure_url);
                        }
                    );
                    streamifier.createReadStream(file.buffer).pipe(uploadStream);
                });
            });

            req.imgs = await Promise.all(uploadPromises);
            next();
        } catch (error) {
            return next(error);
        }
    };
};