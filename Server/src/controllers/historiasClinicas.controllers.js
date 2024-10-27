import historiasClinica from "../models/historiasClinicas.model.js";

export const getHistoriasClinicas = async (req, res) => {
    try {
        const historiasClinicas = await historiasClinica.find();
        res.json(historiasClinicas);

    } catch(error) {
        console.log(error);

    }
}

export const getHistoriaClinica = async (req, res) => {
    try {
        const historiaClinica = await historiasClinica.findById(req.params.id);
        res.json(historiaClinica);

        // if(historiaClinica == null) return res.json({"message": "Historial clinico no encontrado"});
    } catch (error) {
        console.log(error);
    }

}

export const postHistoriaClinica = async (req, res) => {
    try {
        const {fecha, inicio_tratamiento, fin_tratamiento, domicilio, telefono, ocupacion, edad, sexo, bajo_tratamiento, si, no} = req.body;

        const newHistoriaClinica = new historiasClinica({
            fecha,
            inicio_tratamiento,
            fin_tratamiento,
            domicilio,
            telefono,
            ocupacion,
            edad,
            sexo,
            bajo_tratamiento,
            si,
            no
        })

        await newHistoriaClinica.save();
        res.json({"message": "Realizado con exito"});
        
    } catch (error) {
        console.log(error);
    }

}

export const putHistoriaClinica = async (req, res) => {
    try {
        const historiaClinica = await historiasClinica.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });

        res.json({"message": "Realizado correctamente"});

    } catch(error) {
        console.log(error);

    }

}

export const deleteHistoriaClinica = async (req, res) => {
    try {
        const deleteHistoriaClinica = await historiasClinica.findByIdAndDelete(req.params.id);
        res.json({"message": "realizado correctamente"});

    } catch(error) {
        console.log(error);

    }

}