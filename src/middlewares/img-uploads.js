import fs from "fs";
import { uploadImage } from "../helpers/coudinary-uploads.js";

export const cloudinaryUploadMiddleware = (folder = "default") => {
    return async (req, res, next) => {
        try {
            if (!req.file || !req.file.path) {
                return res.status(400).json({ error: "No se recibió ninguna imagen" });
            }

            const { secure_url } = await uploadImage(req.file, folder);

            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Error al eliminar archivo local:", err);
            });

            req.img = secure_url;
            next();
        } catch (error) {
        
            return next(error);
        }
    };
};

export const cloudinaryUploadMultiple = (folder = "default") => {
    return async (req, res, next) => {
      try {
        if (!req.files || req.files.length === 0) {
          return res.status(400).json({ error: "No se recibieron imágenes" });
        }
  
        const urls = [];
  
        for (const file of req.files) {
          const { secure_url } = await uploadImage(file, folder);
          urls.push(secure_url);
  
          fs.unlink(file.path, (err) => {
            if (err) console.error("Error al eliminar archivo local:", err);
          });
        }
  
        req.imgs = urls;
        next();
      } catch (error) {
        next(error);
      }
    };
  };