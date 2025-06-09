import { Schema, model } from "mongoose";

const eventSchema = Schema({
    
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
    name: {
        type: String,
        required: [true, "Name is required"],
        maxLength: [50, "Name cannot exceed 50 characters"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        maxLength: [200, "Description cannot exceed 200 characters"]
    },
    date: {
        type: Date,
        required: [true, "Date is required"]
    },
    time: {
        type: String,
        required: [true, "Time is required"]
    },
    location: {
        type: String,
        required: [true, "Location is required"],
        maxLength: [100, "Location cannot exceed 100 characters"]
    },
    category:{
        type: String,
        required: true,
        enum: ["weding", "party", "business", "other"],
        default: "other"
    },
    status: {
        type: Boolean,
        default: true
    },
    hotel: {
        type: Schema.Types.ObjectId,
        ref: "Hotel"
    },
    cost : {
        type: Number
    },
    adminEvent:{
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    reservation: [{
        type: Schema.Types.ObjectId,
        ref: "EventReservation"
    }]
});

eventSchema.methods.toJSON = function () {
    const { _id, ...event } = this.toObject();
    event.eid = _id;
    return event;
}

export default model("Event", eventSchema);