import historiasClinica from "../models/historiasClinicas.model.js";

export const getHistoriasClinicas = async (req, res) => {
    try {
        const historiasClinicas = await historiasClinica.find();
        res.json(historiasClinicas);

    } catch (error) {
        console.log(error);

    }
}

export const getHistoriaClinica = async (req, res) => {
    try {
        const historiaClinica = await historiasClinica.findById(req.params.id);
        if (historiaClinica == null) return res.json({ "message": "Historial clinico no encontrado" });

        res.json(historiaClinica);
    } catch (error) {
        console.log(error);
    }
}

export const getHistoriaClinicaByPaciente = async (req, res) => {
    try {
        console.log(req.params.idPaciente);
        const historiaClinica = await historiasClinica.findOne({ paciente: req.params.idPaciente }).lean();
        if (historiaClinica === null) {
            res.json(null);
        } else {
            res.json(historiaClinica);
        }
    } catch (error) {
        console.log(error);
    }
}

export const postHistoriaClinica = async (req, res) => {
    try {
        const {
            paciente,
            nombreCompleto,
            edad,
            genero,
            fechaNacimiento,
            direccion,
            localidad,
            ocupacion,
            phone,
            email,
            diagnostico,
            diseases,
            otherDiseases,
            odontogram,
            extraOralExam
        } = req.body;

        const newHistoriaClinica = new historiasClinica({
            paciente,
            nombreCompleto,
            edad,
            genero,
            fechaNacimiento,
            direccion,
            localidad,
            ocupacion,
            phone,
            email,
            diagnostico,
            diseases: diseases || {}, // Si no se envía, usa un objeto vacío
            otherDiseases: otherDiseases || "",
            odontogram: odontogram || [], // Si no se envía, usa un array vacío
            extraOralExam: extraOralExam || {} // Si no se envía, usa un objeto vacío
        })

        await newHistoriaClinica.save();
        res.json({ "message": "Realizado con exito" });

    } catch (error) {
        console.log(error);
    }

}

export const putHistoriaClinica = async (req, res) => {
    try {
        const historiaClinica = await historiasClinica.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });

        res.json({ "message": "Realizado correctamente" });

    } catch (error) {
        console.log(error);

    }

}

export const deleteHistoriaClinica = async (req, res) => {
    try {
        const deleteHistoriaClinica = await historiasClinica.findByIdAndDelete(req.params.id);
        res.json({ "message": "realizado correctamente" });

    } catch (error) {
        console.log(error);

    }

}