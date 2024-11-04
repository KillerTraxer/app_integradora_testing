import Router from "express";
import {getCitas, getCita, postCita, putCita, deleteCita} from "../controllers/citas.controllers.js";
import authenticateToken from "../middleware/authenticateToken.js";

const router = Router();

//Rutas protegidas por token
router.use(authenticateToken);

router.get("/", getCitas);
router.get("/:id", getCita);
router.post("/", postCita);
router.put("/:id", putCita);
router.delete("/:id", deleteCita);

export default router;