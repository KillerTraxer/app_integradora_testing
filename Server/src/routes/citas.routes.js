import Router from "express";
import {getCitas, getCita, postCita, putCita, deleteCita} from "../controllers/citas.controllers.js";

const router = Router();

router.get("/", getCitas);

router.get("/:id", getCita);

router.post("/", postCita);

router.put("/:id", putCita);

router.delete("/:id", deleteCita);


export default router;