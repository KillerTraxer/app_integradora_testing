import Citas from "../models/citas.model.js";
import firebaseAdmin from "../firebase.js";
import dayjs from "dayjs"
import { ObjectId } from "mongodb"

const { firestore, admin } = firebaseAdmin;

export async function countCitas(req, res) {
    try {
        const total = await Citas.countDocuments().exec();
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

        const fcmTokens = dentistaDoc.get('fcmTokens') || [];

        const fechaFormateada = dayjs(fecha).locale('es').format('D [de] MMMM [del] YYYY [a las] h:mm A');

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

        if (fcmTokens.length > 0) {
            fcmTokens.forEach((token) => {
                const message = {
                    notification: {
                        title: "Nueva cita",
                        body: `Se ha agendado una nueva cita para el día ${fechaFormateada}`,
                    },
                    token: token,
                };

                admin.messaging().send(message)
                    .then((response) => {
                        console.log('Successfully sent message:', response);
                    })
                    .catch((error) => {
                        console.log('Error sending message:', error);
                    });
            })
        }

        res.json({ "message": "Realizado con éxito" });
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

export const patchCita = async (req, res) => {
    try {
        const cita = await Citas.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        })

        if (!cita) return res.json({ "message": "No existe la cita" });

        const pacienteId = cita.paciente.toString();
        const dentistaId = cita.dentista.toString();

        const pacienteRef = firestore.collection('pacientes').doc(pacienteId);
        const pacienteDoc = await pacienteRef.get();
        const pacienteTokens = pacienteDoc.get('fcmTokens') || [];

        const dentistaRef = firestore.collection('dentistas').doc(dentistaId);
        const dentistaDoc = await dentistaRef.get();
        const dentistaTokens = dentistaDoc.get('fcmTokens') || [];

        if (req.body.cambiadaPor === 'dentista') {
            // Envía la notificación al paciente
            if (pacienteTokens.length > 0) {
                pacienteTokens.forEach((token) => {
                    console.log(token);
                    const message = {
                        notification: {
                            title: "Cita actualizada",
                            body: `La cita del día ${cita.fecha} ha sido actualizada`,
                        },
                        token: token,
                    };

                    admin.messaging().send(message)
                        .then((response) => {
                            console.log('Successfully sent message:', response);
                        })
                        .catch((error) => {
                            console.log('Error sending message:', error);
                        });
                });
            }

            const fechaFormateada = dayjs(req.body.fecha).locale('es').format('D [de] MMMM [del] YYYY [a las] h:mm A');

            // Guarda la notificación en la colección de notificaciones del paciente
            const notification = {
                title: "Cita actualizada",
                content: `ha actualizado la cita para el día ${fechaFormateada}`,
                date: new Date(),
                status: "new",
                cita: cita._id.toString(),
                usuario: pacienteId,
                nombre: dentistaDoc.get('nombre')
            };

            await firestore.collection("notificaciones").add(notification);
        } else if (req.body.cambiadaPor === 'paciente') {
            // Envía la notificación al dentista
            if (dentistaTokens.length > 0) {
                dentistaTokens.forEach((token) => {
                    const message = {
                        notification: {
                            title: "Cita actualizada",
                            body: `La cita del día ${cita.fecha} ha sido actualizada`,
                        },
                        token: token,
                    };

                    admin.messaging().send(message)
                        .then((response) => {
                            console.log('Successfully sent message:', response);
                        })
                        .catch((error) => {
                            console.log('Error sending message:', error);
                        });
                });
            }

            const fechaFormateada = dayjs(req.body.fecha).locale('es').format('D [de] MMMM [del] YYYY [a las] h:mm A');

            const notification = {
                title: "Cita actualizada",
                content: `ha actualizado la cita para el día ${fechaFormateada}`,
                date: new Date(),
                status: "new",
                cita: cita._id.toString(),
                usuario: dentistaId,
                nombre: pacienteDoc.get('nombre')
            };

            await firestore.collection("notificaciones").add(notification);
        }

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

export const changeStatusCita = async (req, res) => {
    try {
        const cita = await Citas.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });

        if (!cita) return res.json({ "message": "No existe la cita" });

        const pacienteId = cita.paciente.toString();
        const dentistaId = cita.dentista.toString();

        const pacienteRef = firestore.collection('pacientes').doc(pacienteId);
        const pacienteDoc = await pacienteRef.get();
        const pacienteTokens = pacienteDoc.get('fcmTokens') || [];

        const dentistaRef = firestore.collection('dentistas').doc(dentistaId);
        const dentistaDoc = await dentistaRef.get();
        const dentistaTokens = dentistaDoc.get('fcmTokens') || [];

        // Envía la notificación al paciente o dentista correspondiente
        if (req.body.status === 'cancelada') {
            if (req.body.canceladoPor === 'dentista') {
                // Envía la notificación al paciente
                if (pacienteTokens.length > 0) {
                    pacienteTokens.forEach((token) => {
                        console.log(token);
                        const message = {
                            notification: {
                                title: "Cita cancelada",
                                body: `La cita del día ${cita.fecha} ha sido cancelada`,
                            },
                            token: token,
                        };

                        admin.messaging().send(message)
                            .then((response) => {
                                console.log('Successfully sent message:', response);
                            })
                            .catch((error) => {
                                console.log('Error sending message:', error);
                            });
                    });
                }

                const fechaFormateada = dayjs(cita.fecha).locale('es').format('D [de] MMMM [del] YYYY [a las] h:mm A');

                // Guarda la notificación en la colección de notificaciones del paciente
                const notification = {
                    title: "Cita cancelada",
                    content: `ha cancelado una cita para el día ${fechaFormateada}`,
                    date: new Date(),
                    status: "new",
                    cita: cita._id.toString(),
                    usuario: pacienteId,
                    nombre: dentistaDoc.get('nombre')
                };

                await firestore.collection("notificaciones").add(notification);
            } else if (req.body.canceladoPor === 'paciente') {
                // Envía la notificación al dentista
                if (dentistaTokens.length > 0) {
                    dentistaTokens.forEach((token) => {
                        const message = {
                            notification: {
                                title: "Cita cancelada",
                                body: `La cita del día ${cita.fecha} ha sido cancelada`,
                            },
                            token: token,
                        };

                        admin.messaging().send(message)
                            .then((response) => {
                                console.log('Successfully sent message:', response);
                            })
                            .catch((error) => {
                                console.log('Error sending message:', error);
                            });
                    });
                }

                const fechaFormateada = dayjs(cita.fecha).locale('es').format('D [de] MMMM [del] YYYY [a las] h:mm A');

                const notification = {
                    title: "Cita cancelada",
                    content: `ha cancelado una cita para el día ${fechaFormateada}`,
                    date: new Date(),
                    status: "new",
                    cita: cita._id.toString(),
                    usuario: dentistaId,
                    nombre: pacienteDoc.get('nombre')
                };

                await firestore.collection("notificaciones").add(notification);
            }
        }

        res.json({ "message": "Realizado con exito" });
    } catch (error) {
        console.log(error);
    }
}

export const terminarCita = async (req, res) => {
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