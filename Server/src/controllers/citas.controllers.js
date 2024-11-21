import Citas from "../models/citas.model.js";
import firebaseAdmin from "../firebase.js";
import dayjs from "dayjs"
import { ObjectId } from "mongodb"

const { firestore, admin } = firebaseAdmin;

export async function countCitas(req, res) {
    try {
        const total = await Citas.countDocuments().exec(); // Contar el número de citas
        res.json({ total });
    } catch (error) {
        console.log(error);
    }
}

export const getCitas = async (req, res) => {
    try {
        const citas = await Citas.find();
        if (!citas) return res.json({ "message": "No hay citas" });

        res.json(citas);
    } catch (error) {
        console.log(error);
    }
}

export const getCita = async (req, res) => {
    try {
        const cita = await Citas.findById(req.params.id);

        if (!cita) return res.json({ "message": "No existe la cita" });

        res.json(cita);
    } catch (error) {
        console.log(error);
    }
}

export const getCitasByPaciente = async (req, res) => {
    try {
        const pacienteId = req.params.pacienteId;
        const citas = await Citas.find({ paciente: pacienteId });

        if (!citas) return res.json({ "message": "No hay citas" });

        res.json(citas);
    } catch (error) {
        console.log(error);
    }
}

export const postCita = async (req, res) => {
    try {
        const { pacienteId } = req.params;
        const { dentistaId, fecha, motivo, status, colorCita } = req.body;

        const cita = { paciente: pacienteId, dentista: dentistaId, fecha, motivo, status, colorCita };

        const newCita = new Citas(cita);

        await newCita.save();

        const citaId = newCita._id.toString();

        const pacienteRef = firestore.collection('pacientes').doc(pacienteId);
        const pacienteDoc = await pacienteRef.get();

        const pacienteNombre = pacienteDoc.data().nombre;

        const dentistaRef = firestore.collection('dentistas').doc(dentistaId);
        const dentistaDoc = await dentistaRef.get();

        const fcmToken = dentistaDoc.data().fcmToken;

        const fechaFormateada = dayjs(fecha).locale('es').format('D [de] MMMM [del] YYYY [a las] h:mm A');

        const message = {
            notification: {
                title: "Nueva cita",
                body: `Se ha agendado una nueva cita para el día ${fechaFormateada}`,
            },
            token: fcmToken,
        };

        const notification = {
            title: "Nueva cita",
            content: `ha agendado una nueva cita para el día ${fechaFormateada}`,
            date: new Date(),
            status: "new",
            cita: citaId,
            usuario: dentistaId,
            nombre: pacienteNombre,
        }

        await firestore.collection("notificaciones").add(notification);

        admin.messaging().send(message)
            .then((response) => {
                console.log('Successfully sent message:', response);
            })
            .catch((error) => {
                console.log('Error sending message:', error);
            });

        res.json({ "message": "Realizado con exito" });
    } catch (error) {
        console.log(error);
    }
}

export const putCita = async (req, res) => {
    try {
        const cita = await Citas.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        })

        if (!cita) return res.json({ "message": "No existe la cita" });

        res.json({ "message": "Realizado con exito" });
    } catch (error) {
        console.log(error);
    }
}

export const deleteCita = async (req, res) => {
    try {
        const cita = await Citas.findByIdAndDelete(req.params.id, req.body, {
            new: true
        })
        if (!cita) return res.json({ "message": "No existe esa cita" });
        
        res.json({ "message": "Realizado con exito" });
    } catch (error) {
        console.log(error);
    }
}