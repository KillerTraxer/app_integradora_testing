import Router from "express";
import authenticateToken from "../middleware/authenticateToken.js";
import {
    getEventos,
    postEventos,
    putEventos,
    deleteEventos,
    getAgenda,
    putAgenda,
    crearAgendaPorDefecto
} from "../controllers/agendaDoc.controller.js";

const router = Router();

router.use(authenticateToken);

// Rutas para los eventos (citas)
// router.get("/eventos", getEventos);
router.post("/eventos", postEventos);
router.put("/eventos/:agendaDocId/:updatedEvent", putEventos);
router.delete("/eventos/:agendaDocId/:eventId", deleteEventos);

// Rutas adicionales
router.get("/:dentistaId", getAgenda);
router.put("/update/:agendaDocId", putAgenda);

// Ruta para crear agenda por defecto
router.post("/por-defecto/:dentistaId", crearAgendaPorDefecto);

export default router;
