import Router from "express";
import {getTratamientos, getTratamiento, postTratamiento, putTratamiento, deleteTratamiento} from "../controllers/tratamientos.controllers.js";

const router = Router();

router.get("/tratamientos", getTratamientos);

router.get("/tratamientos/:id", getTratamiento);

router.post("/tratamientos", postTratamiento);

router.put("/tratamientos/:id", putTratamiento);

router.delete("/tratamientos/:id", deleteTratamiento);

export default router;