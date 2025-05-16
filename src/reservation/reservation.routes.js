import { Router } from "express";
import {
    createReservation,
    getReservations,
    getReservationById,
    updateReservation,
    deleteReservation,
    getUserReservations
} from "./reservation.controller.js";
import { 
    getUserReservationsValidator,
    reserveRoomValidator,
    cancelReservationValidator,
    updateReservationValidator
 } from "../middlewares/reservation-validator.js";

const router = Router();

/**
 * @swagger
 * /createReser:
 *   post:
 *     summary: Crea una nueva reservación
 *     tags: [Reservaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Reservación creada exitosamente
 *       500:
 *         description: Error al crear la reservación
 */
router.post("/createReser",reserveRoomValidator, createReservation);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Lista todas las reservaciones activas
 *     tags: [Reservaciones]
 *     responses:
 *       200:
 *         description: Lista de reservaciones
 *       500:
 *         description: Error al obtener las reservaciones
 */
router.get("/", getReservations);

/**
 * @swagger
 * /listReser/{id}:
 *   get:
 *     summary: Obtiene una reservación por ID
 *     tags: [Reservaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reservación
 *     responses:
 *       200:
 *         description: Reservación encontrada
 *       404:
 *         description: Reservación no encontrada
 *       500:
 *         description: Error al obtener la reservación
 */
router.get("/listReser/:id", getReservationById);

/**
 * @swagger
 * /updateReser/:{id}:
 *   put:
 *     summary: Edita una reservación por ID
 *     tags: [Reservaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reservación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Reservación actualizada
 *       404:
 *         description: Reservación no encontrada
 *       500:
 *         description: Error al actualizar la reservación
 */
router.put("/updateReser/:id",updateReservationValidator, updateReservation);

/**
 * @swagger
 * /deleteReser/:{id}:
 *   delete:
 *     summary: Elimina (soft delete) una reservación por ID
 *     tags: [Reservaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reservación
 *     responses:
 *       200:
 *         description: Reservación eliminada
 *       404:
 *         description: Reservación no encontrada
 *       500:
 *         description: Error al eliminar la reservación
 */
router.delete("/deleteReser/:id",cancelReservationValidator, deleteReservation);

/**
 * @swagger
 * /userReservations:
 *   get:
 *     summary: Obtiene el historial de reservaciones de un usuario
 *     tags: [Reservaciones]
 *     responses:
 *       200:
 *         description: Historial de reservaciones obtenido exitosamente
 *       500:
 *         description: Error al obtener el historial de reservaciones
 */
router.get("/userReser", getUserReservationsValidator, getUserReservations);

export default router;