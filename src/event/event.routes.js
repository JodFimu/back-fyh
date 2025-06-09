import { Router } from "express";
import {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    updateEventPictures,
    deleteEvent,
    getEventsByHost
} from "./event.controller.js";

import {
    createEventValidator, deleteEventValidator, updateEventValidator, validateSearchEventByHost
} from "../middlewares/event-validator.js";
import { cloudinaryUploadMultiple } from "../middlewares/img-uploads.js";

import { uploadEventImage } from "../middlewares/multer-uploads.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Event
 *   description: API for managing events
 */

/**
 * @swagger
 * /FindYourHotel/v1/event:
 *   get:
 *     summary: Obtener todos los eventos
 *     tags: [Event]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de eventos obtenida correctamente
 */
router.get("/", getEvents);

/**
 * @swagger
 * /FindYourHotel/v1/event/{eid}:
 *   get:
 *     summary: Obtener un evento por ID
 *     tags: [Event]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: eid
 *         in: path
 *         description: ID del evento
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evento encontrado
 *       404:
 *         description: Evento no encontrado
 */
router.get("/:eid", createEventValidator, getEventById);

/**
 * @swagger
 * /FindYourHotel/v1/event:
 *   post:
 *     summary: Crear un nuevo evento
 *     tags: [Event]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - date
 *               - hotel
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               hotel:
 *                 type: string
 *     responses:
 *       201:
 *         description: Evento creado exitosamente
 *       400:
 *         description: Error de validación
 */

router.post("/createEvent",  uploadEventImage.array("pictures", 5),cloudinaryUploadMultiple("events-img"),  createEventValidator, createEvent);

/**
 * @swagger
 * /FindYourHotel/v1/event/{eid}:
 *   put:
 *     summary: Actualizar un evento existente
 *     tags: [Event]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: eid
 *         in: path
 *         description: ID del evento a actualizar
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Evento actualizado correctamente
 *       404:
 *         description: Evento no encontrado
 */
router.put("/editEvent/:eid", updateEventValidator, updateEvent);

router.patch("/updatePictures/:hid", uploadEventImage.array("pictures", 5), cloudinaryUploadMultiple("events-img"), createEventValidator, updateEventPictures);


/**
 * @swagger
 * /FindYourHotel/v1/event/{eid}:
 *   delete:
 *     summary: Eliminar un evento por ID
 *     tags: [Event]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: eid
 *         in: path
 *         description: ID del evento a eliminar
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evento eliminado
 *       404:
 *         description: Evento no encontrado
 */
router.delete("/deleteEvent/:eid", deleteEventValidator, deleteEvent);

/**
 * @swagger
 * /FindYourHotel/v1/event/host/{eid}:
 *   get:
 *     summary: Obtener eventos por ID del hotel anfitrión
 *     tags: [Event]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: eid
 *         in: path
 *         description: ID del hotel
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de eventos del hotel
 *       404:
 *         description: Hotel no encontrado o sin eventos
 */
router.get("/searchByHost/:eid", validateSearchEventByHost, getEventsByHost);

export default router;
