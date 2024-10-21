import Paciente from "../models/pacientes.model.js";

export const getPacientes = async (req, res) => {
    try {
        const pacientes = await Paciente.find();
        res.json(pacientes);

        if(!pacientes) return res.json({"mensaje": "No hay pacientes"});

    } catch (error) {
        console.log(error);
    }
}

export const getPaciente = async (req, res) => {
    try {
        const paciente = await Paciente.findById(req.params.id);
        res.json(paciente);
        if(!paciente) return res.json({"message": "El usuario no existe"});

    } catch (error) {
        console.log(error);
    }
}

export const postPacientes =  async (req, res) => {
    try {
        const {nombre, apellido, telefono, email, password} = req.body;
        const newPaciente = new Paciente({
            nombre, 
            apellido,
            telefono,
            email,
            password
        })

        await newPaciente.save();
        res.json({"message": "Realizado con exito"})

    } catch (error) {
        console.log(error);

    }
}

export const putPacientes = async (req, res) => {
    try {
        const paciente = await Paciente.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        res.json({mensaje:"Información del usuario actualizada"});

        if(!comentarios) return res.json({mensaje:"No existe el usuario"})

    } catch (error) {
        console.log(error);

    }
    

}

export const deletePacientes = async  (req, res) => {
    try {
        

    } catch (error) {
        console.log(error);

    }

}