import Router from "express";
import {getCitas, getCita, getCitasByPaciente, postCita, putCita, deleteCita, countCitas, changeStatusCita, patchCita, terminarCita} from "../controllers/citas.controllers.js";
import authenticateToken from "../middleware/authenticateToken.js";

const router = Router();

//Rutas protegidas por token
router.use(authenticateToken);

router.get("/count", countCitas)
router.get("/", getCitas);
router.get("/:id", getCita);
router.get("/paciente/:pacienteId", getCitasByPaciente);
router.post("/:pacienteId", postCita);
router.put("/:id", putCita);
router.delete("/:id", deleteCita);
router.patch('/:id', changeStatusCita);
router.patch('/update/:id', patchCita);
router.patch('/terminar/:id', terminarCita);

export default router;