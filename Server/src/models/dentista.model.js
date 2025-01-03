import mongoose from "mongoose";

const dentistaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        require: true,
        trim: true
    },
    apellidos: {
        type: String,
        require: true,
        trim: true
    },
    telefono: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
        trim: true
    },
    otpSecret: {
        type: String,
        require: false,
    },
    otpExpiry: {
        type: Date,
        require: false,
    },
    verified: {
        type: Boolean,
        default: false
    },
    rol: {
        type: String,
        default: "dentista"
    },
    refreshToken: {
        type: String,
        required: false,
    }
}, {
    timestamps: true
})

export default mongoose.model('Dentista', dentistaSchema);