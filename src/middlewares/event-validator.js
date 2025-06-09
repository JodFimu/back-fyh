import { body, param } from "express-validator";
import { validateField } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";
import { deleteFileOnError } from "./delete-file-on-error.js";
const validCategories = ["weding", "party", "business", "other"];

export const createEventValidator = [
    validateJWT,
    hasRoles("HOST_ROLE", "ADMIN_ROLE", "CLIENT_ROLE"),

    body("name")
        .notEmpty().withMessage("Name is required")
        .isLength({ max: 50 }).withMessage("Name cannot exceed 50 characters"),

    body("description")
        .notEmpty().withMessage("Description is required")
        .isLength({ max: 200 }).withMessage("Description cannot exceed 200 characters"),

    body("date")
        .notEmpty().withMessage("Date is required")
        .isISO8601().withMessage("Invalid date format"),

    body("time")
        .notEmpty().withMessage("Time is required"),

    body("location")
        .notEmpty().withMessage("Location is required")
        .isLength({ max: 100 }).withMessage("Location cannot exceed 100 characters"),

    body("category")
        .notEmpty()
        .isIn(validCategories).withMessage(`Category must be one of: ${validCategories.join(", ")}`),

    body("cost")
        .notEmpty()
        .isNumeric().withMessage("Cost must be a number"),

    /*body("hotel")
        .notEmpty()
        .isMongoId().withMessage("Hotel must be a valid Mongo ID"),*/

    validateField,
    deleteFileOnError,
    handleErrors
];


export const updateEventValidator = [
    validateJWT,
    hasRoles("HOST_ROLE", "ADMIN_ROLE", "CLIENT_ROLE"),
    param("eid").isMongoId().withMessage("Invalid event ID"),
    body("name").optional().isLength({ max: 50 }).withMessage("Name cannot exceed 50 characters"),
    body("description").optional().isLength({ max: 200 }).withMessage("Description cannot exceed 200 characters"),
    body("date").optional().isISO8601().withMessage("Invalid date format"),
    body("time").optional(),
    body("location").optional().isLength({ max: 100 }).withMessage("Location cannot exceed 100 characters"),
    body("category").optional().isIn(validCategories).withMessage(`Category must be one of: ${validCategories.join(", ")}`),
    body("cost").optional().isNumeric().withMessage("Cost must be a number"),
    /*body("hotel").optional().isMongoId().withMessage("Hotel must be a valid Mongo ID"),*/
    validateField,
    handleErrors
];


export const deleteEventValidator = [
    validateJWT,
    hasRoles("HOST_ROLE", "ADMIN_ROLE", "CLIENT_ROLE"),
    param("eid").isMongoId().withMessage("Invalid event ID"),
    validateField,
    handleErrors
];


export const getEventByIdValidator = [
    validateJWT,
    param("eid").isMongoId().withMessage("Invalid event ID"),
    validateField,
    handleErrors
];


export const validateSearchEventByHost = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "HOST_ROLE", "USER_ROLE"),
    param("eid").isMongoId().withMessage("Invalid event ID"),
    validateField,
    handleErrors
];