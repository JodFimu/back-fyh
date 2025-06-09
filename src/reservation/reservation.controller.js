import Reservation from "./reservation.model.js";
import Room from "../room/room.model.js";
import Hotel from "../hotel/hotel.model.js";
import User from "../user/user.model.js"

export const createReservation = async (req, res) => {
    try {
        const { rid } = req.params; 
        const { usuario } = req;
        const { startDate, exitDate, ...otherData } = req.body;

        const room = await Room.findById(rid);
        const user = await User.findById(usuario._id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Habitación no encontrada"
            });
        }

        if (new Date(startDate) >= new Date(exitDate)) {
            return res.status(400).json({
                success: false,
                message: "La fecha de entrada debe ser menor que la fecha de salida"
            });
        }

        const overlappingReservation = await Reservation.findOne({
            room: room._id,
            $and: [
                { startDate: { $lt: new Date(exitDate) } },
                { exitDate: { $gt: new Date(startDate) } }
            ]
        });

        if (overlappingReservation) {
            return res.status(400).json({
                success: false,
                message: "Ya existe una reservación para esas fechas en esta habitación"
            });
        }

        const reservationData = {
            startDate,
            exitDate,
            user: usuario._id,
            room: room._id,
            ...otherData
        };

        const reservation = await Reservation.create(reservationData);

        room.reservations.push(reservation._id);
        await room.save();

        user.reservations.push(reservation._id);
        await user.save();

        if (room.hotel) {
            await Hotel.findByIdAndUpdate(
                room.hotel,
                { $push: { reservations: reservation._id } }
            );
        }

         res.status(201).json({
            success: true,
            message: "Reservación creada exitosamente",
            id: reservation._id  
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al crear la reservación",
            error: err.message
        });
    }
};



export const getReservationById = async (req, res) => {
    try {
        const { rid } = req.params;
        const reservation = await Reservation.findById(rid);
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


export const deleteReservation = async (req, res) => {
    try {
        const { rid } = req.params;

        const reservation = await Reservation.findById(rid);
        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Reservación no encontrada"
            });
        }


        if (reservation.room) {
            await Room.findByIdAndUpdate(
                reservation.room,
                { $pull: { reservations: reservation._id } }
            );
        }

        if (reservation.room) {
            const room = await Room.findById(reservation.room);
            if (room && room.hotel) {
                await Hotel.findByIdAndUpdate(
                    room.hotel,
                    { $pull: { reservations: reservation._id } }
                );
            }
        }

        const deleted = await Reservation.findByIdAndUpdate(rid, { status: false }, { new: true });
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



export const getReservationsByRoom = async (req, res) => {
    try {
        const { rid } = req.params;

        const room = await Room.findById(rid);
        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Habitación no encontrada",
            });
        }

        const reservations = await Reservation.find({
            room: rid,
            status: true,
        })
        .populate("user") 
        .populate("room", "numRoom type"); 
        console.log(reservations)
        res.status(200).json({
            success: true,
            count: reservations.length,
            reservations,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al obtener las reservaciones de la habitación",
            error: err.message,
        });
    }
};

export const getReservationsByHost = async (req, res) => {
  try {
    const { usuario } = req;            
    const hostId = usuario._id;

    const hotel = await Hotel.findOne({ host: hostId })
      .populate({
        path: 'reservations',
        match: { status: true },                        
        select: 'startDate exitDate status user room',  
        populate: [
          { path: 'user', select: 'name email role' },  
          { path: 'room', select: 'numRoom' }           
        ]
      });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        msg: 'Hotel no encontrado'
      });
    }

    const reservations = hotel.reservations.map(r => ({
      rid:       r._id,
      startDate: r.startDate,
      exitDate:  r.exitDate,
      status:    r.status,
      user: {
        id:    r.user._id,
        name:  r.user.name,
        email: r.user.email,
        role:  r.user.role
      },
      room: {
        id:     r.room._id,
        number: r.room.numRoom
      }
    }));

    return res.status(200).json({
      success: true,
      reservations
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: 'Error al obtener las reservaciones',
      error: error.message
    });
  }
};