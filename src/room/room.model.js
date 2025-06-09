import {Schema, model} from 'mongoose';

const roomSchema = Schema({
    numRoom: {
        type: String,
        required: [true, "Room number is required"],
        maxLength: [35, "Room number cannot exceed 35 characters"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        maxLength: [100, "Description cannot exceed 100 characters"]
    },
    capacity: {
        type: String,
        required: [true, "Capacity is required"]
    },
    pricePerDay: {
        type: Number,
        required: [true, "Price per hour is required"],
        min: [0, "Price per hour must be at least 0"]
    },
    status: {
        type: Boolean,
        default: true
    },
    type: {
        type: String,
        required: [true, "Type is required"],
        enum: ["SINGLE", "DOUBLE", "SUITE", "DELUXE"]
    },
    images: {
        type: [String],
        required: [true, "At least one image is required"],
        validate: {
            validator: function (arr) {
                return arr.length > 0;
            },
            message: "Must include at least one image"
        }
    },
    hotel: {
        type: Schema.Types.ObjectId,
        ref: 'Hotel',
        required: [true, "Hotel is required"]
    },
    reservations: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Reservation'
        }
    ]
});

roomSchema.methods.toJSON = function () {
    const { __v, _id, ...room } = this.toObject()
    room.rid = _id;
    return room;
}

export default model("Room", roomSchema);