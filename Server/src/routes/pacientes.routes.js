import {Router} from "express";
import {getPacientes, getPaciente, postPacientes} from "../controllers/pacientes.controllers.js";

const route = Router();

route.get("/pacientes", getPacientes);

route.get("/pacientes/:id", getPaciente);

route.post("/pacientes", postPacientes);

route.put("/pacientes/:id");

route.delete("/pacientes/:id");

export default route;