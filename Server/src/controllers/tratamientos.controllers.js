import Tratamiento from "../models/tratamientos.model.js";

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
        res.json(tratamiento);

    } catch(error) {

    }
}

export const postTratamiento = async (req, res) => {
    try {
        const {nombre, descripcion, costo} = req.body;
        const newTratamiento = new Tratamiento({
            nombre,
            descripcion, 
            costo
        });
        await newTratamiento.save();
        res.json({"message": "Realizado con exito"})

    } catch(error) {
        console.log(error);
    }

}

export const putTratamiento = async (req, res) => {
    try {
        const tratamiento = await Tratamiento.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });

        if(tratamiento == null) return res.json({"message":"No encontrado"});

        res.json({"message": "Realizado correctamente"});
    } catch (error) {
        console.log(error);
    }

}

export const deleteTratamiento = async (req, res) => {
    try {
        const tratamiento = await Tratamiento.findByIdAndDelete(req.params.id);
        res.json({"message": "Realizado correctamente"});
    } catch (error) {
        console.log(error);
    }

}