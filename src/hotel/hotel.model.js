import { Schema, model } from "mongoose";

const hotelSchema = Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        maxLength: [50, "Name cannot exceed 50 characters"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        maxLength: [500, "Description cannot exceed 500 characters"]
    },
    address: {
        type: String,
        required: [true, "Address is required"],
        maxLength: [100, "Address cannot exceed 100 characters"]
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
    telephone: {
        type: String,
        required: [true, "Telephone is required"],
        maxLength: [8, "Telephone cannot exceed 8 characters"]
    },
    services: {
    type: [
        {
            type: {
                type: String,
                required: [true, "Service is required"],
                enum: [
                    "Hotel",
                    "Singleroom",
                    "Doubleroom",
                    "Suite",
                    "Deluxeroom",
                    "Event"
                ]
            },
            price: {
                type: Number,
                required: [true, "Price is required"],
                min: [0, "Price cannot be negative"]
            }
        }
    ],
    validate: {
        validator: function (arr) {
            return arr.length > 0;
        },
        message: "At least one service must be specified"
    }
}
,
    host: {
            type: Schema.Types.ObjectId,
            ref: "User"    
    },
    ratings: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            maxLength: 300
        },
        date: {
            type: Date,
            default: () => new Date(new Date().setHours(0, 0, 0, 0)),
            set: (value) => new Date(new Date(value).setHours(0, 0, 0, 0))
        }
    }],
    averageRating: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: true
    },
},
{
    timestamps: true,
    versionKey: false
});

hotelSchema.methods.toJSON = function () {
    const { __v, _id, ratings, ...hotel } = this.toObject();
    hotel.hid = _id;

    if (ratings && ratings.length > 0) {
        const sum = ratings.reduce((acc, item) => acc + item.rating, 0);
        hotel.averageRating = parseFloat((sum / ratings.length).toFixed(1));
    } else {
        hotel.averageRating = 0;
    }
    return hotel;
};


export default model("Hotel", hotelSchema);