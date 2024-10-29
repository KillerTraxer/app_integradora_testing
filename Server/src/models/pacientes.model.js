import mongoose from "mongoose";

const pacienteSchema = new mongoose.Schema({
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
        unique: true,
    },
    email : {
        type: String,
        require: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
        trim: true
    }

},{
    timestamps: true
})

export default mongoose.model('Paciente', pacienteSchema);