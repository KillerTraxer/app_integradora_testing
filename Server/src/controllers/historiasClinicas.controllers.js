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
        const {fecha, inicio_tratamiento, fin_tratamiento, nombre_paciente, domicilio, telefono, ocupacion, edad, sexo, bajo_tratamiento, si, no, color, motivo_consulta, revision, lesion_catres,odontoxsesis, puente, prostodoncia, extraccion, habitos, bricomania, contracciones_musculares,mordida, respiracion_bucal, chupadores_de, labios, lengua, dedos, higiene_bucal,alergias, alimentacion, examen_tejidos, oclusion, esmalte, dentina, raiz, huesos, oclusion_2, encia,epitelial, pulpa, velo_paladar, carrillos, insercion, oclusion_3, sobre_mordida_vertical,mordida_abierta, desgaste, intercuspideo, desmayos, vertigos, anoclusion, mareos, otros,meses_embarazo, enfermedades, aparato_cardiovascular, sistema_nervioso,aparato_respiratorio,propension_hemorragica, pruebas_lab, estudio_radiologico, renal, digestivo, diabetes, artritis,estado_gral, observaciones, dentincion_permanente, temporal} = req.body;

        const newHistoriaClinica = new historiasClinica({
            fecha,
            inicio_tratamiento,
            fin_tratamiento,
            nombre_paciente,
            domicilio,
            telefono,
            ocupacion,
            edad,
            sexo,
            bajo_tratamiento,
            si,
            no,
            color,
            motivo_consulta,
            revision,
            lesion_catres,
            odontoxsesis,
            puente,
            prostodoncia,
            extraccion,
            habitos,
            bricomania,
            contracciones_musculares,
            mordida,
            respiracion_bucal,
            chupadores_de,
            labios,
            lengua,
            dedos,
            higiene_bucal,
            alergias,
            alimentacion,
            examen_tejidos,
            oclusion,
            esmalte,
            dentina,
            raiz,
            huesos,
            oclusion_2,
            encia,
            epitelial,
            pulpa,
            velo_paladar,
            carrillos,
            insercion,
            oclusion_3,
            sobre_mordida_vertical,
            mordida_abierta,
            desgaste,
            intercuspideo,
            desmayos,
            vertigos,
            anoclusion,
            mareos,
            otros,
            meses_embarazo,
            enfermedades,
            aparato_cardiovascular,
            sistema_nervioso,
            aparato_respiratorio,
            propension_hemorragica,
            pruebas_lab,
            estudio_radiologico,
            renal,
            digestivo,
            diabetes,
            artritis,
            estado_gral,
            observaciones,
            dentincion_permanente,
            temporal
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