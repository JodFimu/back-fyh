import { Router } from "express";
import { createHotel, deleteHotel, getHotels, getHotelById, updateHotel, updateHotelPictures, getReservationsByHotel, createService, getRoomsByHotelById, getUsersByHotel } from "../hotel/hotel.controller.js";
import { createHotelValidator, deleteHotelValidator, getHotelByIdValidator, getHotelsValidator, updateHotelPicturesValidator, updateHotelValidator, getReservationsByHotelValidator, createServiceValidator, parseServicesMiddleware, getUsersByHotelValidator} from "../middlewares/hotel-validator.js";
import { cloudinaryUploadMultiple } from "../middlewares/img-uploads.js";
 
const router = Router();
 
/**
 * @swagger
 * tags:
 *   name: Hotel
 *   description: API for managing hotels
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
/**
 * @swagger
 * /hotels/createHotel:
 *   post:
 *     summary: Crear un nuevo hotel
 *     tags: [Hotel]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               telephone:
 *                 type: string
 *               services:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: [Hotel, Singleroom, Doubleroom, Suite, Deluxeroom, Event]
 *                     description:
 *                       type: string
 *                     price:
 *                       type: number
 *               host:
 *                 type: string
 *               pictures:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Hotel creado correctamente
 *       400:
 *         description: Error de validación o datos incorrectos
 */
router.post("/createHotel", cloudinaryUploadMultiple("hotels-img"),parseServicesMiddleware, createHotelValidator, createHotel);
 
/**
 * @swagger
 * /hotels/:
 *   get:
 *     summary: Obtener todos los hoteles
 *     tags: [Hotel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Límite de resultados
 *       - in: query
 *         name: from
 *         schema:
 *           type: integer
 *         description: Offset de resultados
 *     responses:
 *       200:
 *         description: Lista de hoteles
 */
router.get("/", getHotelsValidator, getHotels);
 
/**
 * @swagger
 * /hotels/findHotel/{hid}:
 *   get:
 *     summary: Obtener hotel por ID
 *     tags: [Hotel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del hotel
 *     responses:
 *       200:
 *         description: Hotel encontrado
 *       404:
 *         description: Hotel no encontrado
 */
router.get("/findHotel/:hid", getHotelByIdValidator, getHotelById);
 
/**
 * @swagger
 * /hotels/updateHotel/{hid}:
 *   put:
 *     summary: Actualizar información de un hotel
 *     tags: [Hotel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del hotel
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               telephone:
 *                 type: string
 *               services:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: [Hotel, Singleroom, Doubleroom, Suite, Deluxeroom, Event]
 *                     description:
 *                       type: string
 *                     price:
 *                       type: number
 *               host:
 *                 type: string
 *               pictures:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Hotel actualizado correctamente
 *       404:
 *         description: Hotel no encontrado
 */
router.put("/updateHotel/:hid", updateHotelValidator, updateHotel);
 
/**
 * @swagger
 * /hotels/updatePictures/{hid}:
 *   patch:
 *     summary: Actualizar imágenes de un hotel
 *     tags: [Hotel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del hotel
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Imágenes actualizadas correctamente
 *       404:
 *         description: Hotel no encontrado
 */
router.patch("/updatePictures/:hid", cloudinaryUploadMultiple("hotels-img"), updateHotelPicturesValidator, updateHotelPictures);
 
/**
 * @swagger
 * /hotels/deleteHotel/{hid}:
 *   delete:
 *     summary: Eliminar un hotel
 *     tags: [Hotel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del hotel
 *     responses:
 *       200:
 *         description: Hotel eliminado correctamente
 *       404:
 *         description: Hotel no encontrado
 */
router.delete("/deleteHotel/:hid", deleteHotelValidator, deleteHotel);
 
/**
 * @swagger
 * /hotels/getReservations/{hid}:
 *   get:
 *     summary: Obtener todas las reservaciones de un hotel por ID
 *     tags: [Hotel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del hotel
 *     responses:
 *       200:
 *         description: Lista de reservaciones del hotel
 *       404:
 *         description: Hotel no encontrado
 *       401:
 *         description: No autorizado o token inválido
 */
router.get("/getReservations/:hid", getReservationsByHotelValidator, getReservationsByHotel);
 
/**
 * @swagger
 * /hotels/createService/{hid}:
 *   post:
 *     summary: Agregar un nuevo servicio a un hotel
 *     tags: [Hotel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del hotel al que se le agregará el servicio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [Hotel, Singleroom, Doubleroom, Suite, Deluxeroom, Event]
 *                 description: Tipo de servicio
 *               description:
 *                 type: string
 *                 description: Descripción del servicio
 *               price:
 *                 type: number
 *                 description: Precio del servicio
 *     responses:
 *       201:
 *         description: Servicio creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     service:
 *                       type: object
 *                       properties:
 *                         type:
 *                           type: string
 *                         description:
 *                           type: string
 *                         price:
 *                           type: number
 *                     hotel:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *       400:
 *         description: Error de validación o datos incorrectos
 *       403:
 *         description: No autorizado para agregar servicios al hotel
 *       404:
 *         description: Hotel no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.post("/createService/:hid", createServiceValidator, createService);
 
/**
 * @swagger
 * /hotels/getRoomsByHotel:
 *   get:
 *     summary: Obtener habitaciones del hotel del host autenticado
 *     tags: [Hotel]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de habitaciones del hotel
 *       404:
 *         description: Hotel no encontrado
 *       401:
 *         description: No autorizado o token inválido
 */
router.get('/getRoomsByHotel/:hid', getRoomsByHotelById);

router.get("/clients", getUsersByHotelValidator, getUsersByHotel)
 
export default router;