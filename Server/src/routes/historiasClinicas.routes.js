import Router from "express";
import {getHistoriasClinicas, getHistoriaClinica, postHistoriaClinica, putHistoriaClinica, deleteHistoriaClinica} from "../controllers/historiasClinicas.controllers.js"

const router = Router();

router.get("/historiasClinicas", getHistoriasClinicas);

router.get("/historiasClinicas/:id", getHistoriaClinica);

router.post("/historiasClinicas", postHistoriaClinica);

router.put("/historiasClinicas/:id", putHistoriaClinica);

router.delete("/historiasClinicas/:id", deleteHistoriaClinica);

export default router;