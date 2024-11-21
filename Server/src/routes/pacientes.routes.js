import {Router} from "express";
import {getPacientes, getPaciente, postPacientes, putPacientes, deletePacientes, countPacientes} from "../controllers/pacientes.controllers.js";
import authenticateToken from "../middleware/authenticateToken.js";

const route = Router();

route.use(authenticateToken);

route.get("/count", countPacientes)
route.get("/", getPacientes);
route.get("/:id", getPaciente);
route.post("/", postPacientes);
route.put("/:id", putPacientes);
route.delete("/:id", deletePacientes);

export default route;