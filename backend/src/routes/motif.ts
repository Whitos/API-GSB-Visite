import { Router } from "express";
import { createMotif, getMotifs } from "../controllers/motif";

const router = Router();

router.post("/", createMotif);
router.get("/", getMotifs);

export default router;