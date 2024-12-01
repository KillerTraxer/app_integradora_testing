import Router from "express";
import {getHistoriasClinicas, getHistoriaClinica, postHistoriaClinica, putHistoriaClinica, deleteHistoriaClinica, getHistoriaClinicaByPaciente} from "../controllers/historiasClinicas.controllers.js"

const router = Router();

router.get("/", getHistoriasClinicas);

router.get("/:id", getHistoriaClinica);

router.get("/paciente/:idPaciente", getHistoriaClinicaByPaciente);

router.post("/", postHistoriaClinica);

router.put("/:id", putHistoriaClinica);

router.delete("/:id", deleteHistoriaClinica);

export default router;