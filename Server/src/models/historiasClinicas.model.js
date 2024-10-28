import mongoose from "mongoose";

const historiasClinicasSchema = mongoose.Schema({
    fecha: {
        type: Date,
        require: true
    },
    inicio_tratamiento: {
        type: Date,
        require: true
    },
    fin_tratamiento: {
        type: Date,
        require: true 
    },
    nombre_paciente: {
        type: String,
        require: true
    },
    domicilio: {
        type: String,
        require: true 
    },
    telefono: {
        type: String,
        require: true
    },
    ocupacion: {
        type: String,
        require: true
    },
    edad: {
        type: String,
        require: true
    },
    sexo: {
        type: String,
        require: true
    },
    bajo_tratamiento: {
        si: {
            type: Boolean
        },
        no: {
            type: Boolean
        }
    },
    color: {
        type: String,
        require: true
    },
    motivo_consulta: {
        emergencia: {
            type: Boolean,
            require: true 
        },
        revision: {
            type: Boolean,
            require: true 
        },
        lesion_catres: {
            type: Boolean,
            require: true
        },
        odontoxsesis: {
            type: Boolean,
            require: true 
        },
        puente: {
            type: Boolean,
            require: true 
        },
        prostodoncia: {
            type: Boolean,
            require: true  
        },
        extraccion: {
            type: Boolean,
            require: true
        }
    },
    habitos: {
        bricomania: {
            type: Boolean,
            require: true 
        },
        contracciones_musculares: {
            type: Boolean,
            require: true 
        },
        mordida: {
            type: Boolean,
            require: true 
        },
        respiracion_bucal: {
            type: Boolean,
            require: true 
        },
    },
    chupadores_de: {
        labios: {
            type: Boolean,
            require: true 
        },
        lengua :{
            type: Boolean,
            require: true
        },
        dedos: {
            type: Boolean,
            require: true
        }
    },
    higiene_bucal: {
        type: String,
        require: true 
    },
    alergias: {
        type: String,
        require: true 
    },
    alimentacion: {
        type: String,
        require: true 
    },
    examen_tejidos: {
        oclusion: {
            esmalte: {
                type: Boolean,
                require: true
            },
            dentina: {
                type: Boolean,
                require: true
            },
            raiz: {
                type: Boolean,
                require: true
            },
            huesos: {
                type: Boolean,
                require: true
            }
        },
        oclusion: {
            encia: {
                type: Boolean,
                require: true
            },
            epitelial: {
                type: Boolean,
                require: true
            },
            pulpa: {
                type: Boolean,
                require: true
            },
            velo_paladar: {
                type: Boolean,
                require: true
            },
            carrillos: {
                type: Boolean,
                require: true
            },
            insercion: {
                type: Boolean,
                require: true
            }
        },
        oclusion: {
            sobre_mordida_vertical: {
                type: Boolean,
                require: true
            },
            mordida_abierta: {
                type: Boolean,
                require: true
            },
            desgaste: {
                type: Boolean,
                require: true
            },
            intercuspideo: {
                type: Boolean,
                require: true
            },
            desmayos: {
                type: Boolean,
                require: true
            },
            vertigos: {
                type: Boolean,
                require: true
            },
            anoclusion: {
                type: Boolean,
                require: true
            },
            mareos: {
                type: Boolean,
                require: true
            },
            otros: {
                type: Boolean,
                require: true
            },
            meses_embarazo: {
                type: String,
                require: true  
            }
        }
    },
    enfermedades: {
        aparato_cardiovascular: {
            type: Boolean,
            require: true
        },
        sistema_nervioso: {
            type: Boolean,
            require: true
        },
        aparato_respiratorio: {
            type: Boolean,
            require: true
        },
        propension_hemorragica: {
            type: Boolean,
            require: true
        },
        pruebas_lab: {
            type: Boolean,
            require: true
        },
        estudio_radiologico: {
            type: Boolean,
            require: true
        },
        renal: {
            type: Boolean,
            require: true
        },
        digestivo: {
            type: Boolean,
            require: true
        },
        diabetes: {
            type: Boolean,
            require: true
        },
        artritis: {
            type: Boolean,
            require: true
        },
        estado_gral: {
            type: String,
            require: true
        }
    },
    observaciones: {
        type: String,
        require: true
    },
    dentincion_permanente: {
        type: Boolean,
        require: true
    },
    temporal: {
        type: Boolean,
        require: true
    }
})

export default mongoose.model('historiasClinica', historiasClinicasSchema);