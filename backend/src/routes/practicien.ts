import { Router } from "express";
import { createPracticien, getPracticiens, getPracticienById } from "../controllers/practicien";
import { get } from "http";

const router = Router();

router.post("/", createPracticien);
router.get("/", getPracticiens);
router.get("/:id",getPracticienById);

export default router;