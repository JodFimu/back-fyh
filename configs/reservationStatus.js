import cron from "node-cron";
import Reservation from "../src/reservation/reservation.model.js";

const startReservationStatus = () => {
    cron.schedule("0 0 * * *", async () => {
        try {
            const result = await Reservation.updateMany(
                {
                    exitDate: { $lt: new Date() },
                    status: true
                },
                { $set: { status: false } }
            );
            console.log(`Reservaciones vencidas actualizadas: ${result.modifiedCount}`);
        } catch (error) {
            console.error("Error al actualizar estados de reservaciones:", error.message);
        }
    });
};

export default startReservationStatus;