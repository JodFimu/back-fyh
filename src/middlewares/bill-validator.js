import { body, param } from "express-validator";
import { validateField } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";

export const generateBillValidator = [
    validateJWT,
    param("rid")
        .notEmpty().withMessage("rid is required")
        .isMongoId().withMessage("rid must be a valid Mongo ID"),
    validateField,
    handleErrors
];

export const generateEventBillValidator = [
    validateJWT,
    param("eid")
        .notEmpty().withMessage("rid is required")
        .isMongoId().withMessage("rid must be a valid Mongo ID"),
    validateField,
    handleErrors
];