import Citas from "../models/citas.model.js";

export const getCitas = async (req, res) => {
    try {
        const citas = await Citas.find();
        res.json(citas);

        if (!citas) return res.json({ "message": "No hay citas" });

    } catch (error) {
        console.log(error);
    }
}

export const getCita = async (req, res) => {
    try {
        const cita = await Citas.findById(req.params.id);
        res.json(cita);

        if (!cita) return res.json({ "message": "No existe la cita" });

    } catch (error) {
        console.log(error);
    }
}

export const postCita = async (req, res) => {
    try {
        const { asunto, fecha, descripcion } = req.body;
        const newCita = new Citas({
            asunto,
            fecha,
            descripcion
        });

        await newCita.save();
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

        res.json({ "message": "Realizado con exito" });

        if (!cita) return res.json({ "message": "No existe la cita" });


    } catch (error) {
        console.log(error);
    }
}

export const deleteCita = async (req, res) => {
    try {
        const cita = await Citas.findByIdAndDelete(req.params.id, req.body, {
            new: true
        })

        res.json({ "message": "Realizado con exito" });
        if (!cita) return res.json({ "message": "No existe esa cita" });

    } catch (error) {
        console.log(error);
    }
}

export const postCitaPublic = async (req, res) => {
    try {
        const citas = await Citas.find();
        res.json(citas);

        if (!citas) return res.json({ "message": "No hay citas" });

    } catch (error) {
        console.log(error);
    }
};