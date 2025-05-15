import { body, param } from "express-validator";
import { emailExists } from "../helpers/db-validator.js";
import { validateField } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";
import { userExists, isClient } from "../helpers/db-validator.js";
import {deleteFileOnError} from "./delete-file-on-error.js";


export const validatorRegister = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").notEmpty().withMessage("Email is required"),
    body("email").isEmail().withMessage("It is not a valid email"),
    body("email").custom(emailExists),
    body("password").notEmpty().withMessage("The password is required"),
    body("password").isStrongPassword({
        minLength: 8,
        minLowerCase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }).withMessage("The password must contain at least 8 characters"),
    validateField,
    deleteFileOnError,
    handleErrors
]

export const validatorLogin = [
    body("email").notEmpty().withMessage("Email is mandatory"),
    body("password").notEmpty().withMessage("The password is required"),
    body("password").isStrongPassword({
        minLength: 8,
        minLowerCase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }).withMessage("The password must contain at least 8 characters"),
    validateField,
    handleErrors
]

export const validateUpdateRole = [
    param("id").isMongoId().withMessage("The id is not valid"),
    body("role").notEmpty().withMessage("The role is required"),
    body("role").isIn(["ADMIN_ROLE", "CLIENT_ROLE", "HOST_ROLE"]).withMessage("The role is not valid"),
    validateField,
    handleErrors    
]


export const getUserValidation = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    validateField,
    handleErrors
]

export const getUserByIdValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("uid").isMongoId().withMessage("The id is not valid"),
    param("uid").custom(userExists),
    validateField,
    handleErrors
];

export const deleteUserValidatorAdmin = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("uid").isMongoId().withMessage("The id is not valid"),
    param("uid").custom(isClient),
    param("uid").custom(userExists),
    validateField,
    handleErrors
];

export const deleteUserValidatorClient = [
    validateJWT,
    hasRoles("CLIENT_ROLE", "HOST_ROLE"),
    validateField,
    handleErrors
]

export const updatePasswordValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "CLIENT_ROLE", "HOST_ROLE"),
    body("newPassword").isLength({ min: 8 }).withMessage("El password debe contener al menos 8 caracteres"),
    validateField,
    handleErrors
];

export const updateUserValidatorAdmin = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("uid").isMongoId().withMessage("The id is not valid"),
    param("uid").custom(isClient),
    param("uid").custom(userExists),
    validateField,
    handleErrors
];

export const updateUserValidatorClient = [
    validateJWT,
    hasRoles("CLIENT_ROLE"),
    validateField,
    handleErrors
];

export const createUserValidation = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    body("name").notEmpty().withMessage("El nombre es requerido"),
    body("email").notEmpty().withMessage("El email es requerido"),
    body("email").isEmail().withMessage("No es un email válido"),
    body("email").custom(emailExists),
    body("password").isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }),
    validateField,
    deleteFileOnError,
    handleErrors
]

export const updateRoleValidator =[
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("uid", "The id is not valid").isMongoId(),
    param("uid").custom(isClient),
    param("uid").custom(userExists),
    validateField,
    handleErrors
]

export const updateProfilePictureValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "CLIENT_ROLE"),
    validateField,
    handleErrors
]
