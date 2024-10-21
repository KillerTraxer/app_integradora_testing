import Router from "express";
import {getDentistas, getDentista, postDentista, putDentista, deleteDentista} from "../controllers/dentista.controllers.js"

const router = Router();

router.get("/dentista", getDentistas);

router.get("/dentista/:id", getDentista);

router.post("/dentista", postDentista);

router.put("/dentista/:id", putDentista);

router.delete("/dentista/:id", deleteDentista);

export default router;