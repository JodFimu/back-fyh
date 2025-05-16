import { body, param } from 'express-validator';
import { validateField } from './validate-fields.js';
import { handleErrors } from './handle-errors.js';
import { validateJWT } from './validate-jwt.js';
import { hasRoles } from './validate-roles.js';
import { reservationExists } from '../helpers/db-validator.js';

export const reserveRoomValidator = [
    validateJWT,
    hasRoles('CLIENT_ROLE'),
    //body('').notEmpty().withMessage('Hotel ID es requerido').isMongoId(), Hotel Validacion
    //body('').notEmpty().withMessage('Room ID es requerido').isMongoId(), Habitacion Validacion
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
    hasRoles('CLIENT_ROLE'),
    param('id').notEmpty().withMessage('Reservation ID es requerido').isMongoId(),
    param('id').custom(reservationExists),
    validateField,
    handleErrors,
];

export const updateReservationValidator = [
    validateJWT,
    hasRoles('CLIENT_ROLE'),
    param('id').notEmpty().withMessage('Reservation ID es requerido').isMongoId(),
    param('id').custom(reservationExists),
    body('startDate').optional().isISO8601().withMessage('Start date debe ser una fecha válida'),
    body('exitDate').optional().isISO8601().withMessage('End date debe ser una fecha válida'),
    validateField,
    handleErrors,
];