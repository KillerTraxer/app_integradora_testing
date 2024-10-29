import Router from "express";
import {getDentistas, getDentista, postDentista, putDentista, deleteDentista} from "../controllers/dentista.controllers.js"

const router = Router();

router.get("/", getDentistas);

router.get("/:id", getDentista);

router.post("/", postDentista);

router.put("/:id", putDentista);

router.delete("/:id", deleteDentista);

export default router;