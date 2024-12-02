import historiasClinica from "../models/historiasClinicas.model.js";
import nodemailer from "nodemailer";

const userGmail = process.env.USER_GMAIL;
const passAppGmail = process.env.PASS_APP_GMAIL;

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: userGmail,
        pass: passAppGmail,
    },
});

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

export const putLinkHistoriaClinica = async (req, res) => {
    try {
        const historiaClinica = await historiasClinica.findOneAndUpdate(
            { paciente: req.params.id },
            { $set: { downloadLink: req.body.downloadLink } },
            { new: true }
        );

        try {
            transporter.sendMail({
                from: 'Dental Care <no-reply@dentalcare.com>',
                to: req.body.email,
                subject: `Historial Clinico`,
                html: `
                    <div style="padding: 20px; font-family: Arial, sans-serif;">
                        <h2>Dental Care</h2>
                        <h1>Historial Clinico</h1>
                        <p>Aqui esta tu historial clinico, lo puedes ver en el siguiente enlace</p>
                        <h1>${req.body.downloadLink}</h1>
                    </div>
                `,
            });
        } catch (error) {
            console.error("Error al enviar el historial clinico:", error);
            return res.status(500).json({ error: "Error al enviar el historial clinico." });
        }

        res.json({ "message": "Realizado correctamente" });

    } catch (error) {
        console.log(error);

    }
}