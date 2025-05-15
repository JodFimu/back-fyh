import { Schema, model } from "mongoose";

const userSchema = Schema({
    profilePicture: {
        type: String,
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        maxLength: [35, "Name cannot exceed 35 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    role: {
        type: String,
        required: true,
        default: "CLIENT_ROLE",
        enum: ["ADMIN_ROLE", "CLIENT_ROLE", "HOST_ROLE"]
    },
    reservation: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Reservation'
        }
    ],
    events: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Event'
        }
    ],
    status: {
        type: Boolean,
        default: true
    }
})

userSchema.methods.toJSON = function () {
    const { password, _id, ...usuario } = this.toObject()
    usuario.uid = _id
    return usuario
}

export default model("User", userSchema)