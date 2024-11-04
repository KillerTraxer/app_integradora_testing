import Router from "express";
import {getCitas, getCita, postCita, putCita, deleteCita, postCitaPublic} from "../controllers/citas.controllers.js";
import authenticateToken from "../middleware/authenticateToken.js";

const router = Router();

//Rutas protegidas por token
router.use(authenticateToken);

router.get("/", getCitas);
router.get("/:id", getCita);
router.post("/", postCita);
router.put("/:id", putCita);
router.delete("/:id", deleteCita);

// Ruta pública para hacer citas sin token
router.post("/public", postCitaPublic);

export default router;