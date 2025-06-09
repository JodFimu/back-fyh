import Room from './room.model.js';

export const createRoom = async (req, res) => {

    try {
        const { numRoom, description, capacity, pricePerDay, type, hotel} = req.body;
         const images = req.imgs;
        const newRoom = new Room({ numRoom, description, capacity, pricePerDay, type, images, hotel});
        await newRoom.save();
        return res.status(201).json({
            success: true,
            message: 'Room created successfully',
            room: newRoom
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error creating room',
            error: error.message
        });
    }
}

export const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        return res.status(200).json({
            success: true,
            rooms
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching rooms',
            error: error.message
        });
    }
}

export const getRoomById = async (req, res) => {
    try {
        const { rid } = req.params;
        const room = await Room.findById(rid);
        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }
        return res.status(200).json({
            success: true,
            room
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching room',
            error: error.message
        });
    }
}

export const updateRoom = async (req, res) => {
  try {
    const { rid } = req.params;
    const data = req.body;

    const room = await Room.findByIdAndUpdate(rid, {$set: data}, {new: true});
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found"
      });
    }
    return res.status(200).json({
      success: true,
      message: "Room updated successfully",
      room
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating room",
      error: error.message
    });
  }
};

export const updateRoomImages = async (req, res) => {
  try {
    const { rid } = req.params;

    if (!req.imgs || req.imgs.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No se recibieron imágenes"
      });
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      rid, { images: req.imgs }, { new: true, runValidators: true });

    if (!updatedRoom) {
      return res.status(404).json({
        success: false,
        message: "Room not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Imágenes de habitación actualizadas",
      room: updatedRoom
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al actualizar imágenes de la habitación",
      error: err.message
    });
  }
};


export const filterRooms = async (req, res) => {
  try {
    const { capacity, minPrice, maxPrice, type, startDate, exitDate } = req.query;

    let filter = {};
    if (capacity) filter.capacity = capacity;
    if (type) filter.type = type;

    if (minPrice && maxPrice) {
      filter.pricePerDay = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    } else if (minPrice) {
      filter.pricePerDay = { $gte: Number(minPrice) };
    } else if (maxPrice) {
      filter.pricePerDay = { $lte: Number(maxPrice) };
    }

    let rooms = await Room.find(filter);

    if (startDate && exitDate) {
      const start = new Date(startDate);
      const end = new Date(exitDate);
      
      const availableRooms = [];
      for (const room of rooms) {
        const reservations = await Room.populate(room, { path: 'reservations' });
        const hasOverlap = reservations.reservations.some(r =>
          r.status &&
          (
            (new Date(r.startDate) < end) &&
            (new Date(r.exitDate) > start)
          )
        );
        if (!hasOverlap) {
          availableRooms.push(room);
        }
      }
      rooms = availableRooms;
    }

    return res.status(200).json({
      success: true,
      rooms
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error filtrando habitaciones',
      error: error.message
    });
  }
};