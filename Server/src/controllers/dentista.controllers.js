import Dentista from "../models/dentista.model.js";

export const getDentistas = async (req, res) => {
    try {
        const dentistas = await Dentista.find();
        res.json(dentistas);

        if(!dentistas) return res.json({"message": "No hay dentistas"});

    } catch (error) {
        console.log(error);

    }
}

export const getDentista = async (req, res) => {
    try {
        const dentista = await Dentista.findById(req.params.id);
        res.json(dentista);

        if(!dentista) return res.json({"message": "Dentista no encontrado"});

    } catch (error) {
        console.log(error);

    }
}

export const postDentista = async (req, res) => {
    try {
        const {nombre, apellido, email, password} = req.body;
        const newDentista = new Dentista({
            nombre,
            apellido,
            email,
            password
        });

        await newDentista.save();
        res.json({"message": "Registrado exitosamente"});

    } catch (error) {
        console.log(error);

    }
}

export const putDentista = async (req, res) => {
    try {
        const dentista = await Dentista.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        })

        res.json({"message": "Realizado con exito"});

        if(!dentista) return res.json({"message": "No existe el dentista"});


    } catch (error) {
        console.log(error);
    }
}

export const deleteDentista = async (req, res) => {
    try {
        const dentista = await Dentista.findByIdAndDelete(req.params.id, req.body, {
            new: true
        })

        res.json({"message": "Realizado con exito"});
        if(!dentista) return res.json({"message": "No existe el dentista"});

    } catch (error) {
        console.log(error);
    }
}