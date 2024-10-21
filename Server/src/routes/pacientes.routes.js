import {Router} from "express";
import {getPacientes, getPaciente, postPacientes, putPacientes, deletePacientes} from "../controllers/pacientes.controllers.js";

const route = Router();

route.get("/pacientes", getPacientes);

route.get("/pacientes/:id", getPaciente);

route.post("/pacientes", postPacientes);

route.put("/pacientes/:id", putPacientes);

route.delete("/pacientes/:id", deletePacientes);

export default route;