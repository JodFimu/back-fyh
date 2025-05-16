import { Schema, model } from "mongoose";

const reservationSchema = Schema({
    startDate: {
        type: Date,
        required: true
    },
    extiDate: {
        type: Date,
        required: true 
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
})

reservationSchema.methods.toJSON = function () {
    const { user, _id, ...reservation } = this.toObject()
    reservation.id = _id 
    return reservation
}

export default model("Reservation", reservationSchema)