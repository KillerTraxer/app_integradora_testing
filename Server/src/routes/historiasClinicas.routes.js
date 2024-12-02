import Router from "express";
import {getHistoriasClinicas, getHistoriaClinica, postHistoriaClinica, putHistoriaClinica, deleteHistoriaClinica, getHistoriaClinicaByPaciente, putLinkHistoriaClinica} from "../controllers/historiasClinicas.controllers.js"

const router = Router();

router.get("/", getHistoriasClinicas);

router.get("/:id", getHistoriaClinica);

router.get("/paciente/:idPaciente", getHistoriaClinicaByPaciente);

router.post("/", postHistoriaClinica);

router.post("/setLink/:id", putLinkHistoriaClinica);

router.put("/:id", putHistoriaClinica);

router.delete("/:id", deleteHistoriaClinica);

export default router;