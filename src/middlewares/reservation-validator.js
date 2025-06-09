import { body, param } from 'express-validator';
import { validateField } from './validate-fields.js';
import { handleErrors } from './handle-errors.js';
import { validateJWT } from './validate-jwt.js';
import { hasRoles } from './validate-roles.js';
import { reservationExists } from '../helpers/db-validator.js';

export const reserveRoomValidator = [
    validateJWT,
    hasRoles('CLIENT_ROLE'),
    param('rid').notEmpty().withMessage('Room ID es requerido').isMongoId(),
    body('startDate').notEmpty().withMessage('Start date es requerido').isISO8601(),
    body('exitDate').notEmpty().withMessage('End date es requerido').isISO8601(),
    validateField,
    handleErrors,
];

export const getUserReservationsValidator = [
    validateJWT,
    validateField,
    handleErrors,
];

export const cancelReservationValidator = [
    validateJWT,
    //hasRoles('CLIENT_ROLE'),
    param('rid').notEmpty().withMessage('Reservation ID es requerido').isMongoId(),
    param('rid').custom(reservationExists),
    validateField,
    handleErrors,
];

export const createEventReservationValidator = [
    validateJWT,
    hasRoles('CLIENT_ROLE'),
    param("eid").notEmpty().withMessage("Event ID es requerido").isMongoId(),
    body("reservationDate")
        .notEmpty().withMessage("Reservation date es requerido")
        .isISO8601().withMessage("Reservation date debe ser una fecha válida"),
    body("time").
        notEmpty().withMessage("Time es requerido")
        .isLength({ max: 5 }).withMessage("Time no puede exceder los 5 caracteres"),
    body("attendees")
        .notEmpty().withMessage("Attendees es requerido")
        .isInt({ min: 1, max: 100 }).withMessage("Attendees debe ser un número entre 1 y 1000"), 
    body("description")
        .optional()
        .isLength({ max: 500 }).withMessage("Description no puede exceder los 500 caracteres"),
    validateField,
    handleErrors,
];

export const getUserReservedEventsValidator = [
  validateJWT,
  validateField,
  handleErrors,
];

export const getEventReservationByIdValidator = [
  validateJWT,
  param("rid").notEmpty().withMessage("Reservation ID es requerido").isMongoId(),
  validateField,
  handleErrors,
];

export const updateEventReservationValidator = [
  validateJWT,
  param("rid").notEmpty().withMessage("Reservation ID es requerido").isMongoId(),
  body("reservationDate")
    .optional()
    .isISO8601().withMessage("Reservation date debe ser una fecha válida"),
  body("time")
    .optional()
    .isLength({ max: 5 }).withMessage("Time no puede exceder los 5 caracteres"),
  body("attendees")
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage("Attendees debe ser un número entre 1 y 100"),
  body("description")
    .optional()
    .isLength({ max: 500 }).withMessage("Description no puede exceder los 500 caracteres"),
  validateField,
  handleErrors,
];

export const deleteEventReservationValidator = [
  validateJWT,
  param("rid").notEmpty().withMessage("Reservation ID es requerido").isMongoId(),
  validateField,
  handleErrors,
];

export const getReservationByHostValidator =[
    validateJWT,
    hasRoles("HOST_ROLE"),
    validateField,
    handleErrors
]