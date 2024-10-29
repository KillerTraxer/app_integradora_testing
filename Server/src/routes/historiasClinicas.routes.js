import Router from "express";
import {getHistoriasClinicas, getHistoriaClinica, postHistoriaClinica, putHistoriaClinica, deleteHistoriaClinica} from "../controllers/historiasClinicas.controllers.js"

const router = Router();

router.get("/", getHistoriasClinicas);

router.get("/:id", getHistoriaClinica);

router.post("/", postHistoriaClinica);

router.put("/:id", putHistoriaClinica);

router.delete("/:id", deleteHistoriaClinica);

export default router;