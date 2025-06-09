import Reservation from '../reservation/reservation.model.js';
import EventReservation from "../reservation/eventReservationModel.js";
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export const generateBill = async (req, res) => {
    try {
        const { rid } = req.params;
        const reservation = await Reservation.findById(rid)
            .populate('user', 'name email')
            .populate('room')
            .populate({
                path: 'room',
                populate: { path: 'hotel', select: 'name address telephone' }
            });

        if (!reservation) {
            return res.status(404).json({
                success: false,
                msg: "Reservación no encontrada"
            });
        }

        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([500, 600]);
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        let y = 560;
        const drawText = (text, size = 12, color = rgb(0, 0, 0)) => {
            page.drawText(text, { x: 50, y, size, font, color });
            y -= size + 8;
        };

        drawText('Factura de Reserva', 18);
        y -= 10;
        drawText(`Hotel: ${reservation.room.hotel.name}`);
        drawText(`Dirección: ${reservation.room.hotel.address}`);
        drawText(`Teléfono: ${reservation.room.hotel.telephone}`);
        drawText(`Habitación: ${reservation.room.numRoom}`);
        drawText(`Cliente: ${reservation.user.name} (${reservation.user.email})`);
        drawText(`Fecha de Check-In: ${new Date(reservation.startDate).toLocaleDateString()}`);
        drawText(`Fecha de Check-Out: ${new Date(reservation.exitDate).toLocaleDateString()}`);
        drawText(`Precio por día: $${reservation.room.pricePerDay}`);
        y -= 10;
        drawText(`Total: $${reservation.room.pricePerDay}`, 14);

        const pdfBytes = await pdfDoc.save();

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="factura_${reservation.rid}.pdf"`,
            'Content-Length': pdfBytes.length
        });
        res.end(Buffer.from(pdfBytes));
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al generar la factura",
            error: error.message
        });
    }
};


 export const generateEventReservation = async (req, res) => {
  try {
    const { eid } = req.params;
    const reservation = await EventReservation.findById(eid)
      .populate({
        path: "event",
        select: "name date time location cost hotel",
        populate: {
          path: "hotel",
          select: "name address telephone"
        }
      })
      .populate("user", "name email");

    if (!reservation) {
      return res.status(404).json({
        success: false,
        msg: "Reservación no encontrada"
      });
    }

    const { event, user, attendees, description } = reservation;
    const { hotel, cost: pricePerPerson = 0 } = event;

    const totalAmount = pricePerPerson * attendees;

    const pdfDoc = await PDFDocument.create();
    const page   = pdfDoc.addPage([500, 600]);
    const font   = await pdfDoc.embedFont(StandardFonts.Helvetica);
    let y        = 560;

    const drawText = (text, size = 12, color = rgb(0,0,0)) => {
      page.drawText(text, { x: 50, y, size, font, color });
      y -= size + 8;
    };

    drawText("Factura de Reserva de Evento", 18);
    y -= 10;

    if (hotel) {
      drawText(`Hotel: ${hotel.name}`);
      drawText(`Dirección: ${hotel.address}`);
      drawText(`Teléfono: ${hotel.telephone}`);
      y -= 4;
    }

    drawText(`Evento: ${event.name}`);
    drawText(`Fecha: ${new Date(event.date).toLocaleDateString()}`);
    drawText(`Hora: ${event.time}`);
    drawText(`Lugar: ${event.location}`);
    y -= 4;

    // Datos del cliente y reserva
    drawText(`Cliente: ${user.name} (${user.email})`);
    drawText(`Asistentes: ${attendees}`);
    if (description) {
      drawText(`Notas: ${description}`);
    }
    y -= 10;

    drawText(`Total: $${event.cost}`, 14);

    const pdfBytes = await pdfDoc.save();
    res.set({
      "Content-Type":        "application/pdf",
      "Content-Disposition": `attachment; filename="factura_evento_${reservation._id}.pdf"`,
      "Content-Length":      pdfBytes.length
    });
    return res.end(Buffer.from(pdfBytes));

  } catch (err) {
    console.error("Error generando factura:", err);
    return res.status(500).json({
      success: false,
      msg: "Error al generar la factura",
      error: err.message
    });
  }
};