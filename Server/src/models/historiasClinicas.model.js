import mongoose from "mongoose";

const historiasClinicasSchema = mongoose.Schema({
    paciente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'pacientes',
        require: true
    },
    nombreCompleto: {
        type: String,
        require: true,
        trim: true
    },
    edad: {
        type: String,
        require: true,
        trim: true
    },
    genero: {
        type: String,
        require: true,
        trim: true
    },
    fechaNacimiento: {
        type: mongoose.Schema.Types.Mixed,
        require: true,
        trim: true
    },
    direccion: {
        type: String,
        require: true,
        trim: true
    },
    localidad: {
        type: String,
        require: true,
        trim: true
    },
    ocupacion: {
        type: String,
        require: true,
        trim: true
    },
    phone: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        trim: true
    },
    diagnostico: {
        type: String,
        require: true,
        trim: true
    },
    diseases: {
        type: Object,
        default: {}
    },
    otherDiseases: {
        type: String
    },
    odontogram: {
        type: Array,
        default: []
    },
    extraOralExam: {
        head: String,
        face: String,
        atm: String,
        ganglios: String,
        lips: String
    },
    treatments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tratamientos',
        require: false
    }],
    downloadLink: {
        type: String,
        require: false
    }
})

export default mongoose.model('historiasClinica', historiasClinicasSchema);