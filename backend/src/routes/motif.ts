import { Router } from "express";
import { createMotif, getMotifs } from "../controllers/motif";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/", authMiddleware, createMotif);
router.get("/", authMiddleware, getMotifs);

export default router;