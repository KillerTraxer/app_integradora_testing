import Router from "express";
import {getTratamientos, getTratamiento, postTratamiento, putTratamiento, deleteTratamiento, getTratamientosByPaciente} from "../controllers/tratamientos.controllers.js";

const router = Router();

router.get("/", getTratamientos);

router.get("/:id", getTratamiento);

router.get("/paciente/:id", getTratamientosByPaciente);

router.post("/", postTratamiento);

router.put("/:id", putTratamiento);

router.delete("/:id", deleteTratamiento);

export default router;