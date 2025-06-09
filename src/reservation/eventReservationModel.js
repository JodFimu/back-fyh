import { Schema, model } from "mongoose";

const eventReservationSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: [true, "El evento es requerido"]
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "El usuario es requerido"]
  },
  reservationDate: {
    type: Date,
    default: Date.now,
    required: [true, "La fecha de reserva es requerida"]
  },
  time:{
    type: String,
    required: [true, "La hora de la reserva es requerida"],
    maxlength: [5, "La hora no puede exceder los 5 caracteres"]
  },
  attendees: {
    type: Number,
    default: 1,
    min: [1, "Debe haber al menos 1 asistente"],
    max: [100, "El número máximo de asistentes es 1000"]
  },
  description: {
    type: String,
    maxlength: [500, "La descripcion no pueden exceder los 500 caracteres"],
    default: "no description"
  }
}, {
  timestamps: true
});

eventReservationSchema.methods.toJSON = function() {
  const { __v, _id, ...reservation } = this.toObject();
  reservation.rid = _id;
  return reservation;
};

export default model("EventReservation", eventReservationSchema);
