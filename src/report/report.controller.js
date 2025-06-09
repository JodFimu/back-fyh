import Hotel from "../hotel/hotel.model.js";
import Room from "../room/room.model.js";
import Reservation from "../reservation/reservation.model.js";

export const listHotelsWithReservationCount = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;

    const hotels = await Hotel.aggregate([
      { $match: { status: true } },
      {
        $project: {
          hotel: "$name",
          numReservaciones: {
            $size: { $ifNull: ["$reservations", []] }
          }
        }
      },
      { $sort: { numReservaciones: -1 } },
      { $limit: limit }
    ]);

    return res.json({
      success: true,
      hotels
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "No se pudieron listar los hoteles con sus conteos",
      error: error.message
    });
  }
};

export const listHotelReservations = async (req, res) => {
  try {
    const { hid } = req.params;
    if (!hid) {
      return res.status(400).json({ 
        success: false,
         message: "Must be an id from the hotel" });
    }

    const hotel = await Hotel.findById(hid).select("name");
    if (!hotel) {
      return res.status(404).json({ success: false, message: "Hotel no encontrado" });
    }

    const rooms = await Room.find({ hotel: hid })
      .select("_id numRoom type");

    const roomIds = rooms.map(r => r._id);

    if (roomIds.length === 0) {
      return res.json({ success: true, reservations: [] });
    }

    const reservations = await Reservation.find({ room: { $in: roomIds } })
      .select("startDate exitDate user room")
      .populate({ path: "user", select: "name" })
      .lean();
    const lookupRoom = rooms.reduce((acc, r) => {
      acc[r._id.toString()] = { numRoom: r.numRoom, type: r.type };
      return acc;
    }, {});

    const result = reservations.map(resv => ({
      hotel: hotel.name,
      numRoom: lookupRoom[resv.room.toString()].numRoom,
      type:   lookupRoom[resv.room.toString()].type,
      startDate: resv.startDate,
      exitDate:  resv.exitDate,
      user:      resv.user.name
    }));

    return res.json({ success: true, reservations: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error listando reservaciones del hotel",
      error: error.message
    });
  }
};