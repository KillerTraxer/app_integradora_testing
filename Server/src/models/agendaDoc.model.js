import mongoose from "mongoose";

const agendaDocSchema = mongoose.Schema({
    dentista: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dentistas',
        require: true
    },
    diasTrabajo: [
        {
            dia: {
                type: Number,
                enum: [0, 1, 2, 3, 4, 5, 6], // 0 = domingo, 6 = sábado
            },
            activo: {
                type: Boolean,
                default: false,
            },
        }
    ],
    horario: {
        inicio: {
            type: String,
        },
        fin: {
            type: String,
        }
    },
    intervaloCitas: {
        duracion: {
            type: Number,
            default: 60
        },
    },
    eventos: [
        {
            title: {
                type: String,
                require: true
            },
            fechaInicio: {
                type: Date,
            },
            fechaFin: {
                type: Date,
            },
            allDay: {
                type: Boolean,
                default: false
            }
        }
    ]
});

export default mongoose.model('AgendaDoc', agendaDocSchema);