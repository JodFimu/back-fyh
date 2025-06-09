import { Router } from "express";
import { createRoom, getRooms, getRoomById, updateRoom, updateRoomImages, filterRooms} from "./room.controller.js";
import { validateCrateRoom, validateGetRoomById, validateUpdateRoom, filterRoomsValidator} from "../middlewares/room-validator.js";
import { uploadRoomImage } from "../middlewares/multer-uploads.js";
import {  cloudinaryUploadMultiple } from "../middlewares/img-uploads.js";

const router = Router();
/**
 * @swagger
 * tags:
 *   - name: Rooms
 *     description: API for managing rooms
 */

/**
 * @swagger
 * /createRoom:
 *   post:
 *     summary: Crear una nueva habitación
 *     tags:
 *       - Rooms
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Habitación Deluxe
 *               description:
 *                 type: string
 *                 example: Vista al mar
 *               capacity:
 *                 type: integer
 *                 example: 2
 *               pricePerDay:
 *                 type: number
 *                 example: 120
 *               type:
 *                 type: string
 *                 enum: [SINGLE, DOUBLE, SUITE, DELUXE]
 *                 example: DELUXE
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Habitación creada
 *       400:
 *         description: Validación fallida
 */
router.post(
  "/createRoom",
  uploadRoomImage.array("images", 5),
  cloudinaryUploadMultiple("rooms-img"),
  validateCrateRoom,
  createRoom
);

/**
 * @swagger
 * /getRooms:
 *   get:
 *     summary: Obtener todas las habitaciones
 *     tags:
 *       - Rooms
 *     responses:
 *       200:
 *         description: Lista de habitaciones
 */
router.get("/getRooms", getRooms);

/**
 * @swagger
 * /getRoomById/{rid}:
 *   get:
 *     summary: Obtener habitación por ID
 *     tags:
 *       - Rooms
 *     parameters:
 *       - in: path
 *         name: rid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la habitación
 *     responses:
 *       200:
 *         description: Habitación encontrada
 *       404:
 *         description: No encontrada
 */
router.get("/getRoomById/:rid", validateGetRoomById, getRoomById);

/**
 * @swagger
 * /updateRoom/{rid}:
 *   put:
 *     summary: Actualizar datos de una habitación
 *     tags:
 *       - Rooms
 *     parameters:
 *       - in: path
 *         name: rid
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
 *               capacity:
 *                 type: integer
 *               pricePerDay:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [SINGLE, DOUBLE, SUITE, DELUXE]
 *     responses:
 *       200:
 *         description: Actualizada
 *       400:
 *         description: Validación fallida
 */
router.put("/updateRoom/:rid", validateUpdateRoom, updateRoom);

/**
 * @swagger
 * /updateImages/{rid}:
 *   patch:
 *     summary: Actualizar imágenes de una habitación
 *     tags:
 *       - Rooms
 *     parameters:
 *       - in: path
 *         name: rid
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Imágenes actualizadas
 *       400:
 *         description: Validación fallida
 */
router.patch(
  "/updateImages/:rid",
  uploadRoomImage.array("images", 5),
  cloudinaryUploadMultiple("rooms-img"),
  validateUpdateRoom,
  updateRoomImages
);

/**
 * @swagger
 * /filterRooms:
 *   get:
 *     summary: Filtrar habitaciones por parámetros y disponibilidad de fechas
 *     tags:
 *       - Rooms
 *     parameters:
 *       - in: query
 *         name: capacity
 *         schema:
 *           type: string
 *         description: Capacidad de la habitación
 *       - in: query
 *         name: pricePerDay
 *         schema:
 *           type: number
 *         description: Precio máximo por día
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [SINGLE, DOUBLE, SUITE, DELUXE]
 *         description: Tipo de habitación
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de entrada (YYYY-MM-DD)
 *       - in: query
 *         name: extiDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de salida (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de habitaciones filtradas y disponibles
 *       400:
 *         description: Parámetros inválidos
 */
router.get("/filterRooms", filterRoomsValidator, filterRooms);

export default router;