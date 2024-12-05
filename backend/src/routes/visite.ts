import { Router } from "express";
import { createVisite, getVisites } from "../controllers/visite";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/", authMiddleware, createVisite);
router.get("/", authMiddleware, getVisites);

export default router;