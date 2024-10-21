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
    }

}, {
    timestamps: true
});

export default mongoose.model('Citas', citasSchema);