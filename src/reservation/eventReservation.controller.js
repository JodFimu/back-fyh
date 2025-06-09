import Event from "../event/event.model.js";
import EventReservation from "../reservation/eventReservationModel.js";
import User from "../user/user.model.js"

export const createEventReservation = async (req, res) => {
  try {
    const { eid } = req.params;              
    const { usuario } = req;                 
    const { attendees = 1, description = "", time, reservationDate } = req.body;

    const event = await Event.findById(eid);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Evento no encontrado"
      });
    }

    const reservation = await EventReservation.create({
      event:       event._id,
      user:        usuario._id,
      attendees,
      description,
      time,
      reservationDate: reservationDate ? new Date(reservationDate) : new Date()
    });

    event.reservation = event.reservation || [];
    event.reservation.push(reservation._id);
    await event.save();

    await User.findByIdAndUpdate(usuario._id, { $addToSet: { events: event._id } } );

    return res.status(201).json({
      success: true,
      message: "Reservación de evento creada exitosamente",
      reservationId: reservation._id
    });

  } catch (err) {
    console.error("Error creando reserva de evento:", err);
    return res.status(500).json({
      success: false,
      message: "Error al crear la reservación de evento",
      error: err.message
    });
  }
};

export const deleteEventReservation = async (req, res) => {
  try {
    const { rid } = req.params;    

    const reservation = await EventReservation.findById(rid);
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservación no encontrada"
      });
    }

    await reservation.deleteOne();

    await Event.findByIdAndUpdate(reservation.event,{ $pull: { reservation: reservation._id } });

    await User.findByIdAndUpdate(
      reservation.user,{ $pull: { events: reservation.event } });

    return res.status(200).json({
      success: true,
      message: "Reservación de evento eliminada correctamente"
    });

  } catch (err) {
    console.error("Error eliminando reserva de evento:", err);
    return res.status(500).json({
      success: false,
      message: "Error al eliminar la reservación de evento",
      error: err.message
    });
  }
};

export const getUserReservedEvents = async (req, res) => {
  try {
    const { usuario } = req; 

    const reservations = await EventReservation
      .find({ user: usuario._id })
      .populate({path: "event", select: "images name description date time location category cost"
      })
      .sort({ reservationDate: -1 }); 

    if (!reservations.length) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }
    const reservedEvents = reservations.map(r => ({
      reservationId: r._id,
      reservationDate: r.reservationDate,
      attendees: r.attendees,
      description: r.description,
      event: {
        eid: r.event._id,
        images: r.event.images,
        name: r.event.name,
        description: r.event.description,
        date: r.event.date,
        time: r.event.time,
        location: r.event.location,
        category: r.event.category,
        cost: r.event.cost
      }
    }));

    return res.status(200).json({
      success: true,
      data: reservedEvents
    });

  } catch (err) {
    console.error("Error listando eventos reservados:", err);
    return res.status(500).json({
      success: false,
      message: "Error al obtener los eventos reservados",
      error: err.message
    });
  }
};

export const getEventReservationById = async (req, res) => {
  try {
    const { rid } = req.params;    
     
    const reservation = await EventReservation
      .findById(rid)
      .populate({
        path: "event",
        select: "images name description date time location category cost"
      })
      .populate({
        path: "user",
        select: "uid name email profilePicture"
      });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservación no encontrada"
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        reservationId:    reservation._id,
        reservationDate:  reservation.reservationDate,
        attendees:        reservation.attendees,
        description:      reservation.description,
        event: {
          eid:           reservation.event._id,
          images:        reservation.event.images,
          name:          reservation.event.name,
          description:   reservation.event.description,
          date:          reservation.event.date,
          time:          reservation.event.time,
          location:      reservation.event.location,
          category:      reservation.event.category,
          cost:          reservation.event.cost
        },
        user: {
          uid:             reservation.user._id,
          name:            reservation.user.name,
          email:           reservation.user.email,
          profilePicture:  reservation.user.profilePicture
        }
      }
    });

  } catch (err) {
    console.error("Error obteniendo la reservación de evento:", err);
    return res.status(500).json({
      success: false,
      message: "Error al buscar la reservación",
      error: err.message
    });
  }
};

export const updateEventReservation = async (req, res) => {
  try {
    const { rid } = req.params;                         
    const { attendees, description, time, reservationDate } = req.body;

    const reservation = await EventReservation.findById(rid);
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservación no encontrada"
      });
    }

    if (attendees !== undefined && attendees < 1) {
      return res.status(400).json({
        success: false,
        message: "Debe haber al menos 1 asistente"
      });
    }

    if (attendees !== undefined)   reservation.attendees   = attendees;
    if (description !== undefined) reservation.description = description;
    if (time !== undefined)        reservation.time = time;
    if (reservationDate !== undefined) {
      const date = new Date(reservationDate);
      if (isNaN(date.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Fecha de reservación inválida"
        });
      }
      reservation.reservationDate = date;
    }

    const updated = await reservation.save();

    res.status(200).json({
      success: true,
      message: "Reservación de evento actualizada",
      data: {
        reservationId: updated._id,
        reservationDate: updated.reservationDate,
        attendees: updated.attendees,
        description: updated.description,
        time: updated.time,
        event: {
          eid: updated.event._id
        }
      }
    });
  } catch (err) {
    console.error("Error actualizando reservación de evento:", err);
    res.status(500).json({
      success: false,
      message: "Error al actualizar la reservación",
      error: err.message
    });
  }
};
