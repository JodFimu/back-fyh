import { Router } from "express";
import { listHotelsWithReservationCount,  listHotelReservations} from "./report.controller.js";
import { listHotelReservationsValidator } from "../middlewares/report-validator.js";

const router = Router();

router.get("/getTopHotels", listHotelsWithReservationCount);

router.get("/getHotelReservations/:hid", listHotelReservationsValidator, listHotelReservations);

export default router;