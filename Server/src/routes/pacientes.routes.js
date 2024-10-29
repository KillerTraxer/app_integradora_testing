import {Router} from "express";
import {getPacientes, getPaciente, postPacientes, putPacientes, deletePacientes} from "../controllers/pacientes.controllers.js";

const route = Router();

route.get("/", getPacientes);

route.get("/:id", getPaciente);

route.post("/", postPacientes);

route.put("/:id", putPacientes);

route.delete("/:id", deletePacientes);

export default route;