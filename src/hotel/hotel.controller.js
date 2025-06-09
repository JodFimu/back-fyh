import Hotel from './hotel.model.js'
import User from '../user/user.model.js'
import Room from '../room/room.model.js'
 import Reservation from "../reservation/reservation.model.js";
export const createHotel = async (req, res) => {
  try {
    const imgs = req.imgs || [];
    const data = req.body;

    if (imgs.length > 0) {
        data.images = imgs;
    } else {
        return res.status(400).json({
        msg: "Se requiere al menos una imagen"
    });
}   

    let services;
    try {
      if (typeof data.services === "string") {
        services = JSON.parse(data.services);
      } else {
        services = data.services;
      }
    } catch (err) {
      console.error("Error parseando services:", err);
      return res.status(400).json({
        msg: "Error en el formato de services"
      });
    }

    data.services = services;

    const host = await User.findById(data.host);
    if (!host || !host.status) {
      return res.status(404).json({
        msg: "Host no encontrado"
      });
    }

    if (host.role !== "HOST_ROLE") {
      return res.status(400).json({
        msg: "El usuario asignado no tiene las credenciales necesarias"
      });
    }

    const newHotel = await Hotel.create(data);

    return res.status(201).json({
      success: true,
      msg: "Hotel creado correctamente",
      newHotel
    });

  } catch (error) {
    console.error("Error en createHotel:", error);
    return res.status(500).json({
      success: false,
      msg: "Error al crear el hotel",
      error: error.message
    });
  }
};
 
export const getHotels = async (req, res) =>{
    try{
        const { limit = 10, from = 0 } = req.query
        const query = { status: true }
        const [total, hotels] = await Promise.all([
            Hotel.countDocuments(query),
            Hotel.find(query)
            .populate("host", "name email")
            .populate("reservations", "room")
            .skip(Number(from))
            .limit(Number(limit))
        ])
 
        return res.status(200).json({
            success: true,
            total,
            hotels
        })
    }catch (error) {
        return res.status(500).json({
            msg: "Error al obtener los hoteles",
            error: error.message
        })
    }
}


export const getReservationsByHotel = async (req, res) => {
    try {
        const { hid } = req.params;

        const rooms = await Room.find({ hotel: hid }).select("_id");

        if (!rooms.length) {
            return res.status(404).json({
                success: false,
                message: "No hay habitaciones para este hotel.",
            });
        }

        const roomIds = rooms.map((room) => room._id);

        const reservations = await Reservation.find({
            room: { $in: roomIds },
            status: true
        })
        .populate("room", "numRoom type") 
        .populate("user", "name email");  

        return res.status(200).json({
            success: true,
            reservations,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener las reservaciones",
            error: error.message
        });
    }
};

 
export const getRoomsByHotelById = async (req, res) => {
    try {
        const { hid } = req.params;
 
        const hotel = await Hotel.findOne({ _id: hid, status: true });
        if (!hotel) {
            return res.status(404).json({ msg: "Hotel no encontrado" });
        }
       
        const rooms = await Room.find({ hotel: hid, status: true });
        return res.status(200).json({
            success: true,
            rooms
        });
    } catch (error) {
        return res.status(500).json({
            msg: "Error al obtener las habitaciones",
            error: error.message
        });
    }
};
 
export const getHotelById = async (req, res) => {
    try {
        const { hid } = req.params
        const hotel = await Hotel.findOne({ _id: hid, status: true })
        .populate("host", "name email")
 
        if(!hotel) {
            return res.status(404).json({
                msg: "Hotel no encontrado"
            })
        }
 
        return res.status(200).json({
            success: true,
            hotel
        })
 
    } catch (error) {
        return res.status(500).json({
            msg: "Error al obtener el hotel",
            error: error.message
        })
    }
}
 
export const updateHotel = async (req, res) => {
    try {
        const { hid } = req.params
        const data = req.body
 
        if (data.host) {
        const user = await User.findById(data.host)
 
        if (!user || !user.status || user.role !== "HOST_ROLE") {
            return res.status(400).json({
            msg: "El usuario asignado no tiene las credenciales necesarias"
            })
        }
        }
 
        const updatedHotel = await Hotel.findByIdAndUpdate(hid, data, { new: true })
 
        if (!updatedHotel) {
        return res.status(404).json({
            success: false,
            msg: "Hotel no encontrado"
        })
        }
 
        return res.status(200).json({
        success: true,
        msg: "Hotel actualizado correctamente",
        hotel: updatedHotel
        })
 
    } catch (error) {
        return res.status(500).json({
        success: false,
        msg: "Error al actualizar el hotel",
        error: error.message
        })
    }
}
 
export const updateHotelPictures = async (req, res) => {
    try{
        const { hid } = req.params
       
        if(!req.imgs || req.imgs.length === 0) {
            return res.status(400).json({
                msg: "No se han subido imagenes"
            })
        }
       
        data.images = req.imgs
 
        const updatedHotel = await Hotel.findByIdAndUpdate(
            hid,
            { images: req.imgs },
            { new: true }
        )
 
        if (!updatedHotel) {
            return res.status(404).json({
                success: false,
                msg: "Hotel no encontrado"
        })
        }
 
        return res.status(200).json({
        success: true,
        msg: "Imágenes actualizadas correctamente",
        hotel: updatedHotel
    })
    }catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al actualizar las imagenes",
            error: error.message
        })
    }
}
 
export const deleteHotel = async (req, res) => {
    try {
        const { hid } = req.params
 
        const deletedHotel = await Hotel.findByIdAndUpdate(hid, { status: false }, { new: true })
 
        if(!deletedHotel) {
            return res.status(404).json({
                msg: "Hotel no encontrado"
            })
        }
        return res.status(200).json({
            success: true,
            msg: "Hotel eliminado correctamente",
            deletedHotel
        })
    }catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al eliminar el hotel",
            error: error.message
        })
    }
}
  
export const createService = async (req, res) => {
    try {
        const { hid } = req.params;
        const { type, description, price } = req.body;
        const { usuario } = req;
 
        const hotel = await Hotel.findById(hid);
       
        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel no encontrado"
            });
        }
 
        if (hotel.host.toString() !== usuario._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para agregar servicios a este hotel"
            });
        }
 
        const newService = {
            type,
            description,
            price
        };
 
        hotel.services.push(newService);
        await hotel.save();
 
        res.status(201).json({
            success: true,
            message: "Servicio creado exitosamente",
            data: {
                service: newService,
                hotel: {
                    id: hotel._id,
                    name: hotel.name
                }
            }
        });
 
    } catch (error) {
        console.error("Error en createService:", error);
        res.status(500).json({
            success: false,
            message: "Error al crear el servicio",
            error: error.message
        });
    }
};

export const getUsersByHotel = async (req, res) => {
    try {
        const { usuario } = req;
        const hotel = await Hotel.find({host: usuario._id})
            .populate({path: "reservations", select: "user status",
                populate: {path: "user", select: "name email role status"}})
            
 
        if (!hotel) {
            return res.status(404).json({
                msg: "Hotel no encontrado"
            });
        }
 
        const uniqueUsers = {};
        hotel[0].reservations.forEach(reservation => {
            if (
                reservation.status === true &&
                reservation.user &&
                !uniqueUsers[reservation.user._id]
            ) {
                uniqueUsers[reservation.user._id] = {
                    id: reservation.user._id,
                    name: reservation.user.name,
                    email: reservation.user.email,
                    role: reservation.user.role,
                    status: reservation.user.status
                };
            }
        });

        const users = Object.values(uniqueUsers);
 
        return res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        return res.status(500).json({
            msg: "Error al obtener los usuarios",
            error: error.message
        });
    }
}