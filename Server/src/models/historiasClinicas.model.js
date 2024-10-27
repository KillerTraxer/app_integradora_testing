import mongoose from "mongoose";

const historiasClinicasSchema = mongoose.Schema({
    fecha: {
        type: Date,
        require: true
    },
    inicio_tratamiento: {
        type: Date,
        require: true
    },
    fin_tratamiento: {
        type: Date,
        require: true 
    },
    domicilio: {
        type: String,
        require: true 
    },
    telefono: {
        type: String,
        require: true
    },
    ocupacion: {
        type: String,
        require: true
    },
    edad: {
        type: String,
        require: true
    },
    sexo: {
        type: String,
        require: true
    },
    bajo_tratamiento: {
        si: {
            type: Boolean
        },
        no: {
            type: Boolean
        }
    }
})

export default mongoose.model('historiasClinica', historiasClinicasSchema);