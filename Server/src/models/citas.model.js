import mongoose from "mongoose";

const citasSchema = mongoose.Schema({
    paciente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'pacientes',
        require: true
    },
    dentista: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dentistas',
        require: true
    },
    tratamientoCita: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tratamiento',
        require: false
    },
    fecha: {
        type: Date,
        require: true,
        trim: true
    },
    motivo: {
        type: String,
        require: false
    },
    status: {
        type: String,
        require: true,
        enum: ['confirmada', 'cancelada', 'realizada', 'sin realizar'],
        default: 'confirmada'
    },
    observaciones: {
        type: String,
        require: false
    },
    colorCita: {
        type: String,
        require: true
    },
}, {
    timestamps: true
});

export default mongoose.model('Citas', citasSchema);