import Reservation from "./reservation.model.js";

export const createReservation = async (req, res) => {
    try {
        const data = req.body;
        const reservation = await Reservation.create(data);
        res.status(201).json({
            success: true,
            message: "Reservación creada exitosamente",
            reservation
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al crear la reservación",
            error: err.message
        });
    }
};

export const getReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find({ status: true });
        res.status(200).json({
            success: true,
            reservations
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al obtener las reservaciones",
            error: err.message
        });
    }
};

export const getReservationById = async (req, res) => {
    try {
        const { id } = req.params;
        const reservation = await Reservation.findById(id);
        if (!reservation || !reservation.status) {
            return res.status(404).json({
                success: false,
                message: "Reservación no encontrada"
            });
        }
        res.status(200).json({
            success: true,
            reservation
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al obtener la reservación",
            error: err.message
        });
    }
};

export const updateReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const updated = await Reservation.findByIdAndUpdate(id, data, { new: true });
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Reservación no encontrada"
            });
        }
        res.status(200).json({
            success: true,
            message: "Reservación actualizada",
            reservation: updated
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar la reservación",
            error: err.message
        });
    }
};

export const deleteReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Reservation.findByIdAndUpdate(id, { status: false }, { new: true });
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Reservación no encontrada"
            });
        }
        res.status(200).json({
            success: true,
            message: "Reservación eliminada",
            reservation: deleted
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar la reservación",
            error: err.message
        });
    }
};

export const getUserReservations = async (req, res) => {
    try {
        const { usuario } = req;

        const reservations = await Reservation.find({ user: usuario._id })
            //.populate('', '')
            //.populate('', '');

        return res.status(200).json({
            success: true,
            reservations,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener el historial de reservaciones',
            error: err.message,
        });
    }
};
