import Paciente from "../models/pacientes.model.js";
import firebaseAdmin from "../firebase.js";

const { firestore } = firebaseAdmin;

export async function countPacientes(req, res) {
    try {
        const total = await Paciente.countDocuments().exec();
        res.json({ total });
    } catch (error) {
        console.log(error);
    }
}

export const getPacientes = async (req, res) => {
    try {
        const pacientes = await Paciente.find();

        if (!pacientes) return res.json({ "mensaje": "No hay pacientes" });

        res.json(pacientes);
    } catch (error) {
        console.log(error);
    }
}

export const getPaciente = async (req, res) => {
    try {
        const paciente = await Paciente.findById(req.params.id);
        if (!paciente) return res.json({ "message": "El usuario no existe" });

        res.json(paciente);
    } catch (error) {
        console.log(error);
    }
}

export const postPacientes = async (req, res) => {
    try {
        const { nombre, apellidos, telefono, email, password } = req.body;
        const newPaciente = new Paciente({
            nombre,
            apellidos,
            telefono,
            email,
            password
        })

        await newPaciente.save();

        const pacienteId = newPaciente._id;

        console.log(firestore);

        const pacienteRef = firestore.collection('pacientes').doc(pacienteId);
        await pacienteRef.set({
            nombre,
            apellido,
            telefono,
            email,
        });

        res.json({ "message": "Realizado con exito" })

    } catch (error) {
        console.log(error);

    }
}

export const putPacientes = async (req, res) => {
    try {
        const paciente = await Paciente.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        if (!paciente) return res.json({ mensaje: "No existe el usuario" })

        res.json({ mensaje: "Información del usuario actualizada" });
    } catch (error) {
        console.log(error);

    }
}

export const deletePacientes = async (req, res) => {
    try {
        const paciente = await Paciente.findByIdAndDelete(req.params.id);
        if (!paciente) return res.json({ "message": "Usuario no encontrado" });

        res.json({ "message": "Usuario eliminado" });
    } catch (error) {
        console.log(error);

    }
}