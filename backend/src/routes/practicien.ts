import { Router } from "express";
import { createPracticien, getPracticiens } from "../controllers/practicien";

const router = Router();

router.post("/", createPracticien);
router.get("/", getPracticiens);

export default router;