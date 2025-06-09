import { Router } from "express";
import {
    createReservation,
    getReservationById,
    deleteReservation,
    getReservationsByRoom,
    getReservationsByHost
} from "./reservation.controller.js";
import {
  createEventReservation,
  deleteEventReservation,
  getUserReservedEvents,
  getEventReservationById,
  updateEventReservation
} from "./eventReservation.controller.js";
import { 
    reserveRoomValidator,
    cancelReservationValidator,
    createEventReservationValidator,
    deleteEventReservationValidator,
    getUserReservedEventsValidator,
    getEventReservationByIdValidator,
  updateEventReservationValidator,
  getReservationByHostValidator
 } from "../middlewares/reservation-validator.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: API for managing reservations
 */

/**
 * @swagger
 * /createReser:
 *   post:
 *     summary: Crea una nueva reservación
 *     tags: [Reservations]
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
router.post("/createReser/:rid",reserveRoomValidator, createReservation);

/**
 * @swagger
 * /listReser/{rid}:
 *   get:
 *     summary: Obtiene una reservación por ID
 *     tags: [Reservations]
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
router.get("/listReser/:rid", getReservationById);


/**
 * @swagger
 * /deleteReser/{rid}:
 *   delete:
 *     summary: Elimina (soft delete) una reservación por ID
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: rid
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
router.delete("/deleteReser/:rid",cancelReservationValidator, deleteReservation);

/**
 * @swagger
 * /listReserByRoom/{rid}:
 *   get:
 *     summary: Obtiene todas las reservaciones de una habitación por ID
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: rid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la habitación
 *     responses:
 *       200:
 *         description: Reservaciones encontradas
 *       404:
 *         description: Reservaciones no encontradas
 */
router.get("/listReserByRoom/:rid", getReservationsByRoom);

/**
 * @swagger
 * /eventReservation/create/{eid}:
 *   post:
 *     summary: Crear una reservación para un evento
 *     tags: [EventReservation]
 *     parameters:
 *       - in: path
 *         name: eid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del evento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reservationDate
 *               - time
 *               - attendees
 *             properties:
 *               reservationDate:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *               attendees:
 *                 type: integer
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reservación creada exitosamente
 */
router.post("/createEventReservation/:eid", createEventReservationValidator, createEventReservation);

/**
 * @swagger
 * /eventReservation/delete/{rid}:
 *   delete:
 *     summary: Eliminar una reservación de evento por ID
 *     tags: [EventReservation]
 *     parameters:
 *       - in: path
 *         name: rid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reservación
 *     responses:
 *       200:
 *         description: Reservación eliminada correctamente
 *       404:
 *         description: Reservación no encontrada
 */
router.delete( "/deleteEventReservation/:rid", deleteEventReservationValidator, deleteEventReservation);

/**
 * @swagger
 * /eventReservation/user:
 *   get:
 *     summary: Obtener todas las reservaciones de eventos del usuario autenticado
 *     tags: [EventReservation]
 *     responses:
 *       200:
 *         description: Lista de reservaciones de eventos
 */
router.get(
  "/eventsReservationByUser",getUserReservedEventsValidator, getUserReservedEvents);

  /**
 * @swagger
 * /eventReservation/{rid}:
 *   get:
 *     summary: Obtener una reservación de evento por ID
 *     tags: [EventReservation]
 *     parameters:
 *       - in: path
 *         name: rid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reservación
 *     responses:
 *       200:
 *         description: Reservación encontrada
 *       404:
 *         description: Reservación no encontrada
 */
router.get("/getEventReservationById/:rid", getEventReservationByIdValidator, getEventReservationById);

/**
 * @swagger
 * /eventReservation/update/{rid}:
 *   put:
 *     summary: Actualizar una reservación de evento
 *     tags: [EventReservation]
 *     parameters:
 *       - in: path
 *         name: rid
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
 *             properties:
 *               reservationDate:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *               attendees:
 *                 type: integer
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reservación actualizada
 *       404:
 *         description: Reservación no encontrada
 */
router.put(
  "/updateEventReservation/:rid",
  updateEventReservationValidator,
  updateEventReservation
);

/**
 * @swagger
 * /reservations/host:
 *   get:
 *     summary: Obtener todas las reservaciones del host autenticado
 *     tags: [Reservations]
 *     responses:
 *       200:
 *         description: Lista de reservaciones del host
 */
router.get(
  "/reservationsByHost",
  getReservationByHostValidator,
  getReservationsByHost
);
export default router;