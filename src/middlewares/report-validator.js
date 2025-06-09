import {param} from 'express-validator';
import { validateJWT } from './validate-jwt.js';
import { validateField } from './validate-fields.js';
import { hasRoles } from './validate-roles.js';
import { handleErrors } from './handle-errors.js';

export const listHotelReservationsValidator = [
    validateJWT,
    hasRoles('ADMIN_ROLE', 'HOST_ROLE'),
    param('hid').exists().withMessage('Hotel ID is required').isMongoId().withMessage('Invalid Hotel ID format'),
    validateField,
    handleErrors
];