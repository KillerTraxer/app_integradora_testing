import mongoose from "mongoose";

const tramientosSchema = mongoose.Schema({
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
    general: {
        type: String,
        require: true,
        trim: true
    },
    fases: [{
        id: String,
        contenido: String
    }],
    configuracion: {
        duracion: {
            valor: String,
            unidad: String
        },
        horaPreferida: String,
        frecuencia: String
    },
    status: {
        type: String,
        require: true,
        enum: ['en proceso', 'terminado', 'cancelado'],
        default: 'en proceso'
    },
}, {
    timestamps: true
})

export default mongoose.model('Tratamiento', tramientosSchema);