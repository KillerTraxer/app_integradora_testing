import Router from "express";
import {getCitas, getCita, postCita, putCita, deleteCita} from "../controllers/citas.controllers.js";

const router = Router();

router.get("/citas", getCitas);

router.get("/citas/:id", getCita);

router.post("/citas", postCita);

router.put("/citas/:id", putCita);

router.delete("/citas/:id", deleteCita);


export default router;

