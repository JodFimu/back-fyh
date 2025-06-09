import { Schema, model } from "mongoose";

const reservationSchema = Schema({
    startDate: {
        type: Date,
        required: true
    },
    exitDate: {
        type: Date,
        required: true 
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: "Room",
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
})

reservationSchema.methods.toJSON = function () {
    const {_id, ...reservation } = this.toObject()
    reservation.rid = _id 
    return reservation
}

export default model("Reservation", reservationSchema)