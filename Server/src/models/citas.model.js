import mongoose from "mongoose";

const citasSchema = mongoose.Schema({
    asunto: {
        type: String,
        require: true,
        trim: true
    },
    fecha: {
        type: Date,
        require: true,
        trim: true
    },
    descripcion: {
        type: String,
        require: true,
        trim: true
    },
    // paciente: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Paciente',
    //     require: true
    // },
    dentista: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dentista',
        require: true
    },
    name: {
        type: String,
        require: false
    },
    apellidos: {
        type: String,
        require: false
    },
    email: {
        type: String,
        require: false
    },
    telefono: {
        type: String,
        require: false
    },
    motivo: {
        type: String,
        require: false
    }
}, {
    timestamps: true
});

export default mongoose.model('Citas', citasSchema);