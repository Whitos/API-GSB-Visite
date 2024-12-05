import { Router } from "express";
import { createPracticien, getPracticiens } from "../controllers/practicien";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/", authMiddleware, createPracticien);
router.get("/", authMiddleware, getPracticiens);

export default router;