import Tratamiento from "../models/tratamientos.model.js";
import historiasClinica from "../models/historiasClinicas.model.js";
import Paciente from "../models/pacientes.model.js";
import Citas from "../models/citas.model.js";
import mongoose from "mongoose";

export const getTratamientos = async (req, res) => {
    try {
        const tratamientos = await Tratamiento.find();
        res.json(tratamientos);

    } catch (error) {
        console.log(error);
    }
}

export const getTratamiento = async (req, res) => {
    try {
        const tratamiento = await Tratamiento.findById(req.params.id);

        if (!tratamiento) return res.json({ "message": "Tratamiento no encontrado" });

        res.json(tratamiento);

    } catch (error) {

    }
}

export const getTratamientosByPaciente = async (req, res) => {
    try {
        const pacienteId = req.params.id;
        const tratamientos = await Tratamiento.find({ paciente: pacienteId });

        if (!tratamientos) return res.json({ "message": "No se encontraron tratamientos para el paciente" });

        res.json(tratamientos);

    } catch (error) {
        // Manejar el error
    }
}

export const postTratamiento = async (req, res) => {
    try {
        const { paciente, dentista, tratamientos, citas } = req.body;

        if (!dentista || !paciente) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        let tratamientoIds = [];

        for (const tratamientoFormateado of tratamientos) {
            const nuevoTratamiento = new Tratamiento({
                paciente: paciente,
                dentista: dentista,
                general: tratamientoFormateado.general,
                fases: tratamientoFormateado.fases.map(fase => ({
                    id: fase.id,
                    contenido: fase.contenido
                })),
                configuracion: {
                    duracion: {
                        valor: tratamientoFormateado.configuracion.duracion.valor,
                        unidad: tratamientoFormateado.configuracion.duracion.unidad
                    },
                    horaPreferida: tratamientoFormateado.configuracion.horaPreferida,
                    frecuencia: tratamientoFormateado.configuracion.frecuencia
                }
            });

            // Guardar el tratamiento en la base de datos
            const savedTratamiento = await nuevoTratamiento.save();
            tratamientoIds.push(savedTratamiento._id);

            for (const cita of citas) {
                const tratamientoCitaId = cita.tratamientoCita.toString(16);
                const tratamientoCitaIdPadded = tratamientoCitaId.padStart(24, '0');

                const nuevaCita = new Citas({
                    paciente: paciente,
                    dentista: dentista,
                    fecha: cita.fecha,
                    status: cita.status,
                    tratamientoCita: new mongoose.Types.ObjectId(tratamientoCitaIdPadded),
                    motivo: cita.motivo,
                    colorCita: cita.colorCita
                });

                await nuevaCita.save();
            }

            // Buscar el historial clínico del paciente
            const historiaClinica = await historiasClinica.findOne({ paciente: paciente }).exec();

            if (historiaClinica) {
                // Actualizar el campo treatments con los nuevos IDs de tratamientos
                historiaClinica.treatments = [...(historiaClinica.treatments || []), ...tratamientoIds];
                await historiaClinica.save();
            } else {
                console.log(`No se encontró un historial clínico para el paciente ${paciente}`);
            }
        }

        // Actualizar el status del paciente a "con tratamientos"
        const pacienteActualizado = await Paciente.findByIdAndUpdate(paciente, { status: "en tratamiento" }, { new: true });
        if (!pacienteActualizado) {
            console.log(`No se encontró el paciente ${paciente}`);
        }

        res.json({ "message": "Realizado con exito" })

    } catch (error) {
        console.log(error);
    }
}

export const putTratamiento = async (req, res) => {
    try {
        const tratamiento = await Tratamiento.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });

        if (!tratamiento) return res.json({ "message": "Tratamiento no encontrado" });

        res.json({ "message": "Realizado correctamente" });
    } catch (error) {
        console.log(error);
    }

}

export const deleteTratamiento = async (req, res) => {
    try {
        const tratamiento = await Tratamiento.findByIdAndDelete(req.params.id);

        if (!tratamiento) return res.json({ "message": "Tratamiento no encontrado" });

        res.json({ "message": "Realizado correctamente" });
    } catch (error) {
        console.log(error);
    }

}