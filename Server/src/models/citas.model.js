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
    colorCita: {
        type: String,
        require: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Citas', citasSchema);