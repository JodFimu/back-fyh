import { Router } from "express"
import { generateBill, generateEventReservation } from "./bill.controller.js"
import { generateBillValidator, generateEventBillValidator } from "../middlewares/bill-validator.js"

const router = Router()

/**
 * @swagger
 * /bills/generate:
 *   post:
 *     summary: Generar una factura a partir de una reservación
 *     tags: [Bills]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rid:
 *                 type: string
 *                 description: ID de la reservación
 *     responses:
 *       201:
 *         description: Factura generada correctamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Reservación no encontrada
 */
router.get("/generate/:rid", generateBillValidator, generateBill);

/**
 * @swagger
 * /reservations/generateBillEvent/{eid}:
 *   get:
 *     summary: Generar factura de una reservación de evento
 *     tags: [EventReservation]
 *     parameters:
 *       - in: path
 *         name: eid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reservación de evento
 *     responses:
 *       200:
 *         description: PDF de la factura generado correctamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Reservación no encontrada
 *       500:
 *         description: Error interno al generar la factura
 */
router.get(
  "/generateBillEvent/:eid",
  generateEventBillValidator,
  generateEventReservation
);

export default router; 