import { Router } from "express";
import { createRoom, getRooms, getRoomById, updateRoom, updateRoomImages} from "./room.controller.js";
import { validateCrateRoom, validateGetRoomById, validateUpdateRoom} from "../middlewares/room-validator.js";
import { uploadRoomImage } from "../middlewares/multer-uploads.js";
import {  cloudinaryUploadMultiple } from "../middlewares/img-uploads.js";

const router = Router();

/**
 * @swagger
 * /room/createRoom:
 *   post:
 *     summary: Crear una nueva habitación
 *     tags:
 *       - Room
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
 *                 example: Habitación con vista al mar
 *               capacity:
 *                 type: string
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
 *         description: Habitación creada exitosamente
 *       400:
 *         description: Error de validación
 */

/**
 * @swagger
 * /room/getRooms:
 *   get:
 *     summary: Obtener todas las habitaciones
 *     tags:
 *       - Room
 *     responses:
 *       200:
 *         description: Lista de habitaciones
 */

/**
 * @swagger
 * /room/getRoomById/{rid}:
 *   get:
 *     summary: Obtener una habitación por ID
 *     tags:
 *       - Room
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
 *         description: Habitación no encontrada
 */

/**
 * @swagger
 * /room/updateRoom/{rid}:
 *   put:
 *     summary: Actualizar datos de una habitación
 *     tags:
 *       - Room
 *     parameters:
 *       - in: path
 *         name: rid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la habitación
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
 *                 type: string
 *               pricePerDay:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [SINGLE, DOUBLE, SUITE, DELUXE]
 *     responses:
 *       200:
 *         description: Habitación actualizada
 *       400:
 *         description: Error de validación
 */

/**
 * @swagger
 * /room/updateImages/{rid}:
 *   patch:
 *     summary: Actualizar imágenes de una habitación
 *     tags:
 *       - Room
 *     parameters:
 *       - in: path
 *         name: rid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la habitación
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
 *         description: Error de validación
 */

router.post("/createRoom", uploadRoomImage.array("images", 5), cloudinaryUploadMultiple("rooms-img"), validateCrateRoom, createRoom);

router.get("/getRooms", getRooms);

router.get("/getRoomById/:rid", validateGetRoomById, getRoomById);

router.put("/updateRoom/:rid", validateUpdateRoom, updateRoom);

router.patch("/updateImages/:rid", uploadRoomImage.array("images", 5), cloudinaryUploadMultiple("rooms-img"), validateUpdateRoom, updateRoomImages);

export default router;