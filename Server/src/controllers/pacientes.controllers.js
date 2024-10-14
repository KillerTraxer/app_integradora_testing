import {pool} from "../db.js";

export const getPacientes = async (req, res) => {
    try {
        const [pacientesEncontrados] = await pool.query("select * from pacientes");
        res.json(pacientesEncontrados);
        if(!pacientesEncontrados) return res.json({"message": "No hay pacientes registrados"});

    } catch (error) {
        console.log(error);
    }
}

export const getPaciente = async (req, res) => {
    try {
        const id = req.params.id;
        const [pacienteEncontrado] = await pool.query("select * from pacientes where id = ?", id);
        res.json(pacienteEncontrado);
        if(!pacienteEncontrado) return res.json({"message": "Paciente no encontrado"});

    } catch (error) {
        console.log(error);
    }
}

export const postPacientes =  async (req, res) => {
    try {
        const {id, nombre, apellido, telefono, email, password, id_dentista} = req.body;
        await pool.query("insert into pacientes(id, nombre, apellido, telefono, email, password, id_dentista) values(?, ?, ?, ?, ?, ?, ?)", [id, nombre, apellido, telefono, email, password, id_dentista]);
        res.json({"message": "Agregado con exito"});


    } catch (error) {
        console.log(error);

    }
}

export const putPacientes = (req, res) => {

}

export const deletePacientes = (req, res) => {

}