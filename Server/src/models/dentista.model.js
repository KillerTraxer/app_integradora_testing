import mongoose from "mongoose";

const dentistaSchema = mongoose.Schema({
    nombre: {
        type: String,
        require: true,
        trim: true
    },
    apellido: {
        type: String,
        require: true,
        trim: true 
    },
    email: {
        type: String,
        require: true,
        trim: true 
    },
    password: {
        type: String,
        require: true,
        trim: true 
    }
},{
    timestamps: true
})

export default mongoose.model('Dentista', dentistaSchema);