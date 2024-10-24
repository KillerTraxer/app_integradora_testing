import mongoose from "mongoose";

const tramientosSchema = mongoose.Schema({
    nombre: {
        type: String,
        require: true,
        trim: true
    },
    descripcion: {
        type: String, 
        require: true,
        trim: true
    },
    costo: {
        type: String,
        require: true,
        trim: true
    }
}, {
    timestamps: true
})

export default mongoose.model('Tratamiento', tramientosSchema);